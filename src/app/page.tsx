"use client";

import ChatDialog from "@/features/Chat/ChatDialog";
import SpeechToText from "@/features/Chat/SpeechToText";
import { useRef, useState } from "react";

export default function Chat() {
  const answerRef = useRef<{
    question: string;
    answer: string;
  }>({
    question: "",
    answer: "",
  });
  const [messages, setMessages] = useState<
    {
      question: string;
      answer: string;
      createdAt: string;
      id: number;
    }[]
  >([]);
  const [fetchStatus, setFetchStatus] = useState<
    "loading" | "success" | "error"
  >("success");
  const [rendering, setRendering] = useState("");
  const handleSendMessage = async (text: string) => {
    if (!text) return;
    if (rendering) setRendering("");
    setFetchStatus("loading");
    answerRef.current.question = text;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!response.ok) {
        return;
      }
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { done: streamDone, value } = await reader.read();
          done = streamDone;
          if (value) {
            try {
              //한글자씩 표시하기 위한 딜레이 설정
              await new Promise((resolve) => setTimeout(resolve, 30));
              const result = decoder.decode(value, { stream: true });
              answerRef.current.answer += result;
              setRendering(answerRef.current.answer);
            } catch (error) {
              console.log(error);
            }
          }
        }
        setMessages([
          ...messages,
          {
            question: answerRef.current.question,
            answer: answerRef.current.answer,
            createdAt: new Date().toISOString(),
            id: (messages.length || 0) + 1,
          },
        ]);
        setRendering("");
        answerRef.current = {
          question: "",
          answer: "",
        };
        setFetchStatus("success");
      }
    } catch (error) {
      console.error(error);
      setFetchStatus("error");
    }
  };
  return (
    <>
      <div className="flex-1 p-4 xl:p-8 flex flex-col gap-4">
        {messages.map((msg) => (
          <ChatDialog
            key={msg.id}
            question={msg.question}
            answer={msg.answer}
          />
        ))}
        {fetchStatus === "loading" && (
          <ChatDialog
            question={answerRef.current.question}
            answer={answerRef.current.answer}
            showButton={false}
          />
        )}
      </div>
      <SpeechToText onChange={(text) => handleSendMessage(text)} />
    </>
  );
}
