import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are a structured thinking assistant for product managers. Given a problem statement, generate a structured analysis with hypotheses, assumptions, and risks.

Return ONLY valid JSON with this exact structure:
{
  "nodes": [
    {
      "type": "hypothesis" | "assumption" | "risk",
      "label": "short label (max 8 words)",
      "notes": "1-2 sentence explanation",
      "impact": number (0-100),
      "effort": number (0-100)
    }
  ],
  "edges": [
    {
      "sourceIndex": number,
      "targetIndex": number
    }
  ]
}

Rules:
- Generate 4-5 hypotheses, 3-4 assumptions, 2-3 risks (10-12 nodes total)
- Each label should be concise and specific to the problem
- Impact = how much solving/addressing this matters (0-100)
- Effort = how much work it takes to address/validate (0-100)
- Edges connect related nodes (e.g., an assumption that underlies a hypothesis, or a risk that threatens a hypothesis)
- Generate 4-6 meaningful edges
- Notes should explain WHY this matters for the specific problem
- Be specific to the problem, not generic`;

export async function POST(request: Request) {
  try {
    const { problem } = await request.json();

    if (!problem || typeof problem !== 'string' || problem.trim().length < 5) {
      return NextResponse.json(
        { error: 'Problem statement must be at least 5 characters' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 503 }
      );
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyze this problem and generate structured thinking nodes:\n\n"${problem.trim()}"`,
        },
      ],
    });

    // Extract text content
    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No text response' }, { status: 500 });
    }

    // Parse JSON from response (handle potential markdown code blocks)
    let jsonStr = textBlock.text.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(jsonStr);

    // Validate structure
    if (!Array.isArray(parsed.nodes) || parsed.nodes.length === 0) {
      return NextResponse.json({ error: 'Invalid response structure' }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error('Thinking generation error:', error);
    const message = error instanceof Error ? error.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
