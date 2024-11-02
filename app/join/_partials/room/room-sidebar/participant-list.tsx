"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useChatRoom } from "@/lib/context/chat-room-context";
import { RoomActions } from "./room-actions";
import { Participant } from "./participant";

export const ParticipantList = () => {
  const { room } = useChatRoom();

  return (
    <div className="flex flex-col w-[220px] justify-between dark:border-neutral-800 border-neutral-200 dark:bg-neutral-900 bg-neutral-100 h-[calc(100%-60px)]">
      <ScrollArea className="h-full">
        <div className="p-1">
          {room?.usersInCall?.map((user, index) => {
            return <Participant key={index} user={user} />;
          })}
        </div>
      </ScrollArea>
      <RoomActions />
    </div>
  );
};
