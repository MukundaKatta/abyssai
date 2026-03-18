import { NextRequest, NextResponse } from "next/server";

// Research paper RSS feed aggregator
// In production, fetches from arxiv RSS, Semantic Scholar API, etc.

const rssSources = [
  { name: "arxiv cs.CL", url: "https://rss.arxiv.org/rss/cs.CL", category: "NLP" },
  { name: "arxiv cs.LG", url: "https://rss.arxiv.org/rss/cs.LG", category: "Machine Learning" },
  { name: "arxiv cs.AI", url: "https://rss.arxiv.org/rss/cs.AI", category: "AI" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "all";
  const limit = parseInt(searchParams.get("limit") || "20");

  // In production, this would:
  // 1. Fetch RSS feeds from arxiv
  // 2. Parse XML responses
  // 3. Generate AI summaries via LLM API
  // 4. Store in Supabase
  // 5. Return paginated results

  return NextResponse.json({
    feeds: rssSources,
    lastFetched: new Date().toISOString(),
    message: "Paper tracking is configured. Connect RSS feeds and an LLM API for AI summaries.",
    config: {
      refreshInterval: "6h",
      summaryModel: "claude-3.5-sonnet",
      maxPapersPerFeed: 50,
      categories: ["cs.CL", "cs.LG", "cs.AI"],
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "Paper URL is required" }, { status: 400 });
    }

    // In production, would fetch paper metadata and generate summary
    return NextResponse.json({
      message: "Paper added to tracking queue",
      url,
      status: "pending_summary",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
