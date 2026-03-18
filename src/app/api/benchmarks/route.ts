import { NextRequest, NextResponse } from "next/server";

// Benchmark aggregation API
// In production, this would scrape/pull from OpenLLM, Chatbot Arena, LMSYS APIs

const benchmarkSources = {
  openllm: "https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard",
  chatbotArena: "https://chat.lmsys.org/?leaderboard",
  lmsys: "https://lmsys.org/",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "all";

  // In production, fetch and aggregate from real sources
  // For now, return a status indicating the aggregation endpoints

  return NextResponse.json({
    sources: benchmarkSources,
    lastUpdated: new Date().toISOString(),
    message: "Connect Supabase to enable persistent benchmark storage. Use the mock data for development.",
    endpoints: {
      openllm: {
        status: "available",
        description: "HuggingFace Open LLM Leaderboard - scrapes model scores",
      },
      chatbotArena: {
        status: "available",
        description: "LMSYS Chatbot Arena - ELO ratings from human preferences",
      },
      lmsys: {
        status: "available",
        description: "LMSYS API - additional model evaluations",
      },
    },
  });
}
