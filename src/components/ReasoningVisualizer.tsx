"use client";

import { useState } from "react";
import { ReasoningNode } from "@/lib/store";
import { sampleReasoningTree } from "@/lib/mock-data";
import {
  GitBranch,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Scissors,
  Loader2,
  Eye,
  BarChart3,
} from "lucide-react";

const statusConfig = {
  exploring: { icon: Loader2, color: "text-accent-amber", bg: "bg-accent-amber/10", border: "border-accent-amber/30", label: "Exploring" },
  accepted: { icon: CheckCircle2, color: "text-accent-emerald", bg: "bg-accent-emerald/10", border: "border-accent-emerald/30", label: "Accepted" },
  rejected: { icon: XCircle, color: "text-accent-rose", bg: "bg-accent-rose/10", border: "border-accent-rose/30", label: "Rejected" },
  pruned: { icon: Scissors, color: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/30", label: "Pruned" },
};

function TreeNode({
  node,
  depth = 0,
  selectedId,
  onSelect,
}: {
  node: ReasoningNode;
  depth?: number;
  selectedId: string | null;
  onSelect: (node: ReasoningNode) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const config = statusConfig[node.status];
  const StatusIcon = config.icon;
  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div className="relative">
      {/* Connector line */}
      {depth > 0 && (
        <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-abyss-500/30 to-transparent" />
      )}
      {depth > 0 && (
        <div className="absolute -left-6 top-5 w-6 h-px bg-abyss-500/30" />
      )}

      <div className="mb-1">
        <button
          onClick={() => {
            onSelect(node);
            if (hasChildren) setExpanded(!expanded);
          }}
          className={`w-full text-left flex items-start gap-2 p-2.5 rounded-lg transition-all duration-150 ${
            isSelected
              ? `${config.bg} ${config.border} border glow-border`
              : "hover:bg-surface-3/50 border border-transparent"
          }`}
        >
          {hasChildren ? (
            <span className="mt-0.5 text-zinc-500">
              {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </span>
          ) : (
            <span className="w-3.5" />
          )}
          <StatusIcon className={`w-4 h-4 mt-0.5 shrink-0 ${config.color} ${
            node.status === "exploring" ? "animate-spin" : ""
          }`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white truncate">{node.label}</span>
              <span className={`badge text-[10px] ${config.bg} ${config.color} border ${config.border}`}>
                {config.label}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {(node.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">{node.content}</p>
          </div>
        </button>

        {expanded && hasChildren && (
          <div className="ml-6 pl-4 mt-0.5 relative">
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NodeDetail({ node }: { node: ReasoningNode }) {
  const config = statusConfig[node.status];
  const StatusIcon = config.icon;

  return (
    <div className="glass-panel p-5 animate-in">
      <div className="flex items-center gap-3 mb-4">
        <StatusIcon className={`w-5 h-5 ${config.color}`} />
        <h3 className="text-lg font-semibold">{node.label}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-wider">Content</label>
          <p className="text-sm text-zinc-300 mt-1 leading-relaxed">{node.content}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="stat-card">
            <span className="text-xs text-zinc-500">Confidence</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">{(node.confidence * 100).toFixed(1)}%</span>
              <div className="flex-1 h-1.5 bg-surface-4 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    node.confidence > 0.8 ? "bg-accent-emerald" :
                    node.confidence > 0.5 ? "bg-accent-amber" : "bg-accent-rose"
                  }`}
                  style={{ width: `${node.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <span className="text-xs text-zinc-500">Status</span>
            <span className={`text-lg font-bold ${config.color}`}>{config.label}</span>
          </div>
          <div className="stat-card">
            <span className="text-xs text-zinc-500">Children</span>
            <span className="text-lg font-bold text-white">{node.children.length}</span>
          </div>
        </div>

        {node.children.length > 0 && (
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider">Child Branches</label>
            <div className="mt-2 space-y-1">
              {node.children.map((child) => {
                const childConfig = statusConfig[child.status];
                return (
                  <div key={child.id} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${childConfig.bg} border ${childConfig.border}`} />
                    <span className="text-zinc-300">{child.label}</span>
                    <span className="text-zinc-600 font-mono text-xs">
                      {(child.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TreeStats({ node }: { node: ReasoningNode }) {
  const countNodes = (n: ReasoningNode): { total: number; accepted: number; rejected: number; pruned: number } => {
    const result = { total: 1, accepted: 0, rejected: 0, pruned: 0 };
    if (n.status === "accepted") result.accepted = 1;
    if (n.status === "rejected") result.rejected = 1;
    if (n.status === "pruned") result.pruned = 1;
    for (const child of n.children) {
      const childCounts = countNodes(child);
      result.total += childCounts.total;
      result.accepted += childCounts.accepted;
      result.rejected += childCounts.rejected;
      result.pruned += childCounts.pruned;
    }
    return result;
  };

  const getMaxDepth = (n: ReasoningNode, d: number = 0): number => {
    if (n.children.length === 0) return d;
    return Math.max(...n.children.map((c) => getMaxDepth(c, d + 1)));
  };

  const stats = countNodes(node);
  const maxDepth = getMaxDepth(node);
  const avgConfidence = (() => {
    const collect = (n: ReasoningNode): number[] => [
      n.confidence,
      ...n.children.flatMap(collect),
    ];
    const all = collect(node);
    return all.reduce((a, b) => a + b, 0) / all.length;
  })();

  return (
    <div className="grid grid-cols-5 gap-3 mb-6">
      {[
        { label: "Total Nodes", value: stats.total, color: "text-white" },
        { label: "Accepted", value: stats.accepted, color: "text-accent-emerald" },
        { label: "Rejected", value: stats.rejected, color: "text-accent-rose" },
        { label: "Max Depth", value: maxDepth, color: "text-accent-cyan" },
        { label: "Avg Confidence", value: `${(avgConfidence * 100).toFixed(0)}%`, color: "text-accent-amber" },
      ].map((stat) => (
        <div key={stat.label} className="stat-card text-center">
          <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
          <span className="text-[10px] text-zinc-500">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ReasoningVisualizer() {
  const [selectedNode, setSelectedNode] = useState<ReasoningNode | null>(null);

  return (
    <div className="h-screen flex flex-col">
      <header className="shrink-0 border-b border-white/5 bg-surface-1/50 backdrop-blur-xl px-6 py-3">
        <div className="flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-abyss-400" />
          <div>
            <h2 className="text-sm font-semibold">Reasoning Trace Visualizer</h2>
            <p className="text-[10px] text-zinc-500">
              Explore how the model navigates reasoning paths
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Tree View */}
        <div className="flex-1 overflow-y-auto p-6">
          <TreeStats node={sampleReasoningTree} />
          <div className="glass-panel p-4">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-300">Reasoning Tree</span>
              <div className="flex-1" />
              <div className="flex items-center gap-3 text-[10px]">
                {Object.entries(statusConfig).map(([key, config]) => (
                  <span key={key} className={`flex items-center gap-1 ${config.color}`}>
                    <div className={`w-2 h-2 rounded-full ${config.bg} border ${config.border}`} />
                    {config.label}
                  </span>
                ))}
              </div>
            </div>
            <TreeNode
              node={sampleReasoningTree}
              selectedId={selectedNode?.id || null}
              onSelect={setSelectedNode}
            />
          </div>
        </div>

        {/* Detail Panel */}
        <div className="w-96 border-l border-white/5 bg-surface-1/30 overflow-y-auto p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-300">Node Details</span>
          </div>
          {selectedNode ? (
            <NodeDetail node={selectedNode} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <GitBranch className="w-8 h-8 text-zinc-600 mb-3" />
              <p className="text-sm text-zinc-500">Click a node to inspect</p>
              <p className="text-xs text-zinc-600 mt-1">View confidence scores, content, and child branches</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
