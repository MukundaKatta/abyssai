import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ReasoningNode {
  id: string;
  label: string;
  content: string;
  confidence: number;
  children: ReasoningNode[];
  status: "exploring" | "accepted" | "rejected" | "pruned";
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  reasoningTree?: ReasoningNode;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface BenchmarkEntry {
  id: string;
  modelName: string;
  provider: string;
  source: "OpenLLM" | "ChatbotArena" | "LMSYS" | "Custom";
  metrics: Record<string, number>;
  eloRating?: number;
  rank?: number;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: Date;
  tags: string[];
}

export interface DownloadItem {
  id: string;
  modelName: string;
  repoUrl: string;
  fileName: string;
  fileSize: number;
  sha256: string;
  status: "pending" | "downloading" | "verifying" | "complete" | "failed";
  progress: number;
}

export interface DistillationConfig {
  teacherModel: string;
  studentModel: string;
  dataset: string;
  epochs: number;
  learningRate: number;
  temperature: number;
  batchSize: number;
  status: "idle" | "running" | "complete" | "failed";
  progress: number;
  logs: string[];
}

// ─── App Store ───────────────────────────────────────────────────────────────

interface AppState {
  // Navigation
  activeSection: string;
  setActiveSection: (section: string) => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Chat
  conversations: Conversation[];
  activeConversationId: string | null;
  addConversation: (title: string) => string;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;

  // Benchmarks
  benchmarks: BenchmarkEntry[];
  setBenchmarks: (entries: BenchmarkEntry[]) => void;

  // Papers
  papers: Paper[];
  setPapers: (papers: Paper[]) => void;

  // Downloads
  downloads: DownloadItem[];
  addDownload: (item: DownloadItem) => void;
  updateDownload: (id: string, updates: Partial<DownloadItem>) => void;

  // Distillation
  distillationConfig: DistillationConfig;
  updateDistillationConfig: (updates: Partial<DistillationConfig>) => void;
}

const defaultDistillation: DistillationConfig = {
  teacherModel: "llama-3.1-70b",
  studentModel: "llama-3.1-8b",
  dataset: "openhermes-2.5",
  epochs: 3,
  learningRate: 2e-5,
  temperature: 2.0,
  batchSize: 32,
  status: "idle",
  progress: 0,
  logs: [],
};

export const useAppStore = create<AppState>((set, get) => ({
  activeSection: "chat",
  setActiveSection: (section) => set({ activeSection: section }),

  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  conversations: [],
  activeConversationId: null,

  addConversation: (title) => {
    const id = crypto.randomUUID();
    set((s) => ({
      conversations: [
        { id, title, messages: [], createdAt: new Date() },
        ...s.conversations,
      ],
      activeConversationId: id,
    }));
    return id;
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addMessage: (conversationId, message) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, message] }
          : c
      ),
    })),

  updateMessage: (conversationId, messageId, updates) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, ...updates } : m
              ),
            }
          : c
      ),
    })),

  benchmarks: [],
  setBenchmarks: (entries) => set({ benchmarks: entries }),

  papers: [],
  setPapers: (papers) => set({ papers }),

  downloads: [],
  addDownload: (item) => set((s) => ({ downloads: [...s.downloads, item] })),
  updateDownload: (id, updates) =>
    set((s) => ({
      downloads: s.downloads.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),

  distillationConfig: defaultDistillation,
  updateDistillationConfig: (updates) =>
    set((s) => ({
      distillationConfig: { ...s.distillationConfig, ...updates },
    })),
}));
