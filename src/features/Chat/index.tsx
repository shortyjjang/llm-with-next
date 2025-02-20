"use client";
import React, { useRef, useState } from "react";
import { GrFormNextLink } from "react-icons/gr";
export default function Chat() {
  const [message, setMessage] = useState("");
  const answerRef = useRef<string>("");
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
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    if (rendering) setRendering("");
    setFetchStatus("loading");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "안녕하세요!" }),
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
              answerRef.current += result;
              setRendering(answerRef.current);
            } catch (error) {
              console.log(error);
            }
          }
        }
        setMessages([
          ...messages,
          {
            question: message,
            answer: answerRef.current,
            createdAt: new Date().toISOString(),
            id: (messages.length || 0) + 1,
          },
        ]);
        setMessage("");
        setRendering("");
        answerRef.current = "";
        setFetchStatus("success");
      }
    } catch (error) {
      console.error(error);
      setFetchStatus("error");
    }
  };
  return (
    <>
      <div className="sticky top-0 bg-white">
        <h2 className="text-lg font-semibold">
          {fetchStatus === "success" || messages.length > 0
            ? messages[0]?.question
            : fetchStatus === "loading"
            ? message
            : ""}
        </h2>
        <div>{messages[0]?.createdAt.split("T")[0]}</div>
      </div>
      <div className="flex-1">
        {messages.map((msg) => (
          <div key={msg.id}>
            <div>
              {msg.question}
            </div>
            <div>{msg.answer}</div>
          </div>
        ))}
        {fetchStatus === "loading" && (
          <div>
            <div>{message}</div>
            <div>{answerRef.current}</div>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSendMessage}
        className="w-full bg-gray-100 rounded-md p-2 flex items-end gap-2"
      >
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          className="flex-1 bg-transparent resize-none"
        />
        <button
          type="submit"
          title="전송"
          className="bg-black rounded-full p-2 text-white"
        >
          <GrFormNextLink />
        </button>
      </form>
    </>
  );
}
