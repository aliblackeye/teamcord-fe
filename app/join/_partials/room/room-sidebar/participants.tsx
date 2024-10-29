"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChatRoom } from "@/lib/context/chat-room-context";
import { cn } from "@/lib/utils/cn";
import { useSearchParams } from "next/navigation";
import { RoomActions } from "./room-actions";

export const Participants = () => {
  const { voiceChannel } = useChatRoom();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "Anonim";

  return (
    <div className="flex flex-col w-[220px] justify-between dark:border-neutral-800 border-neutral-200 dark:bg-neutral-900 bg-neutral-100 h-[calc(100%-60px)]">
      <ScrollArea className="h-full">
        <div className="p-4">
          {voiceChannel?.subscribers?.map((user, index) => {
            return (
              <div key={index} className="flex gap-2 mb-4 items-center">
                <Avatar
                  key={index}
                  className={cn(
                    "w-6 h-6  overflow-hidden ",
                    username === user.username && "ring-2 ring-green-500"
                  )}
                >
                  <AvatarImage
                    src={`https://cdn.dribbble.com/userupload/13643081/file/original-6bff19f67096525f84984e9465892dca.png?resize=400x300&vertical=center`}
                  />
                  <AvatarFallback>{user?.username.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <TooltipProvider delayDuration={500}>
                  <Tooltip>
                    <TooltipTrigger className="cursor-default">
                      <div className="flex items-center gap-2 max-w-24">
                        <p className="text-sm truncate">{user.username}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">{user.username}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <RoomActions />
    </div>
  );
};
