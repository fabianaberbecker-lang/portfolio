'use client';

import { useState } from 'react';
import type { Connector } from '@/lib/flowboard/types';
import { useFlowBoardStore } from '@/lib/flowboard/store';

interface CanvasConnectorProps {
  connector: Connector;
  path: string;
}

export function CanvasConnector({ connector, path }: CanvasConnectorProps) {
  const deleteConnector = useFlowBoardStore((s) => s.deleteConnector);
  const updateConnector = useFlowBoardStore((s) => s.updateConnector);
  const [isHovered, setIsHovered] = useState(false);

  const strokeColor = isHovered ? 'rgba(129,140,248,0.7)' : 'rgba(99,102,241,0.4)';
  const strokeWidth = isHovered ? 2.5 : 2;

  return (
    <g>
      {/* Invisible wide path for click target */}
      <path
        d={path}
        stroke="transparent"
        strokeWidth="16"
        fill="none"
        className="pointer-events-auto cursor-pointer"
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          if (confirm('Delete this connector?')) {
            deleteConnector(connector.id);
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const newStyle = connector.style === 'solid' ? 'dashed' : 'solid';
          updateConnector(connector.id, { style: newStyle });
        }}
      />
      {/* Visible path */}
      <path
        d={path}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={connector.style === 'dashed' ? '6 3' : undefined}
        fill="none"
        markerEnd={`url(#arrowhead-${isHovered ? 'hover' : 'default'})`}
        className="transition-all duration-150"
      />
      {/* Arrowhead markers */}
      <defs>
        <marker id="arrowhead-default" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="rgba(99,102,241,0.4)" />
        </marker>
        <marker id="arrowhead-hover" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="rgba(129,140,248,0.7)" />
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
