"use client";

import { useState } from "react";
import { architectures, ArchitectureBlock, Architecture } from "@/lib/mock-data";
import {
  Boxes,
  ArrowRight,
  Info,
  ChevronRight,
  Layers,
  Zap,
  ArrowDown,
} from "lucide-react";

function BlockCard({
  block,
  isSelected,
  onClick,
}: {
  block: ArchitectureBlock;
  isSelected: boolean;
  onClick: () => void;
}) {
  const typeIcons: Record<string, string> = {
    embed: "E",
    attention: "A",
    ffn: "F",
    norm: "N",
    output: "O",
    routing: "R",
    ssm: "S",
    head: "H",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
        isSelected
          ? "border-abyss-500/50 bg-abyss-950/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
          : "border-surface-5 bg-surface-3 hover:border-abyss-500/30 hover:bg-surface-4"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ backgroundColor: block.color + "33", borderColor: block.color + "66", borderWidth: 1 }}
        >
          {typeIcons[block.type] || "?"}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-white truncate">{block.name}</div>
          {block.params && (
            <div className="text-[10px] font-mono text-zinc-500">{block.params}</div>
          )}
        </div>
      </div>
    </button>
  );
}

function BlockDetail({ block }: { block: ArchitectureBlock }) {
  return (
    <div className="glass-panel p-5 animate-in">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
          style={{ backgroundColor: block.color + "33", color: block.color }}
        >
          {block.name[0]}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{block.name}</h3>
          <span className="text-xs text-zinc-500 font-mono uppercase">{block.type}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-wider">Description</label>
          <p className="text-sm text-zinc-300 mt-1 leading-relaxed">{block.description}</p>
        </div>

        {block.params && (
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider">Parameter Count</label>
            <div className="mt-1 bg-surface-1 rounded-lg p-3 font-mono text-sm text-accent-cyan">
              {block.params}
            </div>
          </div>
        )}

        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-wider">Layer Type</label>
          <div className="mt-1 flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: block.color }}
            />
            <span className="text-sm capitalize">{block.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchitectureDiagram({ arch }: { arch: Architecture }) {
  const [selectedBlock, setSelectedBlock] = useState<ArchitectureBlock | null>(null);

  // Group blocks by flow position
  const mainFlow = arch.blocks.filter((b) => !["expert1", "expert2", "expert_n"].includes(b.id) || arch.name.includes("Mixture"));

  return (
    <div className="flex gap-6 h-full">
      {/* Diagram */}
      <div className="flex-1 overflow-y-auto">
        <div className="glass-panel p-6">
          <h3 className="text-sm font-semibold mb-1">{arch.name}</h3>
          <p className="text-xs text-zinc-500 mb-6">{arch.description}</p>

          <div className="flex flex-col items-center gap-2">
            {arch.blocks.map((block, i) => (
              <div key={block.id} className="w-full max-w-md">
                <BlockCard
                  block={block}
                  isSelected={selectedBlock?.id === block.id}
                  onClick={() => setSelectedBlock(block)}
                />
                {i < arch.blocks.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-4 h-4 text-zinc-600" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Loop indicator for residual connections */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <div className="h-px w-12 bg-abyss-500/30" />
            <span className="font-mono">x N layers (residual connections)</span>
            <div className="h-px w-12 bg-abyss-500/30" />
          </div>
        </div>

        {/* Connection info */}
        <div className="glass-panel p-4 mt-4">
          <h4 className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Data Flow Connections
          </h4>
          <div className="flex flex-wrap gap-2">
            {arch.connections.map(([from, to], i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 bg-surface-3 px-2 py-1 rounded"
              >
                <span className="text-accent-cyan">{from}</span>
                <ArrowRight className="w-3 h-3" />
                <span className="text-accent-amber">{to}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <div className="w-80 shrink-0">
        {selectedBlock ? (
          <BlockDetail block={selectedBlock} />
        ) : (
          <div className="glass-panel p-5 flex flex-col items-center justify-center h-64 text-center">
            <Info className="w-8 h-8 text-zinc-600 mb-3" />
            <p className="text-sm text-zinc-500">Click a block to inspect</p>
            <p className="text-xs text-zinc-600 mt-1">
              View parameter formulas, descriptions, and connections
            </p>
          </div>
        )}

        {/* Architecture Stats */}
        <div className="glass-panel p-4 mt-4">
          <h4 className="text-xs font-semibold text-zinc-400 mb-3">Architecture Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Total Blocks</span>
              <span className="font-mono">{arch.blocks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Connections</span>
              <span className="font-mono">{arch.connections.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Attention Layers</span>
              <span className="font-mono">{arch.blocks.filter((b) => b.type === "attention").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">FFN Layers</span>
              <span className="font-mono">{arch.blocks.filter((b) => b.type === "ffn").length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArchitectureExplorer() {
  const [activeArch, setActiveArch] = useState<string>("transformer");

  return (
    <div className="h-screen flex flex-col">
      <header className="shrink-0 border-b border-white/5 bg-surface-1/50 backdrop-blur-xl px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Boxes className="w-5 h-5 text-abyss-400" />
            <div>
              <h2 className="text-sm font-semibold">Model Architecture Explorer</h2>
              <p className="text-[10px] text-zinc-500">
                Interactive diagrams of Transformer, Mamba, and MoE architectures
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-surface-2 rounded-lg p-0.5 border border-surface-4">
            {Object.entries(architectures).map(([key, arch]) => (
              <button
                key={key}
                onClick={() => setActiveArch(key)}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${
                  activeArch === key
                    ? "bg-abyss-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {arch.name.split(" (")[0]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden p-6">
        <ArchitectureDiagram arch={architectures[activeArch]} />
      </div>
    </div>
  );
}
