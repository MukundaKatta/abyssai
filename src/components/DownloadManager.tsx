"use client";

import { useState, useEffect } from "react";
import { useAppStore, DownloadItem } from "@/lib/store";
import { mockDownloads } from "@/lib/mock-data";
import {
  Download,
  Plus,
  CheckCircle2,
  Loader2,
  Shield,
  XCircle,
  Clock,
  HardDrive,
  Copy,
  Check,
  ExternalLink,
  Pause,
  Play,
  Trash2,
  Search,
} from "lucide-react";

function formatFileSize(bytes: number): string {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(1) + " GB";
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + " MB";
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(1) + " KB";
  return bytes + " B";
}

const statusConfig = {
  pending: { icon: Clock, color: "text-zinc-400", bg: "bg-zinc-500/10", label: "Pending" },
  downloading: { icon: Loader2, color: "text-accent-cyan", bg: "bg-accent-cyan/10", label: "Downloading" },
  verifying: { icon: Shield, color: "text-accent-amber", bg: "bg-accent-amber/10", label: "Verifying SHA256" },
  complete: { icon: CheckCircle2, color: "text-accent-emerald", bg: "bg-accent-emerald/10", label: "Complete" },
  failed: { icon: XCircle, color: "text-accent-rose", bg: "bg-accent-rose/10", label: "Failed" },
};

function DownloadCard({ item }: { item: DownloadItem }) {
  const [copiedHash, setCopiedHash] = useState(false);
  const config = statusConfig[item.status];
  const StatusIcon = config.icon;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(item.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="glass-panel-hover p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
            <StatusIcon className={`w-5 h-5 ${config.color} ${item.status === "downloading" ? "animate-spin" : ""}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">{item.modelName}</h3>
            <p className="text-[10px] text-zinc-500 font-mono">{item.fileName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${config.bg} ${config.color} border border-current/20`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {(item.status === "downloading" || item.status === "verifying") && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>{formatFileSize(item.fileSize * item.progress / 100)} / {formatFileSize(item.fileSize)}</span>
            <span className="font-mono">{item.progress}%</span>
          </div>
          <div className="h-1.5 bg-surface-4 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                item.status === "verifying"
                  ? "bg-accent-amber animate-pulse"
                  : "bg-gradient-to-r from-abyss-500 to-accent-cyan"
              }`}
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3" />
            {formatFileSize(item.fileSize)}
          </span>
          <button
            onClick={handleCopyHash}
            className="flex items-center gap-1 hover:text-zinc-300 transition-colors font-mono"
          >
            {copiedHash ? (
              <Check className="w-3 h-3 text-accent-emerald" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            sha256:{item.sha256.slice(0, 8)}...
          </button>
        </div>
        <div className="flex items-center gap-1">
          {item.status === "downloading" && (
            <button className="p-1.5 rounded-lg hover:bg-surface-4 text-zinc-400 hover:text-white transition-colors">
              <Pause className="w-3.5 h-3.5" />
            </button>
          )}
          {item.status === "pending" && (
            <button className="p-1.5 rounded-lg hover:bg-surface-4 text-zinc-400 hover:text-accent-cyan transition-colors">
              <Play className="w-3.5 h-3.5" />
            </button>
          )}
          {item.status === "complete" && (
            <a
              href={item.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-surface-4 text-zinc-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button className="p-1.5 rounded-lg hover:bg-surface-4 text-zinc-400 hover:text-accent-rose transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AddDownloadModal({ onClose }: { onClose: () => void }) {
  const [modelUrl, setModelUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [sha256, setSha256] = useState("");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-panel p-6 w-full max-w-lg mx-4 glow-border">
        <h3 className="text-lg font-semibold mb-4">Add Download</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 block mb-1.5">Model Repository URL</label>
            <input
              type="url"
              value={modelUrl}
              onChange={(e) => setModelUrl(e.target.value)}
              placeholder="https://huggingface.co/organization/model-name"
              className="input-dark w-full text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 block mb-1.5">File Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="model.safetensors"
              className="input-dark w-full text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 block mb-1.5">Expected SHA256 (for verification)</label>
            <input
              type="text"
              value={sha256}
              onChange={(e) => setSha256(e.target.value)}
              placeholder="abc123..."
              className="input-dark w-full text-sm font-mono"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="btn-ghost text-sm">Cancel</button>
            <button
              onClick={onClose}
              className="btn-primary text-sm"
              disabled={!modelUrl}
            >
              <Download className="w-3.5 h-3.5 mr-1.5 inline" />
              Start Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DownloadManager() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [items] = useState<DownloadItem[]>(mockDownloads);

  const filtered = items.filter((item) =>
    item.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: items.length,
    downloading: items.filter((i) => i.status === "downloading").length,
    complete: items.filter((i) => i.status === "complete").length,
    totalSize: items.reduce((a, b) => a + b.fileSize, 0),
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="shrink-0 border-b border-white/5 bg-surface-1/50 backdrop-blur-xl px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-abyss-400" />
            <div>
              <h2 className="text-sm font-semibold">Open-Weight Model Download Manager</h2>
              <p className="text-[10px] text-zinc-500">
                Download and verify model weights with SHA256 integrity checks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search downloads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark pl-9 text-xs w-48"
              />
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary text-xs flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add Download
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="stat-card text-center">
              <span className="text-xs text-zinc-500">Total Models</span>
              <span className="text-xl font-bold text-white">{stats.total}</span>
            </div>
            <div className="stat-card text-center">
              <span className="text-xs text-zinc-500">Downloading</span>
              <span className="text-xl font-bold text-accent-cyan">{stats.downloading}</span>
            </div>
            <div className="stat-card text-center">
              <span className="text-xs text-zinc-500">Complete</span>
              <span className="text-xl font-bold text-accent-emerald">{stats.complete}</span>
            </div>
            <div className="stat-card text-center">
              <span className="text-xs text-zinc-500">Total Size</span>
              <span className="text-xl font-bold text-accent-amber">{formatFileSize(stats.totalSize)}</span>
            </div>
          </div>

          {/* Download list */}
          <div className="space-y-3">
            {filtered.map((item) => (
              <DownloadCard key={item.id} item={item} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Download className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">No downloads found</p>
              <p className="text-xs text-zinc-600 mt-1">Add a model to start downloading</p>
            </div>
          )}
        </div>
      </div>

      {showModal && <AddDownloadModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
