"use client";

import React, { useState } from "react";
import History from "@/features/History";
import { LuFilePenLine } from "react-icons/lu";
import { GoSidebarExpand } from "react-icons/go";
import { twMerge } from "tailwind-merge";
export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[240px_1fr] min-h-screen">
      <div className="sticky top-0 z-10 left-0 flex justify-between items-center p-4 border-b border-gray-200 lg:fixed bg-white lg:w-[240px]">
        <button type="button" aria-label="사이드바 확장" className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <GoSidebarExpand size={20} />
        </button>
        <button
          type="button"
          aria-label="새 채팅"
          className="flex items-center gap-2"
        >
          <LuFilePenLine size={20} />
          <span className="hidden lg:block">새 채팅</span>
        </button>
      </div>
      <div
        className={twMerge(
          "fixed top-[47px] left-0 w-full h-[calc(100vh-47px)] transition-transform duration-300 ease-in-out will-change-transform lg:will-change-auto overflow-y-auto bg-white z-10 lg:relative lg:w-auto lg:h-auto",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <History />
      </div>
      <div className="flex-1 border-l border-gray-200 flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
