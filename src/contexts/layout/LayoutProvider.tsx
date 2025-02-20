import React from "react";
import History from "@/features/History";
import { FaPlus } from "react-icons/fa";
export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="lg:grid lg:grid-cols-[240px_1fr] min-h-screen">
      <History />
      <div className="col-start-2 row-start-1 row-span-2 border-l border-gray-200 flex flex-col justify-between">
        {children}
      </div>
      <div className="flex items-end p-4">
        <button className="bg-blue-500 text-white rounded-full p-2 flex items-center gap-2 px-4 py-2 w-full">
          <FaPlus /> 새 채팅
        </button>
      </div>
    </div>
  );
}
