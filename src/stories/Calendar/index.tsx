"use client";

import React, { useState } from "react";
import { GrPrevious, GrNext } from "react-icons/gr";
import { twMerge } from "tailwind-merge";

export default function Calendar({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const [selectDate, setSelectDate] = useState<Date>(new Date(date));
  const [selectMonth, setSelectMonth] = useState<Date>(new Date(date));

  const onChangeMonth = (num: number) => {
    setSelectMonth(
      new Date(selectMonth.getFullYear(), selectMonth.getMonth() + num, 1)
    );
  };

  const getLastDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const calculateDayInfo = (
    index: number,
    firstDay: number,
    lastDay: number,
    prevLastDay: number
  ) => {
    let monthOffset = 0;
    let day = index - firstDay + 1;

    if (index < firstDay) {
      // 이전 달의 날짜
      monthOffset = -1;
      day = prevLastDay + day;
    } else if (index >= firstDay + lastDay) {
      // 다음 달의 날짜
      monthOffset = 1;
      day = day - lastDay;
    }

    const changeDate = new Date(
      selectMonth.getFullYear(),
      selectMonth.getMonth() + monthOffset,
      day
    );

    const color = monthOffset !== 0 ? "text-gray-400" : "black";

    return { color, changeDate };
  };

  return (
    <>
      <div className="flex items-center justify-between font-semibold">
        <button title="이전 달" onClick={() => onChangeMonth(-1)}>
          <GrPrevious />
        </button>
        {selectMonth.toLocaleDateString().substring(0, 7)}
        <button title="다음 달" onClick={() => onChangeMonth(1)}>
          <GrNext />
        </button>
      </div>
      <div
        className="grid grid-cols-7 gap text-sm"
        style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
      >
        {days.map((day, index) => (
          <div
            key={index}
            className="text-gray-400 text-xs pb-1 pt-4 text-center font-semibold"
          >
            {day}
          </div>
        ))}
        {Array.from({ length: 42 }).map((_, index) => {
          const firstDay = new Date(
            selectMonth.getFullYear(),
            selectMonth.getMonth(),
            1
          ).getDay();
          const lastDay = getLastDayOfMonth(selectMonth);
          const prevLastDay = getLastDayOfMonth(
            new Date(selectMonth.getFullYear(), selectMonth.getMonth() - 1, 1)
          );

          const { color, changeDate } = calculateDayInfo(
            index,
            firstDay,
            lastDay,
            prevLastDay
          );

          return (
            <div
              key={index}
              className={twMerge(
                "aspect-square flex items-center flex-col pt-1 justify-center rounded-full",
                selectDate.toLocaleDateString() ===
                  changeDate.toLocaleDateString()
                  ? "bg-blue-500 text-white font-medium"
                  : color,
                changeDate > new Date() ? "cursor-default" : "cursor-pointer"
              )}
              onClick={() => {
                // 현재 오늘 날짜 이후는 클릭 금지
                if (changeDate > new Date()) return;
                setDate(changeDate);
                setSelectDate(changeDate);
                setSelectMonth(changeDate);
              }}
            >
              {changeDate.getDate()}
              <span
                className={twMerge(
                  "w-1 h-1 rounded-full bg-blue-500",
                  selectDate.toLocaleDateString() ===
                    changeDate.toLocaleDateString() && "bg-white"
                )}
              ></span>
            </div>
          );
        })}
      </div>
    </>
  );
}

const days = ["일", "월", "화", "수", "목", "금", "토"];
