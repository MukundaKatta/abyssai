"use client";

import { useAppStore } from "@/lib/store";
import {
  MessageSquare,
  GitBranch,
  Calculator,
  Trophy,
  LineChart,
  Boxes,
  Beaker,
  Download,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";

const navItems = [
  { id: "chat", label: "Chat", icon: MessageSquare, description: "Reasoning chat" },
  { id: "reasoning", label: "Reasoning Trace", icon: GitBranch, description: "Tree visualizer" },
  { id: "cost", label: "Cost Calculator", icon: Calculator, description: "Training costs" },
  { id: "benchmarks", label: "Benchmarks", icon: Trophy, description: "Model rankings" },
  { id: "training", label: "Training Efficiency", icon: LineChart, description: "Scaling curves" },
  { id: "architecture", label: "Architecture", icon: Boxes, description: "Model diagrams" },
  { id: "distillation", label: "Distillation", icon: Beaker, description: "Pipeline config" },
  { id: "downloads", label: "Downloads", icon: Download, description: "Model manager" },
  { id: "papers", label: "Papers", icon: FileText, description: "Research tracker" },
];

export function Sidebar() {
  const { activeSection, setActiveSection, sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-surface-1 border-r border-white/5 flex flex-col z-50 transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-abyss-500 to-accent-cyan flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">AbyssAI</h1>
              <p className="text-[10px] text-zinc-500">Reasoning Interface</p>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-surface-3 text-zinc-400 hover:text-white transition-colors"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-white bg-surface-3 border-l-2 border-abyss-500"
                  : "text-zinc-400 hover:text-white hover:bg-surface-3/50"
              }`}
              title={item.label}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-abyss-400" : ""}`} />
              {sidebarOpen && (
                <div className="text-left">
                  <div>{item.label}</div>
                  {!isActive && (
                    <div className="text-[10px] text-zinc-600">{item.description}</div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {sidebarOpen && (
        <div className="p-4 border-t border-white/5">
          <div className="text-[10px] text-zinc-600 text-center">
            AbyssAI v0.1.0 | Built for researchers
          </div>
        </div>
      )}
    </aside>
  );
}
