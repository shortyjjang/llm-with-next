/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { FaMicrophone, FaArrowRight } from "react-icons/fa";
import useSpeech from "@/hooks/useSpeech";
import { twMerge } from "tailwind-merge";

// SpeechToText 컴포넌트는 음성 인식 기능을 제공하는 페이지입니다.
export default function SpeechToText({
  onChange,
}: {
  onChange?: (text: string) => void;
}) {
  const [value, setValue] = useState(""); // 입력된 텍스트를 저장
  const [voice, setVoice] = useState(""); // 인식된 음성을 저장

  const { isListening, transcript, startListening, stopListening, error } =
    useSpeech({
      lang: "ko-KR",
      continuous: true,
      interimResults: true,
    });

  const handleStopRecording = () => {
    setValue(value + voice); // 인식된 음성을 입력된 텍스트에 추가
    stopListening(); // 인식 중지
    setVoice(""); // 음성 초기화
  };

  useEffect(() => {
    setVoice(transcript.current); // 인식된 텍스트를 음성 상태에 저장
  }, [transcript.current]);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onChange?.(value);
      setValue("");
    }} className="sticky bottom-0 bg-white p-4">
      <div className="relative w-full flex items-center bg-gray-50 rounded-md p-2 max-w-4xl mx-auto">
        <button
          type="button"
          className={twMerge("shadow-sm rounded-full p-2", isListening ? "bg-blue-500 text-white": "bg-white text-gray-500")}
          title={isListening ? "녹음 중지" : "녹음 시작"}
          onClick={() => {
            if (error) return alert(error); //음성지원에 에러가 있을때 작동안함
            if (isListening)
              handleStopRecording(); // 듣고 있을 때 버튼을 누르면 녹음 중지
            else startListening(); // 듣고 있지 않을 때 버튼을 누르면 녹음 시작
          }}
        >
          <FaMicrophone />
        </button>
        <textarea
          value={isListening ? value + voice : value} // 듣고 있을 때는 음성을 포함한 텍스트 표시
          onChange={(e) => setValue(e.target.value)} // 입력된 텍스트 업데이트
          onKeyDown={() => {
            if (isListening) handleStopRecording(); // 듣고 있을 때 키를 누르면 녹음 중지
          }}
          className="flex-1 resize-none bg-transparent"
        />
        <button
          type="submit"
          disabled={!value || isListening}
          className="bg-blue-500 text-white p-2 rounded-full"
        >
          <FaArrowRight />
        </button>
      </div>
    </form>
  );
}
