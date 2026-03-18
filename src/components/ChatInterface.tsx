"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore, Message, ReasoningNode } from "@/lib/store";
import { sampleReasoningTree, sampleThinking } from "@/lib/mock-data";
import {
  Send,
  ChevronDown,
  ChevronRight,
  Brain,
  User,
  Sparkles,
  Plus,
  Clock,
  Copy,
  Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ThinkingBlock({ thinking }: { thinking: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="my-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs text-abyss-400 hover:text-abyss-300 transition-colors"
      >
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <Brain className="w-3 h-3" />
        <span className="font-mono">Chain of Thought</span>
        <span className="text-zinc-600">({thinking.split("\n").length} steps)</span>
      </button>
      {expanded && (
        <div className="thinking-block mt-2 animate-fade-in">
          <div className="text-sm text-zinc-300 space-y-2 font-mono leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{thinking}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 animate-in ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-abyss-500 to-accent-cyan flex items-center justify-center shrink-0 mt-1">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-[75%] ${isUser ? "order-first" : ""}`}>
        <div
          className={`rounded-xl px-4 py-3 ${
            isUser
              ? "bg-abyss-600/30 border border-abyss-500/20 text-white"
              : "bg-surface-2 border border-white/5 text-zinc-200"
          }`}
        >
          {!isUser && message.thinking && (
            <ThinkingBlock thinking={message.thinking} />
          )}
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 bg-abyss-400 animate-pulse ml-1" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 px-1">
          <span className="text-[10px] text-zinc-600">
            {message.timestamp.toLocaleTimeString()}
          </span>
          {!isUser && (
            <button
              onClick={handleCopy}
              className="text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-accent-emerald" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-surface-4 flex items-center justify-center shrink-0 mt-1">
          <User className="w-4 h-4 text-zinc-400" />
        </div>
      )}
    </div>
  );
}

const sampleResponses = [
  {
    thinking: sampleThinking,
    content: `## Transformer Attention Efficiency

The efficiency of transformer attention mechanisms is a critical concern as we scale to longer contexts. Here's the landscape:

### Standard Self-Attention: O(n^2)
The baseline attention mechanism computes a full attention matrix, requiring **O(n^2 * d)** FLOPs and **O(n^2)** memory per layer. For a 128K context window, this means ~16.7 billion attention scores per layer.

### Flash Attention: Same Complexity, Better Constants
Flash Attention doesn't change asymptotic complexity but uses **IO-aware tiling** to minimize HBM reads/writes:
- Keeps working data in SRAM (on-chip memory)
- Achieves **2-4x wall-clock speedup** with exact computation
- Flash Attention 2 further optimizes by reducing non-matmul FLOPs

### Linear Attention: O(n) but with Tradeoffs
| Method | Complexity | Quality Impact |
|--------|-----------|----------------|
| Performer (FAVOR+) | O(n * d^2) | -2-5% on perplexity |
| Linear Transformer | O(n * d^2) | Significant on long-range |
| cosFormer | O(n * d^2) | Better than Performer |

### Practical Recommendations
1. **Flash Attention 2** for most use cases (exact + fast)
2. **Ring Attention** for distributing long contexts across devices
3. **Mixture-of-Depths** for skipping "easy" tokens (30-50% FLOP reduction)
4. **State Space Models** (Mamba) for truly linear inference on very long sequences`,
    reasoningTree: sampleReasoningTree,
  },
];

export function ChatInterface() {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    conversations,
    activeConversationId,
    addConversation,
    addMessage,
    updateMessage,
    setActiveConversation,
  } = useAppStore();

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [activeConversation?.messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    let convId = activeConversationId;
    if (!convId) {
      convId = addConversation(input.slice(0, 50));
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    addMessage(convId, userMessage);
    setInput("");
    setIsGenerating(true);

    // Simulate AI response with thinking
    const assistantId = crypto.randomUUID();
    const response = sampleResponses[0];

    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      thinking: response.thinking,
      reasoningTree: response.reasoningTree,
      timestamp: new Date(),
      isStreaming: true,
    };

    addMessage(convId, assistantMessage);

    // Simulate streaming
    const fullContent = response.content;
    let currentContent = "";
    const chunkSize = 3;

    for (let i = 0; i < fullContent.length; i += chunkSize) {
      currentContent = fullContent.slice(0, i + chunkSize);
      updateMessage(convId, assistantId, { content: currentContent });
      await new Promise((r) => setTimeout(r, 10));
    }

    updateMessage(convId, assistantId, {
      content: fullContent,
      isStreaming: false,
    });
    setIsGenerating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="shrink-0 border-b border-white/5 bg-surface-1/50 backdrop-blur-xl px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-abyss-400" />
            <div>
              <h2 className="text-sm font-semibold">
                {activeConversation?.title || "New Conversation"}
              </h2>
              <p className="text-[10px] text-zinc-500">
                Chain-of-thought reasoning enabled
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addConversation("New Conversation")}
              className="btn-ghost text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              New Chat
            </button>
          </div>
        </div>
      </header>

      {/* Conversation List (sidebar-ish) */}
      {conversations.length > 0 && !activeConversation && (
        <div className="p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-3">Recent Conversations</h3>
          <div className="space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className="w-full text-left glass-panel-hover p-3 flex items-center gap-3"
              >
                <MessageSquareIcon className="w-4 h-4 text-zinc-500" />
                <div>
                  <div className="text-sm">{conv.title}</div>
                  <div className="text-xs text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {conv.createdAt.toLocaleDateString()}
                    <span className="mx-1">|</span>
                    {conv.messages.length} messages
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {!activeConversation || activeConversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-abyss-500/20 to-accent-cyan/20 flex items-center justify-center mb-4 glow-border">
              <Sparkles className="w-8 h-8 text-abyss-400" />
            </div>
            <h2 className="text-xl font-semibold text-gradient mb-2">AbyssAI</h2>
            <p className="text-sm text-zinc-500 max-w-md mb-8">
              Reasoning-focused AI interface with chain-of-thought visualization.
              Ask anything and watch the model think.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-lg">
              {[
                "Explain the efficiency of transformer attention mechanisms",
                "Compare Mamba vs Transformer architectures",
                "What are the scaling laws for LLM training?",
                "How does knowledge distillation work?",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="glass-panel-hover p-3 text-left text-xs text-zinc-400 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          activeConversation.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-white/5 p-4 bg-surface-1/30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... (Shift+Enter for new line)"
            rows={1}
            className="w-full input-dark pr-12 resize-none min-h-[44px] max-h-[200px]"
            style={{ height: "auto" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 200) + "px";
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="absolute right-2 bottom-2 p-2 rounded-lg bg-abyss-600 hover:bg-abyss-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-zinc-600">
            Reasoning traces are simulated for demo purposes
          </span>
        </div>
      </div>
    </div>
  );
}

function MessageSquareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
