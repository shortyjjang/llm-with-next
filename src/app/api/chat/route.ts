import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message) {
    return new Response("Message is required", { status: 400 });
  }

  // 스트리밍 응답 생성
  const stream = new ReadableStream({
    async start(controller) {
      const dummyResponse = `LLM의 응답: "${message}"에 대한 스트리밍 답변입니다.`;
      for (const char of dummyResponse) {
        controller.enqueue(new TextEncoder().encode(char));
        await new Promise((resolve) => setTimeout(resolve, 50)); // 가짜 지연
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain" },
  });
}