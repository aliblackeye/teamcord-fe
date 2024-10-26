"use client";

import React from "react";
import { Participants } from "../participants";
import { ServerInfo } from "./server-info";
import { ServerList } from "./server-list";

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
