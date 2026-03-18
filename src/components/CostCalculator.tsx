"use client";

import { useState, useMemo } from "react";
import { gpuSpecs } from "@/lib/mock-data";
import { Calculator, DollarSign, Cpu, Zap, Clock, Server } from "lucide-react";

interface CostBreakdown {
  totalCost: number;
  gpuCost: number;
  energyCost: number;
  numGpus: number;
  totalFlops: number;
  tokensProcessed: number;
  costPerToken: number;
  trainingDays: number;
}

function calculateCost(
  modelParams: number, // in billions
  gpuType: string,
  trainingHours: number,
  numGpus: number,
  tokensPerParam: number = 20
): CostBreakdown {
  const gpu = gpuSpecs[gpuType];
  const totalTokens = modelParams * tokensPerParam * 1e9; // Chinchilla-optimal
  const totalFlops = 6 * modelParams * 1e9 * totalTokens; // 6 * N * D approximation
  const gpuCost = gpu.costPerHour * numGpus * trainingHours;
  const energyCostPerGpuHour = 0.10; // $0.10 per kWh, ~300W per GPU
  const energyCost = 0.3 * energyCostPerGpuHour * numGpus * trainingHours;
  const totalCost = gpuCost + energyCost;
  const costPerToken = totalCost / totalTokens;
  const trainingDays = trainingHours / 24;

  return {
    totalCost,
    gpuCost,
    energyCost,
    numGpus,
    totalFlops,
    tokensProcessed: totalTokens,
    costPerToken,
    trainingDays,
  };
}

function formatNumber(n: number): string {
  if (n >= 1e15) return (n / 1e15).toFixed(2) + "P";
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return n.toFixed(2);
}

function formatCurrency(n: number): string {
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + n.toFixed(2);
}

export function CostCalculator() {
  const [modelParams, setModelParams] = useState(7);
  const [gpuType, setGpuType] = useState("H100 SXM");
  const [trainingHours, setTrainingHours] = useState(720);
  const [numGpus, setNumGpus] = useState(64);
  const [tokensPerParam, setTokensPerParam] = useState(20);

  const breakdown = useMemo(
    () => calculateCost(modelParams, gpuType, trainingHours, numGpus, tokensPerParam),
    [modelParams, gpuType, trainingHours, numGpus, tokensPerParam]
  );

  const gpu = gpuSpecs[gpuType];

  const presets = [
    { label: "7B (1 node)", params: 7, gpus: 8, hours: 720 },
    { label: "13B (2 nodes)", params: 13, gpus: 16, hours: 1440 },
    { label: "70B (8 nodes)", params: 70, gpus: 64, hours: 2160 },
    { label: "405B (64 nodes)", params: 405, gpus: 512, hours: 4320 },
  ];

  return (
    <div className="h-screen flex flex-col">
      <header className="shrink-0 border-b border-white/5 bg-surface-1/50 backdrop-blur-xl px-6 py-3">
        <div className="flex items-center gap-3">
          <Calculator className="w-5 h-5 text-abyss-400" />
          <div>
            <h2 className="text-sm font-semibold">Training Cost Calculator</h2>
            <p className="text-[10px] text-zinc-500">
              Estimate GPU costs for LLM training runs
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* Presets */}
          <div className="flex gap-2 mb-6">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setModelParams(p.params);
                  setNumGpus(p.gpus);
                  setTrainingHours(p.hours);
                }}
                className="btn-ghost text-xs border border-surface-4"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="col-span-1 space-y-4">
              <div className="glass-panel p-5 space-y-5">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-abyss-400" />
                  Configuration
                </h3>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5">
                    Model Size: <span className="text-white font-bold">{modelParams}B</span> parameters
                  </label>
                  <input
                    type="range"
                    min={0.1}
                    max={1000}
                    step={0.1}
                    value={modelParams}
                    onChange={(e) => setModelParams(parseFloat(e.target.value))}
                    className="w-full accent-abyss-500"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-600">
                    <span>100M</span>
                    <span>1T</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5">GPU Type</label>
                  <select
                    value={gpuType}
                    onChange={(e) => setGpuType(e.target.value)}
                    className="input-dark w-full"
                  >
                    {Object.keys(gpuSpecs).map((g) => (
                      <option key={g} value={g}>
                        {g} ({gpuSpecs[g].memory}GB, {gpuSpecs[g].tflops} TFLOPS)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5">
                    Number of GPUs: <span className="text-white font-bold">{numGpus}</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={2048}
                    step={1}
                    value={numGpus}
                    onChange={(e) => setNumGpus(parseInt(e.target.value))}
                    className="w-full accent-abyss-500"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-600">
                    <span>1</span>
                    <span>2048</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5">
                    Training Hours: <span className="text-white font-bold">{trainingHours}h</span> ({(trainingHours / 24).toFixed(1)} days)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={8760}
                    step={1}
                    value={trainingHours}
                    onChange={(e) => setTrainingHours(parseInt(e.target.value))}
                    className="w-full accent-abyss-500"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-600">
                    <span>1h</span>
                    <span>1 year</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5">
                    Tokens per Parameter: <span className="text-white font-bold">{tokensPerParam}</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    step={1}
                    value={tokensPerParam}
                    onChange={(e) => setTokensPerParam(parseInt(e.target.value))}
                    className="w-full accent-abyss-500"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-600">
                    <span>1x (undertrained)</span>
                    <span>100x (overtrained)</span>
                  </div>
                </div>
              </div>

              {/* GPU Specs */}
              <div className="glass-panel p-5">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Server className="w-4 h-4 text-accent-cyan" />
                  {gpuType} Specs
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Peak TFLOPS (BF16)</span>
                    <span className="font-mono">{gpu.tflops}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Memory</span>
                    <span className="font-mono">{gpu.memory} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Cost/hour</span>
                    <span className="font-mono text-accent-amber">${gpu.costPerHour.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="col-span-2 space-y-4">
              {/* Big number */}
              <div className="glass-panel p-8 text-center glow-border">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                  Estimated Total Cost
                </div>
                <div className="text-5xl font-bold text-gradient mb-2">
                  {formatCurrency(breakdown.totalCost)}
                </div>
                <div className="text-sm text-zinc-400">
                  {breakdown.trainingDays.toFixed(1)} days on {numGpus}x {gpuType}
                </div>
              </div>

              {/* Breakdown Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="stat-card">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <DollarSign className="w-3.5 h-3.5" />
                    GPU Compute Cost
                  </div>
                  <div className="text-2xl font-bold text-white">{formatCurrency(breakdown.gpuCost)}</div>
                  <div className="text-xs text-zinc-500">
                    {((breakdown.gpuCost / breakdown.totalCost) * 100).toFixed(0)}% of total
                  </div>
                </div>
                <div className="stat-card">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Zap className="w-3.5 h-3.5" />
                    Energy Cost
                  </div>
                  <div className="text-2xl font-bold text-accent-amber">{formatCurrency(breakdown.energyCost)}</div>
                  <div className="text-xs text-zinc-500">
                    ~300W per GPU @ $0.10/kWh
                  </div>
                </div>
                <div className="stat-card">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="w-3.5 h-3.5" />
                    GPU Hours
                  </div>
                  <div className="text-2xl font-bold text-accent-cyan">{formatNumber(numGpus * trainingHours)}</div>
                  <div className="text-xs text-zinc-500">
                    {numGpus} GPUs x {trainingHours}h
                  </div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="glass-panel p-5">
                <h3 className="text-sm font-semibold mb-4">Training Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Total Tokens</span>
                      <span className="font-mono">{formatNumber(breakdown.tokensProcessed)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Total FLOPs</span>
                      <span className="font-mono">{formatNumber(breakdown.totalFlops)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Cost per Token</span>
                      <span className="font-mono text-accent-emerald">
                        ${breakdown.costPerToken.toExponential(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Cost per 1M Tokens</span>
                      <span className="font-mono">
                        ${(breakdown.costPerToken * 1e6).toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Memory Required</span>
                      <span className="font-mono">
                        {(modelParams * 2 * 4).toFixed(0)} GB (AMP)
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Min GPUs (Memory)</span>
                      <span className="font-mono">
                        {Math.ceil((modelParams * 2 * 4) / gpu.memory)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Tokens/Second/GPU</span>
                      <span className="font-mono">
                        {formatNumber(breakdown.tokensProcessed / (trainingHours * 3600 * numGpus))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">MFU Estimate</span>
                      <span className="font-mono text-accent-amber">
                        {(
                          (breakdown.totalFlops / (gpu.tflops * 1e12 * numGpus * trainingHours * 3600)) * 100
                        ).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost comparison bar */}
              <div className="glass-panel p-5">
                <h3 className="text-sm font-semibold mb-4">Cost Context</h3>
                <div className="space-y-3">
                  {[
                    { label: "Your estimate", cost: breakdown.totalCost, color: "bg-abyss-500" },
                    { label: "GPT-3 (175B, 2020)", cost: 4_600_000, color: "bg-zinc-600" },
                    { label: "LLaMA 2 70B (2023)", cost: 2_000_000, color: "bg-zinc-600" },
                    { label: "Llama 3 405B (2024)", cost: 30_000_000, color: "bg-zinc-600" },
                    { label: "GPT-4 (est. 2023)", cost: 100_000_000, color: "bg-zinc-600" },
                  ].map((item) => {
                    const maxCost = 100_000_000;
                    const width = Math.min((item.cost / maxCost) * 100, 100);
                    return (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400 w-36 shrink-0">{item.label}</span>
                        <div className="flex-1 h-3 bg-surface-4 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.color}`}
                            style={{ width: `${Math.max(width, 0.5)}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-zinc-400 w-20 text-right">
                          {formatCurrency(item.cost)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
