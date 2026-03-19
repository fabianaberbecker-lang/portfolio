'use client';

import { useEffect, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { useThinkingStore } from '@/lib/thinking/store';
import { ProblemInput } from '@/components/thinking/ProblemInput';
import { ThinkingCanvas } from '@/components/thinking/ThinkingCanvas';
import { MatrixView } from '@/components/thinking/MatrixView';
import { ListView } from '@/components/thinking/ListView';
import { DetailPanel } from '@/components/thinking/DetailPanel';
import { Toolbar } from '@/components/thinking/Toolbar';

export default function ThinkingApp() {
  const sessionId = useThinkingStore((s) => s.sessionId);
  const view = useThinkingStore((s) => s.view);
  const selectedNodeId = useThinkingStore((s) => s.selectedNodeId);
  const load = useThinkingStore((s) => s.load);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    load();
    setReady(true);
  }, [load]);

  if (!ready) return null;

  // No session yet — show input
  if (!sessionId) {
    return (
      <div className="theme-thinking min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <ProblemInput />
      </div>
    );
  }

  return (
    <div className="theme-thinking flex h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Main view */}
        <div className="flex-1">
          {view === 'map' && (
            <ReactFlowProvider>
              <ThinkingCanvas />
            </ReactFlowProvider>
          )}
          {view === 'matrix' && <MatrixView />}
          {view === 'list' && <ListView />}
        </div>

        {/* Detail panel */}
        {selectedNodeId && <DetailPanel />}
      </div>
    </div>
  );
}
