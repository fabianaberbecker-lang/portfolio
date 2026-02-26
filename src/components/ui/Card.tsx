import { ReactNode } from 'react';
import Link from 'next/link';

interface CardProps {
    children: ReactNode;
    href?: string;
    className?: string;
    variant?: 'default' | 'cinema';
}

export function Card({ children, href, className = '', variant = 'default' }: CardProps) {
    const baseClass =
        variant === 'cinema'
            ? `group overflow-hidden rounded-2xl bg-surface transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-accent/10 ${className}`
            : `group overflow-hidden rounded-[2rem] border border-border bg-surface p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-foreground/5 hover:-translate-y-1 ${className}`;

    if (href) {
        return (
            <Link href={href} className={`block ${baseClass}`}>
                {children}
            </Link>
        );
    }

    return <div className={baseClass}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <h3 className={`text-xl font-bold lowercase tracking-tight text-foreground ${className}`}>
            {children}
        </h3>
    );
}

export function CardDescription({ children }: { children: ReactNode }) {
    return <p className="mt-2 text-sm leading-relaxed text-muted">{children}</p>;
}
