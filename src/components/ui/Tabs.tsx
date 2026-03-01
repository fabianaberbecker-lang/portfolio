'use client';

import { ReactNode, useState } from 'react';

interface Tab {
    id: string;
    label: string;
    count?: number;
    content: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    variant?: 'default' | 'cinema' | 'flowboard';
}

export function Tabs({ tabs, defaultTab, variant = 'default' }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? '');

    const active = tabs.find((t) => t.id === activeTab);

    return (
        <div>
            {/* Tab Bar */}
            <div
                className={`flex gap-1 rounded-full p-1 ${variant === 'cinema'
                        ? 'bg-white/5 border border-white/10'
                        : variant === 'flowboard'
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-foreground/5 border border-border'
                    }`}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold lowercase tracking-wide transition-all ${activeTab === tab.id
                                ? variant === 'cinema'
                                    ? 'bg-accent text-white shadow-lg shadow-accent/30'
                                    : variant === 'flowboard'
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                    : 'bg-foreground text-background shadow-sm'
                                : variant === 'cinema'
                                    ? 'text-white/50 hover:text-white'
                                    : variant === 'flowboard'
                                    ? 'text-white/50 hover:text-white'
                                    : 'text-muted hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className="ml-1.5 text-xs opacity-60">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6 animate-fade-in-up">{active?.content}</div>
        </div>
    );
}
