"use client";

import { Suspense } from "react";
import { Room } from "./_partials/room";
import { ChannelProvider } from "./_partials/channel-provider";
import { ChatRoomContextProvider } from "@/lib/context/chat-room-context";

export default function JoinPage() {
  return (
    <Suspense fallback={<div>Joining room...</div>}>
      <ChannelProvider>
        <ChatRoomContextProvider>
          <Room />
        </ChatRoomContextProvider>
      </ChannelProvider>
    </Suspense>
  );
}
