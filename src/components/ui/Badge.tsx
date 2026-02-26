import { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'accent' | 'success' | 'warning' | 'cinema';
    className?: string;
}

const variants = {
    default: 'bg-foreground/5 text-foreground border-foreground/10',
    accent: 'bg-pop-purple/10 text-pop-purple border-pop-purple/20',
    success: 'bg-pop-green/10 text-pop-green border-pop-green/20',
    warning: 'bg-pop-yellow/20 text-foreground border-pop-yellow/30',
    cinema: 'bg-white/10 text-white/80 border-white/10',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold lowercase tracking-wide ${variants[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
