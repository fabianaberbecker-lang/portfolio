import { ThinkingNode, ThinkingEdge } from './types';

let counter = 0;
function uid(): string {
  counter += 1;
  return `n${Date.now()}-${counter}`;
}

interface GeneratedGraph {
  nodes: ThinkingNode[];
  edges: ThinkingEdge[];
}

// ————————————————————————————————————————————————
// AI-powered generation via Claude API
// ————————————————————————————————————————————————

export async function generateThinkingGraphAI(problem: string): Promise<GeneratedGraph> {
  const res = await fetch('/api/thinking/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();

  // Transform API response into ThinkingNode/Edge format
  const nodes: ThinkingNode[] = data.nodes.map(
    (n: { type: 'hypothesis' | 'assumption' | 'risk'; label: string; notes?: string; impact: number; effort: number }) => ({
      id: uid(),
      type: n.type,
      label: n.label,
      notes: n.notes || '',
      impact: n.impact,
      effort: n.effort,
      position: { x: 0, y: 0 },
    })
  );

  // Apply layout
  const laidOut = layoutNodes(nodes);

  // Build edges from index-based references
  const edges: ThinkingEdge[] = [];
  if (Array.isArray(data.edges)) {
    for (const e of data.edges) {
      const src = laidOut[e.sourceIndex];
      const tgt = laidOut[e.targetIndex];
      if (src && tgt) {
        edges.push({
          id: `e-${src.id}-${tgt.id}`,
          source: src.id,
          target: tgt.id,
        });
      }
    }
  }

  // Fallback: if API returned no edges, generate some
  if (edges.length === 0) {
    return { nodes: laidOut, edges: generateEdges(laidOut) };
  }

  return { nodes: laidOut, edges };
}

// ————————————————————————————————————————————————
// Rule-based fallback generation
// ————————————————————————————————————————————————

const templates: Record<string, Omit<ThinkingNode, 'id' | 'position'>[]> = {
  engagement: [
    { type: 'hypothesis', label: 'Onboarding flow is too complex', impact: 80, effort: 50 },
    { type: 'hypothesis', label: 'Core feature value is unclear', impact: 90, effort: 60 },
    { type: 'hypothesis', label: 'Notification fatigue drives churn', impact: 60, effort: 30 },
    { type: 'assumption', label: 'Users understand the product purpose', impact: 70, effort: 20 },
    { type: 'assumption', label: 'Metrics accurately track engagement', impact: 50, effort: 40 },
    { type: 'assumption', label: 'Competitors offer a better experience', impact: 65, effort: 70 },
    { type: 'risk', label: 'Fixing symptoms without root cause', impact: 85, effort: 30 },
    { type: 'risk', label: 'Data sample too small for conclusions', impact: 55, effort: 20 },
  ],
  prioritization: [
    { type: 'hypothesis', label: 'Revenue impact should drive priority', impact: 85, effort: 40 },
    { type: 'hypothesis', label: 'Technical debt blocks new features', impact: 70, effort: 80 },
    { type: 'hypothesis', label: 'User requests reflect real needs', impact: 60, effort: 30 },
    { type: 'hypothesis', label: 'Quick wins build team momentum', impact: 50, effort: 20 },
    { type: 'assumption', label: 'Team capacity is fixed this quarter', impact: 40, effort: 10 },
    { type: 'assumption', label: 'Stakeholder alignment already exists', impact: 75, effort: 50 },
    { type: 'risk', label: 'Scope creep on chosen feature', impact: 65, effort: 35 },
    { type: 'risk', label: 'Deprioritized items cause user churn', impact: 80, effort: 60 },
  ],
  conversion: [
    { type: 'hypothesis', label: 'Pricing page causes drop-off', impact: 85, effort: 40 },
    { type: 'hypothesis', label: 'Trust signals are missing', impact: 70, effort: 25 },
    { type: 'hypothesis', label: 'Too many steps in the funnel', impact: 90, effort: 60 },
    { type: 'assumption', label: 'Users intend to purchase', impact: 60, effort: 15 },
    { type: 'assumption', label: 'Traffic quality is consistent', impact: 50, effort: 30 },
    { type: 'assumption', label: 'Mobile experience is adequate', impact: 55, effort: 45 },
    { type: 'risk', label: 'A/B test results misleading', impact: 65, effort: 20 },
    { type: 'risk', label: 'Simplification removes key info', impact: 75, effort: 50 },
  ],
  default: [
    { type: 'hypothesis', label: 'The root cause is misidentified', impact: 80, effort: 50 },
    { type: 'hypothesis', label: 'Incremental changes are insufficient', impact: 70, effort: 60 },
    { type: 'hypothesis', label: 'External factors are being overlooked', impact: 65, effort: 35 },
    { type: 'hypothesis', label: 'A structural shift is needed', impact: 85, effort: 75 },
    { type: 'assumption', label: 'Current data tells the full story', impact: 60, effort: 20 },
    { type: 'assumption', label: 'Past solutions remain relevant', impact: 50, effort: 30 },
    { type: 'assumption', label: 'Stakeholders share the same goal', impact: 55, effort: 25 },
    { type: 'risk', label: 'Analysis paralysis delays action', impact: 70, effort: 15 },
    { type: 'risk', label: 'Solution creates new problems', impact: 75, effort: 40 },
  ],
};

function detectCategory(problem: string): string {
  const lower = problem.toLowerCase();
  if (/engag|drop|churn|retain|active/.test(lower)) return 'engagement';
  if (/priorit|feature|roadmap|next|backlog/.test(lower)) return 'prioritization';
  if (/convert|funnel|signup|onboard|checkout/.test(lower)) return 'conversion';
  return 'default';
}

// Arrange nodes in a radial layout
function layoutNodes(nodes: ThinkingNode[]): ThinkingNode[] {
  const cx = 400;
  const cy = 300;
  const radius = 260;
  const count = nodes.length;
  return nodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return {
      ...node,
      position: {
        x: Math.round(cx + radius * Math.cos(angle)),
        y: Math.round(cy + radius * Math.sin(angle)),
      },
    };
  });
}

// Create edges between related nodes
function generateEdges(nodes: ThinkingNode[]): ThinkingEdge[] {
  const edges: ThinkingEdge[] = [];
  const hypotheses = nodes.filter((n) => n.type === 'hypothesis');
  const assumptions = nodes.filter((n) => n.type === 'assumption');
  const risks = nodes.filter((n) => n.type === 'risk');

  if (assumptions.length > 0 && hypotheses.length > 0) {
    edges.push({ id: `e-${assumptions[0].id}-${hypotheses[0].id}`, source: assumptions[0].id, target: hypotheses[0].id });
  }
  if (risks.length > 0 && hypotheses.length > 1) {
    edges.push({ id: `e-${risks[0].id}-${hypotheses[1].id}`, source: risks[0].id, target: hypotheses[1].id });
  }
  if (assumptions.length > 1 && risks.length > 0) {
    edges.push({ id: `e-${assumptions[1].id}-${risks[0].id}`, source: assumptions[1].id, target: risks[0].id });
  }
  if (hypotheses.length > 0 && risks.length > 0) {
    const h = hypotheses[hypotheses.length - 1];
    const r = risks[risks.length - 1];
    if (!edges.find((e) => e.source === h.id && e.target === r.id)) {
      edges.push({ id: `e-${h.id}-${r.id}`, source: h.id, target: r.id });
    }
  }

  return edges;
}

export function generateThinkingGraph(problem: string): GeneratedGraph {
  const category = detectCategory(problem);
  const template = templates[category];

  const rawNodes: ThinkingNode[] = template.map((t) => ({
    ...t,
    id: uid(),
    position: { x: 0, y: 0 },
  }));

  const nodes = layoutNodes(rawNodes);
  const edges = generateEdges(nodes);

  return { nodes, edges };
}
