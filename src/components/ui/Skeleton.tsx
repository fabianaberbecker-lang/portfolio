interface SkeletonProps {
    className?: string;
    variant?: 'default' | 'cinema';
}

export function Skeleton({ className = '', variant = 'default' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded-2xl ${variant === 'cinema' ? 'bg-white/5' : 'bg-foreground/5'
                } ${className}`}
            aria-hidden
        />
    );
}

export function CardSkeleton({ variant = 'default' }: { variant?: 'default' | 'cinema' }) {
    return (
        <div className={`rounded-2xl overflow-hidden ${variant === 'cinema' ? 'bg-white/5' : 'border border-border bg-surface'}`}>
            <Skeleton className="aspect-[2/3] w-full rounded-none" variant={variant} />
            <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-2/3" variant={variant} />
                <Skeleton className="h-3 w-1/3" variant={variant} />
            </div>
        </div>
    );
}

export function DetailSkeleton({ variant = 'default' }: { variant?: 'default' | 'cinema' }) {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-8 sm:flex-row">
                <Skeleton className="h-80 w-56 shrink-0 rounded-2xl" variant={variant} />
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-3/4" variant={variant} />
                    <Skeleton className="h-4 w-1/2" variant={variant} />
                    <Skeleton className="h-4 w-full" variant={variant} />
                    <Skeleton className="h-4 w-full" variant={variant} />
                    <Skeleton className="h-4 w-2/3" variant={variant} />
                </div>
            </div>
            <Skeleton className="h-14 w-full rounded-full" variant={variant} />
        </div>
    );
}
