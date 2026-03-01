import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'cinema' | 'nightlife' | 'flowboard';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}

const variants = {
    primary:
        'bg-foreground text-background hover:opacity-90 shadow-lg shadow-foreground/10',
    secondary:
        'bg-transparent text-foreground border-2 border-foreground hover:bg-foreground hover:text-background',
    ghost:
        'text-muted hover:text-foreground hover:bg-surface-hover',
    cinema:
        'bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/30',
    nightlife:
        'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-lg shadow-amber-500/30',
    flowboard:
        'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/30',
};

const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
};

export function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold lowercase tracking-wide transition-all active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
