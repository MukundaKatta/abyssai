"use client";

import { Sidebar } from "@/components/Sidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { ReasoningVisualizer } from "@/components/ReasoningVisualizer";
import { CostCalculator } from "@/components/CostCalculator";
import { BenchmarkLeaderboard } from "@/components/BenchmarkLeaderboard";
import { TrainingDashboard } from "@/components/TrainingDashboard";
import { ArchitectureExplorer } from "@/components/ArchitectureExplorer";
import { DistillationPipeline } from "@/components/DistillationPipeline";
import { DownloadManager } from "@/components/DownloadManager";
import { PaperTracker } from "@/components/PaperTracker";
import { useAppStore } from "@/lib/store";

const sectionComponents: Record<string, React.ComponentType> = {
  chat: ChatInterface,
  reasoning: ReasoningVisualizer,
  cost: CostCalculator,
  benchmarks: BenchmarkLeaderboard,
  training: TrainingDashboard,
  architecture: ArchitectureExplorer,
  distillation: DistillationPipeline,
  downloads: DownloadManager,
  papers: PaperTracker,
};

export default function Home() {
  const activeSection = useAppStore((s) => s.activeSection);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const ActiveComponent = sectionComponents[activeSection] || ChatInterface;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main
        className={`flex-1 overflow-hidden transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <ActiveComponent />
      </main>
    </div>
  );
}
