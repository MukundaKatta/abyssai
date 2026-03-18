"use client";

import { useState, useMemo } from "react";
import { mockBenchmarks } from "@/lib/mock-data";
import { BenchmarkEntry } from "@/lib/store";
import {
  Trophy,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
  BarChart3,
  Medal,
} from "lucide-react";

type SortKey = "rank" | "modelName" | "eloRating" | "MMLU" | "HumanEval" | "MATH" | "ARC" | "GSM8K" | "HellaSwag";

const metricKeys = ["MMLU", "HumanEval", "MATH", "ARC", "GSM8K", "HellaSwag"] as const;
const sources = ["All", "ChatbotArena", "OpenLLM", "LMSYS"] as const;

function ScoreCell({ value, max = 100 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color =
    pct >= 90 ? "text-accent-emerald" :
    pct >= 80 ? "text-accent-cyan" :
    pct >= 70 ? "text-accent-amber" : "text-accent-rose";

  return (
    <td className="px-3 py-3 text-right">
      <div className="flex items-center justify-end gap-2">
        <div className="w-12 h-1.5 bg-surface-4 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              pct >= 90 ? "bg-accent-emerald" :
              pct >= 80 ? "bg-accent-cyan" :
              pct >= 70 ? "bg-accent-amber" : "bg-accent-rose"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`font-mono text-sm ${color}`}>{value.toFixed(1)}</span>
      </div>
    </td>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return <span className="flex items-center gap-1 text-accent-amber"><Medal className="w-4 h-4" /> 1</span>;
  if (rank === 2)
    return <span className="flex items-center gap-1 text-zinc-300"><Medal className="w-4 h-4" /> 2</span>;
  if (rank === 3)
    return <span className="flex items-center gap-1 text-amber-700"><Medal className="w-4 h-4" /> 3</span>;
  return <span className="text-zinc-400">{rank}</span>;
}

const providerColors: Record<string, string> = {
  OpenAI: "badge-emerald",
  Anthropic: "badge-violet",
  Google: "badge-cyan",
  Meta: "badge-cyan",
  Mistral: "badge-amber",
  Alibaba: "badge-rose",
  DeepSeek: "badge-emerald",
  Microsoft: "badge-cyan",
  Cohere: "badge-amber",
  xAI: "badge-rose",
};

export function BenchmarkLeaderboard() {
  const [sortKey, setSortKey] = useState<SortKey>("eloRating");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [sourceFilter, setSourceFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let entries = [...mockBenchmarks];

    if (sourceFilter !== "All") {
      entries = entries.filter((e) => e.source === sourceFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      entries = entries.filter(
        (e) =>
          e.modelName.toLowerCase().includes(q) ||
          e.provider.toLowerCase().includes(q)
      );
    }

    entries.sort((a, b) => {
      let va: number, vb: number;
      if (sortKey === "rank") {
        va = a.rank || 999;
        vb = b.rank || 999;
      } else if (sortKey === "modelName") {
        return sortDir === "asc"
          ? a.modelName.localeCompare(b.modelName)
          : b.modelName.localeCompare(a.modelName);
      } else if (sortKey === "eloRating") {
        va = a.eloRating || 0;
        vb = b.eloRating || 0;
      } else {
        va = a.metrics[sortKey] || 0;
        vb = b.metrics[sortKey] || 0;
      }
      return sortDir === "asc" ? va - vb : vb - va;
    });

    return entries;
  }, [sortKey, sortDir, sourceFilter, searchQuery]);

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="px-3 py-3 text-right cursor-pointer hover:text-white transition-colors group"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-end gap-1">
        <span>{label}</span>
        {sortKey === field ? (
          sortDir === "desc" ? (
            <ArrowDown className="w-3 h-3 text-abyss-400" />
          ) : (
            <ArrowUp className="w-3 h-3 text-abyss-400" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />
        )}
      </div>
    </th>
  );

  // Aggregate stats
  const avgScores = useMemo(() => {
    const result: Record<string, number> = {};
    for (const key of metricKeys) {
      const values = filtered.map((e) => e.metrics[key]).filter(Boolean);
      result[key] = values.reduce((a, b) => a + b, 0) / values.length;
    }
    return result;
  }, [filtered]);

  return (
    <div className="h-screen flex flex-col">
      <header className="shrink-0 border-b border-white/5 bg-surface-1/50 backdrop-blur-xl px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-abyss-400" />
            <div>
              <h2 className="text-sm font-semibold">Benchmark Leaderboard</h2>
              <p className="text-[10px] text-zinc-500">
                Unified rankings from OpenLLM, Chatbot Arena, LMSYS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark pl-9 text-xs w-48"
              />
            </div>
            <div className="flex items-center gap-1 bg-surface-2 rounded-lg p-0.5 border border-surface-4">
              {sources.map((src) => (
                <button
                  key={src}
                  onClick={() => setSourceFilter(src)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    sourceFilter === src
                      ? "bg-abyss-600 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {src}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Summary Stats */}
          <div className="grid grid-cols-6 gap-3 mb-6">
            {metricKeys.map((key) => (
              <div key={key} className="stat-card text-center">
                <span className="text-xs text-zinc-500">{key} Avg</span>
                <span className="text-lg font-bold text-white">
                  {avgScores[key]?.toFixed(1) || "N/A"}
                </span>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="glass-panel overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-zinc-500 uppercase tracking-wider border-b border-white/5">
                  <SortHeader label="#" field="rank" />
                  <th className="px-3 py-3 text-left cursor-pointer" onClick={() => handleSort("modelName")}>
                    <div className="flex items-center gap-1">
                      Model
                      {sortKey === "modelName" && (
                        sortDir === "desc" ? <ArrowDown className="w-3 h-3 text-abyss-400" /> : <ArrowUp className="w-3 h-3 text-abyss-400" />
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left">Source</th>
                  <SortHeader label="ELO" field="eloRating" />
                  {metricKeys.map((key) => (
                    <SortHeader key={key} label={key} field={key} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className="border-b border-white/[0.03] hover:bg-surface-3/30 transition-colors"
                  >
                    <td className="px-3 py-3 text-center font-mono text-sm">
                      <RankBadge rank={index + 1} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{entry.modelName}</span>
                        <span className={providerColors[entry.provider] || "badge-cyan"}>
                          {entry.provider}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-zinc-500 font-mono">{entry.source}</span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-sm font-bold text-abyss-400">
                      {entry.eloRating}
                    </td>
                    {metricKeys.map((key) => (
                      <ScoreCell key={key} value={entry.metrics[key] || 0} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-zinc-600">
            <span>{filtered.length} models shown</span>
            <span>
              Data aggregated from OpenLLM Leaderboard, Chatbot Arena, and LMSYS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
