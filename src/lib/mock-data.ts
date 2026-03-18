import { BenchmarkEntry, Paper, DownloadItem, ReasoningNode } from "./store";

// ─── Mock Reasoning Tree ────────────────────────────────────────────────────

export const sampleReasoningTree: ReasoningNode = {
  id: "root",
  label: "Initial Query Analysis",
  content: "The user is asking about the efficiency of transformer attention mechanisms. Let me break this down into key aspects.",
  confidence: 1.0,
  status: "accepted",
  children: [
    {
      id: "branch-1",
      label: "Standard Self-Attention",
      content: "Standard self-attention has O(n^2) complexity in sequence length. This is the baseline we need to compare against.",
      confidence: 0.95,
      status: "accepted",
      children: [
        {
          id: "branch-1-1",
          label: "Memory Bottleneck",
          content: "The KV cache grows linearly with sequence length, requiring O(n*d) memory per layer.",
          confidence: 0.92,
          status: "accepted",
          children: [],
        },
        {
          id: "branch-1-2",
          label: "Compute Bottleneck",
          content: "The attention matrix computation requires O(n^2*d) FLOPs, dominating for long sequences.",
          confidence: 0.88,
          status: "accepted",
          children: [],
        },
      ],
    },
    {
      id: "branch-2",
      label: "Linear Attention Variants",
      content: "Several approaches attempt to linearize attention. Let me explore the main ones.",
      confidence: 0.85,
      status: "accepted",
      children: [
        {
          id: "branch-2-1",
          label: "Performer (FAVOR+)",
          content: "Uses random feature maps to approximate softmax attention. Achieves O(n*d^2) but with quality degradation.",
          confidence: 0.78,
          status: "accepted",
          children: [],
        },
        {
          id: "branch-2-2",
          label: "Flash Attention",
          content: "Not truly linear, but uses tiling to reduce HBM access. Achieves 2-4x speedup with exact computation.",
          confidence: 0.94,
          status: "accepted",
          children: [],
        },
        {
          id: "branch-2-3",
          label: "Sparse Attention Patterns",
          content: "Approaches like BigBird, Longformer use local + global attention. Might be less relevant to the core question.",
          confidence: 0.5,
          status: "pruned",
          children: [],
        },
      ],
    },
    {
      id: "branch-3",
      label: "State Space Models",
      content: "SSMs like Mamba offer O(n) alternative but may not be what the user asked about.",
      confidence: 0.4,
      status: "rejected",
      children: [
        {
          id: "branch-3-1",
          label: "Mamba Architecture",
          content: "Uses selective scan with hardware-aware implementation. Different paradigm from attention.",
          confidence: 0.35,
          status: "rejected",
          children: [],
        },
      ],
    },
  ],
};

// ─── Mock Benchmark Data ────────────────────────────────────────────────────

export const mockBenchmarks: BenchmarkEntry[] = [
  {
    id: "1",
    modelName: "GPT-4o",
    provider: "OpenAI",
    source: "ChatbotArena",
    metrics: { MMLU: 88.7, HumanEval: 90.2, MATH: 76.6, ARC: 96.4, GSM8K: 95.3, HellaSwag: 95.6 },
    eloRating: 1287,
    rank: 1,
  },
  {
    id: "2",
    modelName: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    source: "ChatbotArena",
    metrics: { MMLU: 88.3, HumanEval: 92.0, MATH: 71.1, ARC: 95.8, GSM8K: 96.4, HellaSwag: 92.3 },
    eloRating: 1271,
    rank: 2,
  },
  {
    id: "3",
    modelName: "Gemini 1.5 Pro",
    provider: "Google",
    source: "ChatbotArena",
    metrics: { MMLU: 85.9, HumanEval: 84.1, MATH: 67.7, ARC: 93.2, GSM8K: 90.8, HellaSwag: 92.1 },
    eloRating: 1260,
    rank: 3,
  },
  {
    id: "4",
    modelName: "Llama 3.1 405B",
    provider: "Meta",
    source: "OpenLLM",
    metrics: { MMLU: 87.3, HumanEval: 89.0, MATH: 73.8, ARC: 96.1, GSM8K: 96.8, HellaSwag: 96.0 },
    eloRating: 1253,
    rank: 4,
  },
  {
    id: "5",
    modelName: "Mistral Large 2",
    provider: "Mistral",
    source: "OpenLLM",
    metrics: { MMLU: 84.0, HumanEval: 84.5, MATH: 63.0, ARC: 92.7, GSM8K: 91.2, HellaSwag: 89.5 },
    eloRating: 1245,
    rank: 5,
  },
  {
    id: "6",
    modelName: "Qwen 2.5 72B",
    provider: "Alibaba",
    source: "OpenLLM",
    metrics: { MMLU: 85.3, HumanEval: 86.4, MATH: 65.2, ARC: 94.0, GSM8K: 93.1, HellaSwag: 91.3 },
    eloRating: 1240,
    rank: 6,
  },
  {
    id: "7",
    modelName: "DeepSeek V3",
    provider: "DeepSeek",
    source: "LMSYS",
    metrics: { MMLU: 87.1, HumanEval: 88.3, MATH: 75.9, ARC: 95.5, GSM8K: 95.0, HellaSwag: 93.8 },
    eloRating: 1268,
    rank: 3,
  },
  {
    id: "8",
    modelName: "Phi-3 Medium",
    provider: "Microsoft",
    source: "OpenLLM",
    metrics: { MMLU: 78.0, HumanEval: 75.2, MATH: 52.8, ARC: 90.4, GSM8K: 86.7, HellaSwag: 86.1 },
    eloRating: 1190,
    rank: 8,
  },
  {
    id: "9",
    modelName: "Command R+",
    provider: "Cohere",
    source: "ChatbotArena",
    metrics: { MMLU: 75.7, HumanEval: 70.1, MATH: 49.3, ARC: 87.6, GSM8K: 82.3, HellaSwag: 85.0 },
    eloRating: 1170,
    rank: 9,
  },
  {
    id: "10",
    modelName: "Grok-2",
    provider: "xAI",
    source: "LMSYS",
    metrics: { MMLU: 86.2, HumanEval: 83.0, MATH: 68.4, ARC: 94.1, GSM8K: 92.5, HellaSwag: 91.0 },
    eloRating: 1255,
    rank: 5,
  },
];

// ─── Mock Papers ────────────────────────────────────────────────────────────

export const mockPapers: Paper[] = [
  {
    id: "1",
    title: "Scaling Laws for Neural Language Models Revisited: A Unified Framework",
    authors: ["A. Chen", "B. Williams", "C. Patel"],
    abstract: "We present a unified framework for understanding scaling laws across different model architectures...",
    summary: "This paper proposes a unified scaling law framework that accounts for architecture-specific factors like attention pattern sparsity and MoE routing efficiency. Key finding: scaling exponents vary by 15-20% between dense transformers and MoE models at equivalent compute budgets.",
    url: "https://arxiv.org/abs/2401.00001",
    source: "arxiv",
    publishedAt: new Date("2024-12-15"),
    tags: ["scaling-laws", "transformers", "moe"],
  },
  {
    id: "2",
    title: "Beyond Attention: Hybrid State-Space Architectures for Long-Context Reasoning",
    authors: ["D. Kim", "E. Nakamura", "F. Santos"],
    abstract: "We introduce HybridMamba, a novel architecture combining selective state-space layers with sparse attention...",
    summary: "HybridMamba achieves 95% of full-attention quality on reasoning benchmarks while maintaining linear time complexity for sequences up to 256K tokens. The key innovation is a learned routing mechanism that dynamically allocates attention to the most important token positions.",
    url: "https://arxiv.org/abs/2401.00002",
    source: "arxiv",
    publishedAt: new Date("2024-12-12"),
    tags: ["state-space", "mamba", "long-context"],
  },
  {
    id: "3",
    title: "Distillation at Scale: Training Compact Models from 100B+ Teachers",
    authors: ["G. Thompson", "H. Liu", "I. Gupta"],
    abstract: "We present the largest distillation study to date, systematically evaluating knowledge transfer from models with 100B+ parameters...",
    summary: "Key findings: (1) progressive distillation through intermediate-size models outperforms direct distillation by 8-12% on reasoning tasks, (2) feature-level distillation is critical for maintaining chain-of-thought capabilities, (3) a 7B student can recover 89% of a 405B teacher's reasoning ability with the right recipe.",
    url: "https://arxiv.org/abs/2401.00003",
    source: "arxiv",
    publishedAt: new Date("2024-12-10"),
    tags: ["distillation", "compression", "efficiency"],
  },
  {
    id: "4",
    title: "Emergent Reasoning in Small Language Models via Constitutional Training",
    authors: ["J. Anderson", "K. Zhao"],
    abstract: "We demonstrate that small language models (1-3B parameters) can exhibit emergent reasoning capabilities...",
    summary: "Through a novel constitutional training procedure that explicitly teaches reasoning patterns, 3B parameter models can match 70B models on GSM8K (87% vs 89%) and MATH (52% vs 58%). The training procedure uses a curriculum of increasingly complex reasoning chains.",
    url: "https://arxiv.org/abs/2401.00004",
    source: "arxiv",
    publishedAt: new Date("2024-12-08"),
    tags: ["small-models", "reasoning", "training"],
  },
  {
    id: "5",
    title: "The Cost of Intelligence: A Comprehensive Analysis of LLM Training Economics",
    authors: ["L. Park", "M. Fernandez", "N. Okafor"],
    abstract: "We provide the most detailed public analysis of LLM training costs, covering hardware, energy, data, and human capital...",
    summary: "Training a frontier 1T parameter model costs $150-200M in 2024, with hardware depreciation (45%), energy (25%), data curation (15%), and engineering labor (15%) as main cost drivers. The paper projects costs will decrease 40% by 2026 due to hardware improvements and algorithmic efficiency gains.",
    url: "https://arxiv.org/abs/2401.00005",
    source: "arxiv",
    publishedAt: new Date("2024-12-05"),
    tags: ["economics", "training", "cost-analysis"],
  },
  {
    id: "6",
    title: "Mixture-of-Depths: Adaptive Compute Allocation in Transformers",
    authors: ["O. Roberts", "P. Chang"],
    abstract: "We propose Mixture-of-Depths (MoD), a mechanism that allows transformers to dynamically allocate compute...",
    summary: "MoD enables transformers to skip computation for 'easy' tokens, achieving 30-50% FLOP reduction during inference with <1% quality loss. The learned routing mechanism identifies tokens that can be processed by shallow pathways vs those requiring full-depth computation.",
    url: "https://arxiv.org/abs/2401.00006",
    source: "arxiv",
    publishedAt: new Date("2024-12-02"),
    tags: ["efficiency", "adaptive-compute", "transformers"],
  },
];

// ─── Mock Downloads ─────────────────────────────────────────────────────────

export const mockDownloads: DownloadItem[] = [
  {
    id: "dl-1",
    modelName: "Llama 3.1 8B Instruct",
    repoUrl: "https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct",
    fileName: "model-00001-of-00004.safetensors",
    fileSize: 4_900_000_000,
    sha256: "a3b2c1d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef01",
    status: "complete",
    progress: 100,
  },
  {
    id: "dl-2",
    modelName: "Mistral 7B v0.3",
    repoUrl: "https://huggingface.co/mistralai/Mistral-7B-v0.3",
    fileName: "model.safetensors",
    fileSize: 14_500_000_000,
    sha256: "b4c3d2e1f0987654321fedcba0987654321fedcba0987654321fedcba098765",
    status: "downloading",
    progress: 67,
  },
  {
    id: "dl-3",
    modelName: "Qwen 2.5 14B Chat",
    repoUrl: "https://huggingface.co/Qwen/Qwen2.5-14B-Chat",
    fileName: "model-00001-of-00003.safetensors",
    fileSize: 9_200_000_000,
    sha256: "c5d4e3f2a1b098765432fedcba1234567890abcdef1234567890abcdef123456",
    status: "verifying",
    progress: 100,
  },
  {
    id: "dl-4",
    modelName: "Phi-3 Medium 128K",
    repoUrl: "https://huggingface.co/microsoft/Phi-3-medium-128k-instruct",
    fileName: "model.safetensors",
    fileSize: 28_000_000_000,
    sha256: "d6e5f4a3b2c109876543fedcba2345678901abcdef2345678901abcdef234567",
    status: "pending",
    progress: 0,
  },
];

// ─── Cost Calculator Data ────────────────────────────────────────────────────

export const gpuSpecs: Record<string, { tflops: number; memory: number; costPerHour: number }> = {
  "H100 SXM": { tflops: 989, memory: 80, costPerHour: 3.50 },
  "H100 PCIe": { tflops: 756, memory: 80, costPerHour: 2.80 },
  "A100 80GB": { tflops: 312, memory: 80, costPerHour: 1.80 },
  "A100 40GB": { tflops: 312, memory: 40, costPerHour: 1.20 },
  "L40S": { tflops: 366, memory: 48, costPerHour: 1.40 },
  "A10G": { tflops: 125, memory: 24, costPerHour: 0.75 },
  "RTX 4090": { tflops: 330, memory: 24, costPerHour: 0.45 },
  "MI300X": { tflops: 1307, memory: 192, costPerHour: 3.20 },
};

// ─── Scaling Law Data ────────────────────────────────────────────────────────

export const scalingLawData = {
  chinchilla: [
    { params: 0.07, tokens: 1.4, loss: 3.45 },
    { params: 0.15, tokens: 3.0, loss: 3.10 },
    { params: 0.4, tokens: 8.0, loss: 2.80 },
    { params: 1.0, tokens: 20, loss: 2.55 },
    { params: 3.0, tokens: 60, loss: 2.30 },
    { params: 7.0, tokens: 140, loss: 2.10 },
    { params: 13.0, tokens: 260, loss: 1.95 },
    { params: 30.0, tokens: 600, loss: 1.80 },
    { params: 70.0, tokens: 1400, loss: 1.68 },
    { params: 175.0, tokens: 3500, loss: 1.55 },
    { params: 400.0, tokens: 8000, loss: 1.42 },
  ],
  costPerToken: [
    { year: 2020, cost: 0.06 },
    { year: 2021, cost: 0.03 },
    { year: 2022, cost: 0.012 },
    { year: 2023, cost: 0.002 },
    { year: 2024, cost: 0.00015 },
    { year: 2025, cost: 0.00006 },
  ],
  flopsUtilization: [
    { model: "GPT-3", mfu: 21.3, year: 2020 },
    { model: "PaLM", mfu: 46.2, year: 2022 },
    { model: "Chinchilla", mfu: 43.7, year: 2022 },
    { model: "LLaMA", mfu: 55.0, year: 2023 },
    { model: "Mistral 7B", mfu: 58.3, year: 2023 },
    { model: "Llama 3", mfu: 62.1, year: 2024 },
    { model: "DeepSeek V3", mfu: 68.5, year: 2024 },
  ],
};

// ─── Architecture Data ──────────────────────────────────────────────────────

export interface ArchitectureBlock {
  id: string;
  name: string;
  type: "input" | "attention" | "ffn" | "norm" | "output" | "routing" | "ssm" | "embed" | "head";
  description: string;
  params?: string;
  color: string;
}

export interface Architecture {
  name: string;
  description: string;
  blocks: ArchitectureBlock[];
  connections: [string, string][];
}

export const architectures: Record<string, Architecture> = {
  transformer: {
    name: "Transformer (Decoder-Only)",
    description: "Standard autoregressive transformer architecture used in GPT, LLaMA, Mistral, etc.",
    blocks: [
      { id: "embed", name: "Token Embedding", type: "embed", description: "Maps token IDs to dense vectors. Includes positional encoding (RoPE/ALiBi).", params: "V x d", color: "#6366f1" },
      { id: "norm1", name: "RMSNorm", type: "norm", description: "Root Mean Square Layer Normalization. Pre-norm architecture for stable training.", params: "d", color: "#22d3ee" },
      { id: "attn", name: "Multi-Head Self-Attention", type: "attention", description: "Grouped-Query Attention (GQA) with KV-cache. Causal mask prevents attending to future tokens.", params: "4 x d^2 / n_kv_ratio", color: "#f59e0b" },
      { id: "norm2", name: "RMSNorm", type: "norm", description: "Second normalization before FFN layer.", params: "d", color: "#22d3ee" },
      { id: "ffn", name: "SwiGLU FFN", type: "ffn", description: "Feed-forward with SwiGLU activation. Typically 8/3 x d intermediate size.", params: "3 x d x d_ff", color: "#34d399" },
      { id: "head", name: "LM Head", type: "head", description: "Linear projection to vocabulary logits. Often tied with embedding weights.", params: "d x V", color: "#fb7185" },
    ],
    connections: [["embed", "norm1"], ["norm1", "attn"], ["attn", "norm2"], ["norm2", "ffn"], ["ffn", "norm1"], ["ffn", "head"]],
  },
  mamba: {
    name: "Mamba (SSM)",
    description: "Selective State Space Model with hardware-aware implementation. Linear time complexity.",
    blocks: [
      { id: "embed", name: "Token Embedding", type: "embed", description: "Standard embedding layer mapping tokens to vectors.", params: "V x d", color: "#6366f1" },
      { id: "norm1", name: "RMSNorm", type: "norm", description: "Pre-normalization before SSM block.", params: "d", color: "#22d3ee" },
      { id: "proj_in", name: "Input Projection", type: "ffn", description: "Expands dimension by 2x. Splits into two paths: SSM path and gate path.", params: "d x 2d", color: "#34d399" },
      { id: "ssm", name: "Selective SSM", type: "ssm", description: "Selective scan with input-dependent A, B, C matrices. Processes sequence in O(n) time using parallel scan.", params: "d x n_state", color: "#f59e0b" },
      { id: "gate", name: "SiLU Gate", type: "ffn", description: "Gating mechanism with SiLU activation. Controls information flow from SSM.", params: "2d", color: "#a78bfa" },
      { id: "proj_out", name: "Output Projection", type: "ffn", description: "Projects back to model dimension.", params: "2d x d", color: "#34d399" },
      { id: "head", name: "LM Head", type: "head", description: "Final projection to vocabulary size.", params: "d x V", color: "#fb7185" },
    ],
    connections: [["embed", "norm1"], ["norm1", "proj_in"], ["proj_in", "ssm"], ["proj_in", "gate"], ["ssm", "gate"], ["gate", "proj_out"], ["proj_out", "norm1"], ["proj_out", "head"]],
  },
  moe: {
    name: "Mixture of Experts (MoE)",
    description: "Sparse MoE transformer (Mixtral-style). Routes tokens to top-K experts per layer.",
    blocks: [
      { id: "embed", name: "Token Embedding", type: "embed", description: "Standard embedding with RoPE positional encoding.", params: "V x d", color: "#6366f1" },
      { id: "norm1", name: "RMSNorm", type: "norm", description: "Pre-norm before attention.", params: "d", color: "#22d3ee" },
      { id: "attn", name: "Grouped-Query Attention", type: "attention", description: "Standard GQA attention layer, shared across all tokens.", params: "4 x d^2 / n_kv_ratio", color: "#f59e0b" },
      { id: "norm2", name: "RMSNorm", type: "norm", description: "Pre-norm before MoE layer.", params: "d", color: "#22d3ee" },
      { id: "router", name: "Router / Gate", type: "routing", description: "Learned routing network. Produces top-K expert assignments per token with load balancing loss.", params: "d x n_experts", color: "#fb7185" },
      { id: "expert1", name: "Expert FFN 1", type: "ffn", description: "Independent SwiGLU FFN. Only processes assigned tokens.", params: "3 x d x d_ff", color: "#34d399" },
      { id: "expert2", name: "Expert FFN 2", type: "ffn", description: "Independent SwiGLU FFN. Only processes assigned tokens.", params: "3 x d x d_ff", color: "#34d399" },
      { id: "expert_n", name: "Expert FFN N", type: "ffn", description: "N total experts (e.g., 8). Only top-K (e.g., 2) active per token.", params: "3 x d x d_ff", color: "#34d399" },
      { id: "head", name: "LM Head", type: "head", description: "Final vocabulary projection.", params: "d x V", color: "#fb7185" },
    ],
    connections: [["embed", "norm1"], ["norm1", "attn"], ["attn", "norm2"], ["norm2", "router"], ["router", "expert1"], ["router", "expert2"], ["router", "expert_n"], ["expert1", "norm1"], ["expert2", "norm1"], ["expert_n", "norm1"], ["expert_n", "head"]],
  },
};

// ─── Chat simulation ────────────────────────────────────────────────────────

export const sampleThinking = `Let me analyze this question step by step.

**Step 1: Understanding the question**
The user wants to know about the efficiency of transformer attention mechanisms and how they scale with sequence length.

**Step 2: Analyzing standard attention complexity**
- Standard self-attention computes Q*K^T which is O(n^2*d) where n is sequence length
- This creates the well-known quadratic bottleneck
- For a 128K context window, this means ~16 billion attention score computations per layer

**Step 3: Evaluating Flash Attention**
- Flash Attention doesn't change the asymptotic complexity but dramatically reduces HBM reads/writes
- Uses tiling to keep working data in SRAM (on-chip memory)
- Achieves 2-4x wall-clock speedup for standard attention

**Step 4: Considering alternatives**
- Linear attention variants (Performer, etc.) achieve O(n*d^2) but with quality tradeoffs
- Ring attention enables distributing long sequences across devices
- Mixture-of-Depths can skip attention for "easy" tokens

**Step 5: Synthesizing the answer**
I should provide a comprehensive overview focusing on practical efficiency gains rather than just theoretical complexity.`;
