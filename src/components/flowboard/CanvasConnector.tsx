'use client';

import type { Connector } from '@/lib/flowboard/types';
import { useFlowBoardStore } from '@/lib/flowboard/store';

interface CanvasConnectorProps {
  connector: Connector;
  path: string;
}

export function CanvasConnector({ connector, path }: CanvasConnectorProps) {
  const deleteConnector = useFlowBoardStore((s) => s.deleteConnector);

  return (
    <g>
      {/* Invisible wide path for click target */}
      <path
        d={path}
        stroke="transparent"
        strokeWidth="12"
        fill="none"
        className="pointer-events-auto cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          if (confirm('Delete this connector?')) {
            deleteConnector(connector.id);
          }
        }}
      />
      {/* Visible path */}
      <path
        d={path}
        stroke="rgba(99,102,241,0.4)"
        strokeWidth="2"
        strokeDasharray={connector.style === 'dashed' ? '6 3' : undefined}
        fill="none"
        markerEnd="url(#arrowhead)"
      />
      {/* Arrowhead marker */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="rgba(99,102,241,0.4)"
          />
        </marker>
      </defs>
      {/* Label */}
      {connector.label && (
        <text
          className="pointer-events-none fill-white/30 text-[10px]"
          textAnchor="middle"
        >
          <textPath href={`#path-${connector.id}`} startOffset="50%">
            {connector.label}
          </textPath>
        </text>
      )}
    </g>
  );
}
