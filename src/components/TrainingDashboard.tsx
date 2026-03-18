"use client";

import { useState } from "react";
import { scalingLawData } from "@/lib/mock-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { LineChart as LineChartIcon, TrendingDown, Zap, DollarSign } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel p-3 text-xs">
      <p className="text-zinc-400 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="font-mono">
          {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(4) : entry.value}
        </p>
      ))}
    </div>
  );
};

function ScalingLawChart() {
  const data = scalingLawData.chinchilla.map((d) => ({
    ...d,
    label: d.params >= 1 ? `${d.params}B` : `${(d.params * 1000).toFixed(0)}M`,
  }));

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">Chinchilla Scaling Laws</h3>
          <p className="text-[10px] text-zinc-500">Loss vs. model size (compute-optimal)</p>
        </div>
        <span className="badge-violet">L(N) = aN^{"{-b}"}</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="label"
            stroke="#52525b"
            tick={{ fill: "#71717a", fontSize: 11 }}
          />
          <YAxis
            stroke="#52525b"
            tick={{ fill: "#71717a", fontSize: 11 }}
            domain={[1.3, 3.6]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="loss"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#lossGradient)"
            name="Loss"
            dot={{ fill: "#6366f1", r: 4 }}
            activeDot={{ r: 6, fill: "#818cf8" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CostPerTokenChart() {
  const data = scalingLawData.costPerToken.map((d) => ({
    ...d,
    costFormatted: `$${d.cost}`,
  }));

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">Cost per Token Over Time</h3>
          <p className="text-[10px] text-zinc-500">Inference cost decline ($/token)</p>
        </div>
        <span className="badge-emerald">400x reduction</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="year"
            stroke="#52525b"
            tick={{ fill: "#71717a", fontSize: 11 }}
          />
          <YAxis
            stroke="#52525b"
            tick={{ fill: "#71717a", fontSize: 11 }}
            scale="log"
            domain={["auto", "auto"]}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cost"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#costGradient)"
            name="Cost/Token"
            dot={{ fill: "#34d399", r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function MFUChart() {
  const data = scalingLawData.flopsUtilization;

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">Model FLOPS Utilization (MFU)</h3>
          <p className="text-[10px] text-zinc-500">Hardware efficiency over generations</p>
        </div>
        <span className="badge-cyan">Trending up</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="model"
            stroke="#52525b"
            tick={{ fill: "#71717a", fontSize: 10 }}
            angle={-20}
            textAnchor="end"
            height={50}
          />
          <YAxis
            stroke="#52525b"
            tick={{ fill: "#71717a", fontSize: 11 }}
            domain={[0, 80]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="mfu"
            name="MFU %"
            fill="#22d3ee"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function FLOPsBudgetChart() {
  const data = [
    { budget: "1e18", optimalParams: 0.04, optimalTokens: 0.8 },
    { budget: "1e19", optimalParams: 0.16, optimalTokens: 3.2 },
    { budget: "1e20", optimalParams: 0.63, optimalTokens: 12.6 },
    { budget: "1e21", optimalParams: 2.5, optimalTokens: 50 },
    { budget: "1e22", optimalParams: 10, optimalTokens: 200 },
    { budget: "1e23", optimalParams: 40, optimalTokens: 800 },
    { budget: "1e24", optimalParams: 160, optimalTokens: 3200 },
    { budget: "1e25", optimalParams: 630, optimalTokens: 12600 },
  ];

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">Compute-Optimal Allocation</h3>
          <p className="text-[10px] text-zinc-500">Optimal params vs tokens for FLOP budget</p>
        </div>
        <span className="badge-amber">Chinchilla rule</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="budget"
            stroke="#52525b"
            tick={{ fill: "#71717a", fontSize: 11 }}
          />
          <YAxis
            stroke="#52525b"
            tick={{ fill: "#71717a", fontSize: 11 }}
            scale="log"
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#71717a" }}
          />
          <Line
            type="monotone"
            dataKey="optimalParams"
            stroke="#6366f1"
            strokeWidth={2}
            name="Params (B)"
            dot={{ fill: "#6366f1", r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="optimalTokens"
            stroke="#fbbf24"
            strokeWidth={2}
            name="Tokens (B)"
            dot={{ fill: "#fbbf24", r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrainingDashboard() {
  return (
    <div className="h-screen flex flex-col">
      <header className="shrink-0 border-b border-white/5 bg-surface-1/50 backdrop-blur-xl px-6 py-3">
        <div className="flex items-center gap-3">
          <LineChartIcon className="w-5 h-5 text-abyss-400" />
          <div>
            <h2 className="text-sm font-semibold">Training Efficiency Dashboard</h2>
            <p className="text-[10px] text-zinc-500">
              Cost-per-token trends, FLOPS utilization, and scaling law curves
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Cost Reduction (2020-2025)", value: "1000x", icon: TrendingDown, color: "text-accent-emerald" },
              { label: "Best MFU Achieved", value: "68.5%", icon: Zap, color: "text-accent-cyan" },
              { label: "Optimal Token Ratio", value: "20x params", icon: LineChartIcon, color: "text-accent-amber" },
              { label: "Cost per 1M tokens (2025)", value: "$0.06", icon: DollarSign, color: "text-accent-violet" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="flex items-center gap-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-zinc-500">{stat.label}</span>
                </div>
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-2 gap-6">
            <ScalingLawChart />
            <CostPerTokenChart />
            <MFUChart />
            <FLOPsBudgetChart />
          </div>
        </div>
      </div>
    </div>
  );
}
