import React from "react";
import { Participants } from "./participants";
import { useSearchParams } from "next/navigation";

export const RoomSidebar = () => {
  return (
    <aside className="flex border-r-2">
      <div className="flex flex-col ">
        <div className="min-h-[63px] gap-2 flex-col border-r bg-neutral-900 h-16 flex items-center justify-end">
          <div className="min-w-10 min-h-10 text-2xl font-bold text-center flex justify-center items-center">
            tc
          </div>
          <hr className="w-8 h-1" />
        </div>

        <ServerList />
      </div>
      <div className="flex flex-col">
        <ServerInfo />
        <Participants />
      </div>
    </aside>
  );
};

const ServerList = () => {
  return (
    <div className="w-[60px] h-full bg-neutral-900 overflow-y-auto items-center flex flex-col gap-4 py-4 border-r ">
      <div className="w-10 h-10 bg-white rounded-[50%] hover:rounded-xl transition-all ease-in-out cursor-pointer"></div>
    </div>
  );
};

const ServerInfo = () => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId") || "Anonim";
  return (
    <div className="w-full bg-muted border-b min-h-[60px] h-14 flex items-center px-4">
      #{roomId}
    </div>
  );
};
