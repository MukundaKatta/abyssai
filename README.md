# AbyssAI

Deep learning research platform for exploring frontier AI model architectures, benchmarks, and reasoning.

<!-- Add screenshot here -->

## Features

- **Chat Interface** — Conversational AI with markdown rendering and streaming responses
- **Reasoning Visualizer** — Step-by-step visualization of model reasoning chains
- **Cost Calculator** — Estimate training and inference costs across GPU configurations
- **Benchmark Leaderboard** — Compare model performance across standard benchmarks
- **Training Dashboard** — Monitor training runs with loss curves and metrics
- **Architecture Explorer** — Interactive exploration of model architectures with D3 diagrams
- **Distillation Pipeline** — Configure and manage knowledge distillation workflows
- **Download Manager** — Download and manage model weights and checkpoints
- **Paper Tracker** — Track and organize AI research papers

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Visualization:** D3.js, Recharts
- **Animation:** Framer Motion
- **Markdown:** react-markdown with remark-gfm
- **Database:** Supabase
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for backend features)

### Installation

```bash
git clone <repo-url>
cd abyssai
npm install
```

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ChatInterface.tsx
│   ├── ReasoningVisualizer.tsx
│   ├── CostCalculator.tsx
│   ├── BenchmarkLeaderboard.tsx
│   ├── TrainingDashboard.tsx
│   ├── ArchitectureExplorer.tsx
│   ├── DistillationPipeline.tsx
│   ├── DownloadManager.tsx
│   ├── PaperTracker.tsx
│   └── Sidebar.tsx
├── lib/              # Utilities, store, and Supabase client
└── types/            # TypeScript type definitions
```

## License

MIT
