import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    variant?: 'default' | 'cinema' | 'flowboard';
}

export function Input({ icon, variant = 'default', className = '', ...props }: InputProps) {
    return (
        <div className="relative">
            {icon && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-muted">
                    {icon}
                </div>
            )}
            <input
                className={`w-full rounded-full border px-6 py-4 text-base outline-none transition-all ${icon ? 'pl-13' : ''
                    } ${variant === 'cinema'
                        ? 'border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-white/10'
                        : variant === 'flowboard'
                        ? 'border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white/10'
                        : 'border-border bg-surface text-foreground placeholder-muted/50 focus:border-foreground focus:ring-2 focus:ring-foreground/10'
                    } ${className}`}
                {...props}
            />
        </div>
    );
}
