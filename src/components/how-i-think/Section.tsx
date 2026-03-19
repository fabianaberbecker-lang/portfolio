'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface SectionProps {
  headline: string;
  text: string;
  children: ReactNode;
  reverse?: boolean;
}

export function Section({ headline, text, children, reverse }: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`relative py-24 sm:py-32 transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div
        className={`mx-auto max-w-[880px] px-6 lg:px-0 flex flex-col gap-12 ${
          reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } lg:items-center lg:gap-20`}
      >
        {/* Text side */}
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/95 mb-4 leading-tight">
            {headline}
          </h2>
          <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-[480px]">
            {text}
          </p>
        </div>

        {/* Visual side */}
        <div className="flex-1 min-w-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    </section>
  );
}
