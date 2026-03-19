'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/how-i-think/Section';
import { DiagramProblem } from '@/components/how-i-think/DiagramProblem';
import { DiagramTradeoffs } from '@/components/how-i-think/DiagramTradeoffs';
import { DiagramMatrix } from '@/components/how-i-think/DiagramMatrix';
import { DiagramAssumptions } from '@/components/how-i-think/DiagramAssumptions';
import { DiagramLoop } from '@/components/how-i-think/DiagramLoop';

export default function HowIThinkPage() {
  return (
    <div className="theme-thinking min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <header className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-[880px] px-6 lg:px-0 text-center">
          <span className="inline-block rounded-full border border-[#6b8afd]/20 bg-[#6b8afd]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6b8afd] mb-6">
            thinking process
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white/95 mb-5 leading-[1.1]">
            How I Think
          </h1>
          <p className="text-base sm:text-lg text-white/40 max-w-[520px] mx-auto leading-relaxed">
            My approach to product thinking — from framing problems to making decisions that learn.
          </p>
        </div>

        {/* Subtle gradient accent */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(107,138,253,0.06)_0%,transparent_70%)]" />
        </div>
      </header>

      {/* Divider */}
      <div className="mx-auto max-w-[120px] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Section 1 — Problem Framing */}
      <Section
        headline="I don't start with solutions."
        text="Before jumping to ideas, I define the problem space. What do we actually know? What questions should we be asking? Good thinking starts with the right frame."
      >
        <DiagramProblem />
      </Section>

      {/* Section 2 — Trade-offs */}
      <Section
        headline="Every decision is a trade-off."
        text="Product decisions always impact multiple dimensions. Choosing speed affects quality. Prioritizing growth shifts resources from stability. I think in trade-offs, not absolutes."
        reverse
      >
        <DiagramTradeoffs />
      </Section>

      {/* Section 3 — Prioritization */}
      <Section
        headline="Impact over intuition."
        text="I prioritize based on where impact is highest relative to effort. Not everything urgent is important. A clear matrix helps cut through the noise."
      >
        <DiagramMatrix />
      </Section>

      {/* Section 4 — Assumptions */}
      <Section
        headline="I challenge my own assumptions."
        text="Assumptions are the riskiest part of any plan. I treat them as hypotheses — something to validate, not accept. The fastest path to clarity is through testing."
        reverse
      >
        <DiagramAssumptions />
      </Section>

      {/* Section 5 — Decision Loop */}
      <Section
        headline="Decisions are experiments."
        text="I don't see decisions as final. Every choice is a loop: decide, build, measure, learn. Then repeat with better information. Progress comes from cycles, not certainty."
      >
        <DiagramLoop />
      </Section>

      {/* Divider */}
      <div className="mx-auto max-w-[120px] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Bridge CTA */}
      <section className="py-28 sm:py-36">
        <div className="mx-auto max-w-[880px] px-6 lg:px-0 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white/95 mb-4">
            Now try it yourself.
          </h2>
          <p className="text-base sm:text-lg text-white/40 max-w-[440px] mx-auto mb-10 leading-relaxed">
            Enter a problem and watch it transform into a structured thinking space — with hypotheses, assumptions, risks, and priorities.
          </p>
          <Link href="/apps/thinking/app">
            <Button variant="thinking" size="lg">
              open thinking tool →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
