"use client";
import Calendar from "@/stories/Calendar";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

export default function History() {
  const [date, setDate] = useState(new Date());
  const { data: chatListofMonth } = useQuery({
    queryKey: ["chatHistory", date],
    queryFn: async () => {
      return [2, 21, 28];
    }
  });
  return (
    <div className="p-4">
      <Calendar
        date={date}
        setDate={setDate}
        checkedDates={chatListofMonth || []}
      />
      <h3 className="font-semibold flex items-center gap-2 mt-6">
        <IoChatbubbleEllipsesSharp size={13} />
        {date.getFullYear()}-
        {date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1}
        -{date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} 채팅 목록
      </h3>
      <ul className="mt-1 flex flex-col gap-2 list-outside list-disc ml-5">
        <li className="text-sm">
          <h4 className="font-semibold line-clamp-1">
            채팅 제목을 최대 한줄만 노출합니다. 채팅 제목을 최대 한줄만
            노출합니다.
          </h4>
          <span className="text-gray-500 line-clamp-1">
            채팅 내용을 최대 한줄만 노출합니다. 채팅 내용을 최대 한줄만
            노출합니다.채팅 내용을 최대 한줄만 노출합니다.
          </span>
        </li>
      </ul>
    </div>
  );
}
