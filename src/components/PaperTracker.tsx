"use client";

import { useState, useMemo } from "react";
import { mockPapers } from "@/lib/mock-data";
import { Paper } from "@/lib/store";
import {
  FileText,
  ExternalLink,
  Search,
  Calendar,
  Tag,
  Users,
  ChevronDown,
  ChevronRight,
  Sparkles,
  BookOpen,
  Filter,
  Rss,
} from "lucide-react";

const allTags = Array.from(
  new Set(mockPapers.flatMap((p) => p.tags))
).sort();

function PaperCard({ paper }: { paper: Paper }) {
  const [expanded, setExpanded] = useState(false);

  const tagColors: Record<string, string> = {
    "scaling-laws": "badge-violet",
    transformers: "badge-cyan",
    moe: "badge-amber",
    "state-space": "badge-emerald",
    mamba: "badge-emerald",
    "long-context": "badge-cyan",
    distillation: "badge-rose",
    compression: "badge-amber",
    efficiency: "badge-emerald",
    "small-models": "badge-violet",
    reasoning: "badge-cyan",
    training: "badge-amber",
    economics: "badge-rose",
    "cost-analysis": "badge-rose",
    "adaptive-compute": "badge-violet",
  };

  return (
    <div className="glass-panel-hover p-5 animate-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {paper.publishedAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-[10px] text-zinc-600">|</span>
            <span className="text-[10px] text-zinc-500 font-mono">{paper.source}</span>
          </div>

          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-white hover:text-abyss-400 transition-colors inline-flex items-center gap-1.5 group"
          >
            {paper.title}
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <div className="flex items-center gap-1 mt-1.5 text-xs text-zinc-500">
            <Users className="w-3 h-3" />
            {paper.authors.join(", ")}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {paper.tags.map((tag) => (
              <span key={tag} className={tagColors[tag] || "badge-cyan"}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="mt-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs text-abyss-400 hover:text-abyss-300 transition-colors"
        >
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          <Sparkles className="w-3 h-3" />
          <span className="font-medium">AI-Generated Summary</span>
        </button>

        {expanded && (
          <div className="mt-2 pl-5 border-l-2 border-abyss-500/30">
            <p className="text-sm text-zinc-300 leading-relaxed">{paper.summary}</p>
          </div>
        )}
      </div>

      {/* Abstract preview */}
      {!expanded && (
        <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{paper.abstract}</p>
      )}
    </div>
  );
}

export function PaperTracker() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let papers = [...mockPapers];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      papers = papers.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.authors.some((a) => a.toLowerCase().includes(q)) ||
          p.summary.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    if (selectedTags.size > 0) {
      papers = papers.filter((p) =>
        p.tags.some((t) => selectedTags.has(t))
      );
    }

    papers.sort((a, b) => {
      if (sortBy === "date") return b.publishedAt.getTime() - a.publishedAt.getTime();
      return a.title.localeCompare(b.title);
    });

    return papers;
  }, [searchQuery, selectedTags, sortBy]);

  return (
    <div className="h-screen flex flex-col">
      <header className="shrink-0 border-b border-white/5 bg-surface-1/50 backdrop-blur-xl px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-abyss-400" />
            <div>
              <h2 className="text-sm font-semibold">Research Paper Tracker</h2>
              <p className="text-[10px] text-zinc-500">
                Latest AI papers with AI-generated summaries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search papers, authors, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark pl-9 text-xs w-64"
              />
            </div>
            <div className="flex items-center gap-1 bg-surface-2 rounded-lg p-0.5 border border-surface-4">
              <button
                onClick={() => setSortBy("date")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  sortBy === "date" ? "bg-abyss-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy("title")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  sortBy === "title" ? "bg-abyss-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                A-Z
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Tag Sidebar */}
        <div className="w-56 border-r border-white/5 bg-surface-1/30 p-4 overflow-y-auto shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Filter by Topic</span>
          </div>
          <div className="space-y-1">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                  selectedTags.has(tag)
                    ? "bg-abyss-600/30 text-abyss-400 border border-abyss-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-surface-3"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-3 h-3" />
                  {tag}
                </div>
              </button>
            ))}
          </div>

          {selectedTags.size > 0 && (
            <button
              onClick={() => setSelectedTags(new Set())}
              className="w-full mt-3 text-xs text-zinc-500 hover:text-white transition-colors py-1"
            >
              Clear filters
            </button>
          )}

          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Rss className="w-3.5 h-3.5 text-accent-amber" />
              <span className="text-xs font-medium text-zinc-400">RSS Feeds</span>
            </div>
            <div className="space-y-1 text-[10px] text-zinc-500">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
                arxiv cs.CL (connected)
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
                arxiv cs.LG (connected)
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
                arxiv cs.AI (connected)
              </div>
            </div>
          </div>
        </div>

        {/* Papers List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-zinc-400">
                {filtered.length} papers found
              </span>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Summaries generated by AI</span>
              </div>
            </div>

            <div className="space-y-4">
              {filtered.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No papers match your search</p>
                <p className="text-xs text-zinc-600 mt-1">Try different keywords or clear filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
