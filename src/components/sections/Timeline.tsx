interface TimelineItem {
    period: string;
    role: string;
    company: string;
    description: string;
    type: 'work' | 'education';
}

interface TimelineProps {
    items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
    return (
        <div className="relative">
            {items.map((item, index) => (
                <div key={index} className="flex gap-6 pb-8 last:pb-0">
                    {/* Left column: dot + line */}
                    <div className="relative flex flex-col items-center">
                        {/* Dot */}
                        <div
                            className={`relative z-10 h-3 w-3 shrink-0 rounded-full border-2 border-background ${
                                item.type === 'work' ? 'bg-pop-purple' : 'bg-pop-yellow'
                            }`}
                            style={{ marginTop: '4px' }}
                        />
                        {/* Connecting line */}
                        {index < items.length - 1 && (
                            <div className="w-[2px] grow bg-border" />
                        )}
                    </div>

                    {/* Right column: content */}
                    <div className="pb-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted">
                            {item.period}
                        </p>
                        <h3 className="mt-1 text-lg font-bold lowercase text-foreground">
                            {item.role}
                        </h3>
                        <p
                            className={`text-sm ${
                                item.type === 'work' ? 'text-pop-purple' : 'text-pop-yellow'
                            }`}
                        >
                            {item.company}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">
                            {item.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
