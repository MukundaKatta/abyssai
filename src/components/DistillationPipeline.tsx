"use client";

import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import {
  Beaker,
  Play,
  Square,
  RotateCcw,
  ArrowRight,
  Server,
  Database,
  Settings2,
  Terminal,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const teacherModels = [
  "llama-3.1-405b",
  "llama-3.1-70b",
  "mistral-large-2",
  "qwen-2.5-72b",
  "deepseek-v3",
  "gpt-4o (API)",
  "claude-3.5-sonnet (API)",
];

const studentModels = [
  "llama-3.1-8b",
  "llama-3.1-3b",
  "llama-3.1-1b",
  "mistral-7b",
  "phi-3-mini",
  "qwen-2.5-7b",
  "qwen-2.5-3b",
  "tinyllama-1.1b",
];

const datasets = [
  "openhermes-2.5",
  "slimorca-dedup",
  "ultrachat-200k",
  "capybara-15k",
  "orca-math-200k",
  "metamathqa-395k",
  "code-feedback-64k",
  "custom-dataset",
];

function PipelineDiagram({ config }: { config: ReturnType<typeof useAppStore>["distillationConfig"] }) {
  const statusColor = {
    idle: "border-surface-5 text-zinc-500",
    running: "border-accent-cyan glow-border text-accent-cyan",
    complete: "border-accent-emerald text-accent-emerald",
    failed: "border-accent-rose text-accent-rose",
  };

  return (
    <div className="glass-panel p-6">
      <h3 className="text-sm font-semibold mb-6">Pipeline Visualization</h3>
      <div className="flex items-center justify-center gap-4">
        {/* Teacher */}
        <div className={`rounded-xl border-2 p-4 text-center min-w-[140px] ${statusColor[config.status]}`}>
          <Server className="w-6 h-6 mx-auto mb-2" />
          <div className="text-sm font-medium">Teacher</div>
          <div className="text-[10px] font-mono text-zinc-400 mt-1">{config.teacherModel}</div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <ArrowRight className={`w-6 h-6 ${config.status === "running" ? "text-accent-cyan animate-pulse" : "text-zinc-600"}`} />
          <span className="text-[10px] text-zinc-500">Soft labels</span>
        </div>

        {/* Dataset */}
        <div className={`rounded-xl border-2 p-4 text-center min-w-[140px] ${statusColor[config.status]}`}>
          <Database className="w-6 h-6 mx-auto mb-2" />
          <div className="text-sm font-medium">Dataset</div>
          <div className="text-[10px] font-mono text-zinc-400 mt-1">{config.dataset}</div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <ArrowRight className={`w-6 h-6 ${config.status === "running" ? "text-accent-cyan animate-pulse" : "text-zinc-600"}`} />
          <span className="text-[10px] text-zinc-500">KD loss</span>
        </div>

        {/* Student */}
        <div className={`rounded-xl border-2 p-4 text-center min-w-[140px] ${statusColor[config.status]}`}>
          <Server className="w-5 h-5 mx-auto mb-2" />
          <div className="text-sm font-medium">Student</div>
          <div className="text-[10px] font-mono text-zinc-400 mt-1">{config.studentModel}</div>
        </div>
      </div>

      {/* Progress bar */}
      {config.status === "running" && (
        <div className="mt-6">
          <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>Progress</span>
            <span className="font-mono">{config.progress.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-surface-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-abyss-500 to-accent-cyan rounded-full transition-all duration-500"
              style={{ width: `${config.progress}%` }}
            />
          </div>
        </div>
      )}

      {config.status === "complete" && (
        <div className="mt-4 flex items-center justify-center gap-2 text-accent-emerald text-sm">
          <CheckCircle2 className="w-4 h-4" />
          Distillation complete
        </div>
      )}

      {config.status === "failed" && (
        <div className="mt-4 flex items-center justify-center gap-2 text-accent-rose text-sm">
          <AlertTriangle className="w-4 h-4" />
          Pipeline failed - check logs
        </div>
      )}
    </div>
  );
}

function LogViewer({ logs }: { logs: string[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs.length]);

  return (
    <div className="glass-panel p-4 flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="w-4 h-4 text-zinc-400" />
        <span className="text-sm font-medium text-zinc-300">Training Logs</span>
        <span className="text-[10px] text-zinc-600 font-mono">{logs.length} entries</span>
      </div>
      <div className="flex-1 overflow-y-auto bg-surface-0 rounded-lg p-3 font-mono text-xs leading-relaxed min-h-[200px] max-h-[400px]">
        {logs.length === 0 ? (
          <span className="text-zinc-600">No logs yet. Start the pipeline to see output.</span>
        ) : (
          logs.map((log, i) => (
            <div
              key={i}
              className={`${
                log.includes("ERROR") ? "text-accent-rose" :
                log.includes("WARN") ? "text-accent-amber" :
                log.includes("SUCCESS") ? "text-accent-emerald" :
                "text-zinc-400"
              }`}
            >
              {log}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

const sampleLogs = [
  "[00:00:01] Initializing distillation pipeline...",
  "[00:00:02] Loading teacher model: llama-3.1-70b",
  "[00:00:15] Teacher model loaded (26.8 GB, 4-bit quantized)",
  "[00:00:16] Loading student model: llama-3.1-8b",
  "[00:00:22] Student model loaded (4.7 GB, BF16)",
  "[00:00:23] Loading dataset: openhermes-2.5 (1M samples)",
  "[00:00:35] Dataset loaded and tokenized",
  "[00:00:36] Hyperparameters: lr=2e-05, epochs=3, batch=32, temp=2.0",
  "[00:00:37] Starting epoch 1/3...",
  "[00:01:00] Epoch 1 | Step 100/31250 | Loss: 2.847 | KD Loss: 1.234 | LR: 2.0e-05",
  "[00:02:00] Epoch 1 | Step 200/31250 | Loss: 2.534 | KD Loss: 1.089 | LR: 2.0e-05",
  "[00:03:00] Epoch 1 | Step 300/31250 | Loss: 2.312 | KD Loss: 0.967 | LR: 1.9e-05",
  "[00:04:00] Epoch 1 | Step 400/31250 | Loss: 2.198 | KD Loss: 0.891 | LR: 1.9e-05",
  "[00:05:00] Epoch 1 | Step 500/31250 | Loss: 2.102 | KD Loss: 0.834 | LR: 1.8e-05",
  "[00:05:01] SUCCESS Eval checkpoint: student MMLU 67.3% (teacher: 79.2%)",
];

export function DistillationPipeline() {
  const { distillationConfig, updateDistillationConfig } = useAppStore();
  const config = distillationConfig;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = () => {
    updateDistillationConfig({
      status: "running",
      progress: 0,
      logs: [sampleLogs[0]],
    });

    let logIndex = 1;
    let progress = 0;

    intervalRef.current = setInterval(() => {
      progress += 2 + Math.random() * 3;
      if (logIndex < sampleLogs.length) {
        updateDistillationConfig({
          progress: Math.min(progress, 100),
          logs: sampleLogs.slice(0, logIndex + 1),
        });
        logIndex++;
      }

      if (progress >= 100) {
        updateDistillationConfig({
          status: "complete",
          progress: 100,
          logs: [...sampleLogs, "[00:45:00] SUCCESS Distillation complete! Student model saved."],
        });
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 800);
  };

  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    updateDistillationConfig({
      status: "idle",
      logs: [...config.logs, "[WARN] Pipeline stopped by user"],
    });
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    updateDistillationConfig({
      status: "idle",
      progress: 0,
      logs: [],
    });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header className="shrink-0 border-b border-white/5 bg-surface-1/50 backdrop-blur-xl px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Beaker className="w-5 h-5 text-abyss-400" />
            <div>
              <h2 className="text-sm font-semibold">Distillation Pipeline</h2>
              <p className="text-[10px] text-zinc-500">
                Configure teacher/student models and launch knowledge distillation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {config.status === "idle" || config.status === "complete" || config.status === "failed" ? (
              <button onClick={handleStart} className="btn-primary text-xs flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5" />
                Start Pipeline
              </button>
            ) : (
              <button onClick={handleStop} className="btn-ghost text-xs flex items-center gap-1.5 text-accent-rose border border-accent-rose/30">
                <Square className="w-3.5 h-3.5" />
                Stop
              </button>
            )}
            <button onClick={handleReset} className="btn-ghost text-xs flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <PipelineDiagram config={config} />

          <div className="grid grid-cols-3 gap-6">
            {/* Configuration */}
            <div className="col-span-1 space-y-4">
              <div className="glass-panel p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Settings2 className="w-4 h-4 text-abyss-400" />
                  <h3 className="text-sm font-semibold">Configuration</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1.5">Teacher Model</label>
                    <select
                      value={config.teacherModel}
                      onChange={(e) => updateDistillationConfig({ teacherModel: e.target.value })}
                      disabled={config.status === "running"}
                      className="input-dark w-full text-sm"
                    >
                      {teacherModels.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1.5">Student Model</label>
                    <select
                      value={config.studentModel}
                      onChange={(e) => updateDistillationConfig({ studentModel: e.target.value })}
                      disabled={config.status === "running"}
                      className="input-dark w-full text-sm"
                    >
                      {studentModels.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1.5">Dataset</label>
                    <select
                      value={config.dataset}
                      onChange={(e) => updateDistillationConfig({ dataset: e.target.value })}
                      disabled={config.status === "running"}
                      className="input-dark w-full text-sm"
                    >
                      {datasets.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1.5">Epochs</label>
                      <input
                        type="number"
                        value={config.epochs}
                        onChange={(e) => updateDistillationConfig({ epochs: parseInt(e.target.value) || 1 })}
                        disabled={config.status === "running"}
                        className="input-dark w-full text-sm"
                        min={1}
                        max={100}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1.5">Batch Size</label>
                      <input
                        type="number"
                        value={config.batchSize}
                        onChange={(e) => updateDistillationConfig({ batchSize: parseInt(e.target.value) || 1 })}
                        disabled={config.status === "running"}
                        className="input-dark w-full text-sm"
                        min={1}
                        max={512}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1.5">
                      Learning Rate: <span className="text-white font-mono">{config.learningRate.toExponential(1)}</span>
                    </label>
                    <input
                      type="range"
                      min={-6}
                      max={-3}
                      step={0.1}
                      value={Math.log10(config.learningRate)}
                      onChange={(e) => updateDistillationConfig({ learningRate: Math.pow(10, parseFloat(e.target.value)) })}
                      disabled={config.status === "running"}
                      className="w-full accent-abyss-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1.5">
                      Temperature: <span className="text-white font-mono">{config.temperature.toFixed(1)}</span>
                    </label>
                    <input
                      type="range"
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={config.temperature}
                      onChange={(e) => updateDistillationConfig({ temperature: parseFloat(e.target.value) })}
                      disabled={config.status === "running"}
                      className="w-full accent-abyss-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Logs */}
            <div className="col-span-2">
              <LogViewer logs={config.logs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
