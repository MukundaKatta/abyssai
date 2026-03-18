import { NextRequest, NextResponse } from "next/server";

// Distillation pipeline API
// Manages teacher/student model configuration and training orchestration

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Distillation pipeline API",
    supportedTeachers: [
      { model: "llama-3.1-405b", params: "405B", quantized: true },
      { model: "llama-3.1-70b", params: "70B", quantized: true },
      { model: "mistral-large-2", params: "123B", quantized: true },
      { model: "qwen-2.5-72b", params: "72B", quantized: true },
    ],
    supportedStudents: [
      { model: "llama-3.1-8b", params: "8B" },
      { model: "llama-3.1-3b", params: "3B" },
      { model: "mistral-7b", params: "7B" },
      { model: "phi-3-mini", params: "3.8B" },
    ],
    supportedDatasets: [
      { name: "openhermes-2.5", samples: "1M", description: "General instruction data" },
      { name: "slimorca-dedup", samples: "518K", description: "Deduplicated ORCA data" },
      { name: "ultrachat-200k", samples: "200K", description: "Multi-turn conversations" },
      { name: "metamathqa-395k", samples: "395K", description: "Mathematical reasoning" },
    ],
    hyperparameters: {
      learningRate: { min: 1e-6, max: 1e-3, default: 2e-5 },
      temperature: { min: 0.5, max: 10, default: 2.0 },
      epochs: { min: 1, max: 100, default: 3 },
      batchSize: { min: 1, max: 512, default: 32 },
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const config = await request.json();

    const { teacherModel, studentModel, dataset, epochs, learningRate, temperature, batchSize } = config;

    if (!teacherModel || !studentModel || !dataset) {
      return NextResponse.json(
        { error: "teacherModel, studentModel, and dataset are required" },
        { status: 400 }
      );
    }

    const runId = crypto.randomUUID();

    // In production:
    // 1. Validate model availability
    // 2. Check GPU resources
    // 3. Queue training job
    // 4. Return job ID for status polling

    return NextResponse.json({
      id: runId,
      status: "queued",
      config: {
        teacherModel,
        studentModel,
        dataset,
        epochs: epochs || 3,
        learningRate: learningRate || 2e-5,
        temperature: temperature || 2.0,
        batchSize: batchSize || 32,
      },
      estimatedDuration: "4-8 hours",
      message: "Distillation run queued. Monitor progress via the pipeline UI.",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
