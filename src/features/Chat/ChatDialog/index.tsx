import useListen from "@/hooks/useListen";
import React from "react";
import { RxSpeakerModerate, RxSpeakerOff } from "react-icons/rx";
export default function ChatDialog({
  question,
  answer,
  showButton = true,
}: {
  question: string;
  answer: string;
  showButton?: boolean;
}) {
  const { handleSpeaker, isSpeaking, setText } = useListen();
  return (
    <div>
      <div className="flex justify-end">
        <div className="bg-gray-50 rounded-md p-2">{question}</div>
      </div>
      <div className="whitespace-pre-wrap">{answer}</div>
      {showButton && (
        <button
          onClick={async () => {
            setText(answer);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            handleSpeaker();
          }}
        >
          {isSpeaking ? <RxSpeakerOff /> : <RxSpeakerModerate />}
        </button>
      )}
    </div>
  );
}
