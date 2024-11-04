"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatRoom } from "@/lib/context/chat-room-context";

export const RoomUsers = () => {
  const { room } = useChatRoom();

  return (
    <div className="h-full bg-neutral-200 dark:bg-neutral-900 w-[280px] border-l border-neutral-300 dark:border-neutral-700">
      <ScrollArea className="h-full flex gap-2  ">
        {room?.users?.map((s, index) => (
          <div
            key={index}
            className="flex items-center mx-2 my-2.5 gap-2 transition-all duration-150 hover:bg-neutral-300 dark:hover:bg-neutral-800 rounded-md p-1.5 cursor-pointer"
          >
            <div className="relative">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={`https://cdn.dribbble.com/userupload/13643081/file/original-6bff19f67096525f84984e9465892dca.png?resize=400x300&vertical=center`}
                />
                <AvatarFallback>{"ab"?.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-[9px] h-[9px] ring-[3px] ring-black bg-green-500 rounded-full"></div>
            </div>

            <p className="text-sm text-muted-foreground dark:text-white w-full break-all ">
              {s.socketId}
            </p>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
