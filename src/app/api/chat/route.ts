import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message) {
    return new Response("Message is required", { status: 400 });
  }

  // 스트리밍 응답 생성
  const stream = new ReadableStream({
    async start(controller) {
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

const dummyResponse = `LLM(대규모 언어 모델, Large Language Model) 서비스는 AI 기반의 자연어 처리 모델을 활용하여 텍스트 생성, 번역, 요약, 질의응답 등의 기능을 제공하는 서비스야. 대표적인 예로 OpenAI의 ChatGPT, Google의 Gemini, Meta의 Llama 등이 있어.

LLM 서비스의 특징
	1.	자연어 이해 및 생성: 사용자의 입력을 이해하고 자연스럽게 텍스트를 생성할 수 있음.
	2.	다양한 활용 가능성: 챗봇, 문서 요약, 코드 생성, 번역, 콘텐츠 제작 등에 활용 가능.
	3.	API 제공: OpenAI, Google, Hugging Face 등에서 API를 제공해 개발자가 쉽게 서비스에 통합할 수 있음.
	4.	모델 튜닝 및 커스터마이징: 사용자의 특정 요구에 맞게 파인튜닝 가능.

대표적인 LLM 서비스
	•	OpenAI ChatGPT: 챗봇, 문서 요약, 코드 생성 지원.
	•	Google Gemini: 검색 및 정보 처리에 특화.
	•	Anthropic Claude: 안전한 AI 대화 제공.
	•	Meta Llama: 오픈소스 기반으로 활용 가능.
	•	Mistral: 효율적인 파라미터 구조로 빠른 성능 제공.

너가 LLM 서비스를 개발하려고 하는지, 기존 서비스를 활용하려고 하는지에 따라 접근 방식이 달라질 수 있어. 어떤 부분이 궁금해? 😊`