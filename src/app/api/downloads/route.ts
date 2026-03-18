import { NextRequest, NextResponse } from "next/server";

// Model download manager API
// Handles download initiation, progress tracking, and SHA256 verification

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Download manager API",
    supportedSources: [
      "huggingface.co",
      "civitai.com",
      "github.com",
    ],
    supportedFormats: [
      ".safetensors",
      ".bin",
      ".gguf",
      ".ggml",
      ".pt",
    ],
    verificationMethods: ["sha256", "md5"],
  });
}

export async function POST(request: NextRequest) {
  try {
    const { repoUrl, fileName, sha256 } = await request.json();

    if (!repoUrl || !fileName) {
      return NextResponse.json(
        { error: "repoUrl and fileName are required" },
        { status: 400 }
      );
    }

    // In production:
    // 1. Validate the URL
    // 2. Check available disk space
    // 3. Start download in background worker
    // 4. Stream progress updates via SSE or WebSocket
    // 5. Verify SHA256 after download

    const downloadId = crypto.randomUUID();

    return NextResponse.json({
      id: downloadId,
      status: "pending",
      message: "Download queued",
      verification: sha256 ? {
        type: "sha256",
        expected: sha256,
        status: "pending",
      } : {
        type: "none",
        message: "No hash provided - integrity verification will be skipped",
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
