'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
  ConnectionMode,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ThinkingNodeCard } from './ThinkingNodeCard';
import { useThinkingStore } from '@/lib/thinking/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes: any = { thinking: ThinkingNodeCard };

export function ThinkingCanvas() {
  const nodes = useThinkingStore((s) => s.nodes);
  const edges = useThinkingStore((s) => s.edges);
  const selectedNodeId = useThinkingStore((s) => s.selectedNodeId);
  const selectNode = useThinkingStore((s) => s.selectNode);
  const updateNodePosition = useThinkingStore((s) => s.updateNodePosition);
  const addEdge = useThinkingStore((s) => s.addEdge);
  const save = useThinkingStore((s) => s.save);

  const flowNodes: Node[] = useMemo(
    () =>
      nodes.map((n) => ({
        id: n.id,
        type: 'thinking',
        position: n.position,
        data: { nodeType: n.type, label: n.label, selected: n.id === selectedNodeId },
      })),
    [nodes, selectedNodeId]
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'default',
        style: { stroke: 'rgba(255,255,255,0.12)', strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.12)', width: 16, height: 16 },
        animated: false,
      })),
    [edges]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      // Apply position changes to store
      for (const change of changes) {
        if (change.type === 'position' && change.position) {
          updateNodePosition(change.id, change.position);
        }
      }
    },
    [updateNodePosition]
  );

  const onEdgesChange: OnEdgesChange = useCallback(() => {
    // Edges are managed by our store
  }, []);

  const onConnect: OnConnect = useCallback(
    (connection) => {
      if (connection.source && connection.target) {
        addEdge({
          id: `e-${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
        });
      }
    },
    [addEdge]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const onNodeDragStop = useCallback(() => {
    save();
  }, [save]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(255,255,255,0.04)" />
        <Controls
          showInteractive={false}
          className="!bg-[var(--surface)] !border-[var(--border-color)] !shadow-lg !shadow-black/20 [&_button]:!bg-[var(--surface)] [&_button]:!border-[var(--border-color)] [&_button]:!text-[var(--muted)] [&_button:hover]:!bg-[var(--surface-hover)]"
        />
      </ReactFlow>
    </div>
  );
}
