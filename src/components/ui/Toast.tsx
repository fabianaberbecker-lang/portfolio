'use client';

import { useEffect, useState } from 'react';

interface ToastMessage {
    id: number;
    text: string;
    type: 'error' | 'info';
}

let toastId = 0;
const listeners: Set<(msg: ToastMessage) => void> = new Set();

export function showToast(text: string, type: 'error' | 'info' = 'info') {
    const msg: ToastMessage = { id: ++toastId, text, type };
    listeners.forEach((fn) => fn(msg));
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const handler = (msg: ToastMessage) => {
            setToasts((prev) => [...prev, msg]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== msg.id));
            }, 5000);
        };
        listeners.add(handler);
        return () => {
            listeners.delete(handler);
        };
    }, []);

    if (!toasts.length) return null;

    return (
        <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`pointer-events-auto animate-[slideIn_0.3s_ease] rounded-xl border px-4 py-3 text-sm shadow-lg ${t.type === 'error'
                            ? 'border-red-500/20 bg-red-500/10 text-red-400'
                            : 'border-accent/20 bg-accent/10 text-accent'
                        }`}
                >
                    {t.text}
                </div>
            ))}
        </div>
    );
}
