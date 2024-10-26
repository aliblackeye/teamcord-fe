import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRoom } from "@/lib/context/room-context";
import { cn } from "@/lib/utils/cn";
import { MicOff, Phone, PhoneOff, ScreenShare, VideoOff } from "lucide-react";
import { useSearchParams } from "next/navigation";

export const Participants = () => {
  const { onlineUsers } = useRoom();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "Anonim";

  return (
    <div className="flex flex-col w-[220px] justify-between dark:border-neutral-800 border-neutral-200 h-[calc(100%-60px)]">
      <ScrollArea className="h-full">
        <div className="p-4">
          {onlineUsers?.map((user, index) => {
            return (
              <div key={index} className="flex gap-2 mb-4 items-center">
                <Avatar
                  key={index}
                  className={cn(
                    "w-10 h-10  overflow-hidden ",
                    username === user.username && "ring-4 ring-green-500"
                  )}
                >
                  <AvatarImage
                    src={`https://cdn.dribbble.com/userupload/13643081/file/original-6bff19f67096525f84984e9465892dca.png?resize=400x300&vertical=center`}
                  />
                  <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
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

const RoomActionButton = ({
  children,
  tooltip,
  variant,
}: {
  children: React.ReactNode;
  tooltip: string;
  variant?: "success" | "destructive";
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" className="w-9 h-8" variant={variant}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
};

const RoomActions = () => {
  const isMicOn = false;
  const isScreenShareOn = false;
  const isCameraOn = false;
  const isChatOn = false;
  const delayDuration = 1000;
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "Anonim";

  return (
    <div
      className={cn(
        "bg-muted min-h-[121px] h-[121px]",
        !isChatOn && "min-h-[73px] h-[73px]"
      )}
    >
      <TooltipProvider delayDuration={delayDuration}>
        {isChatOn && (
          <div className="px-4 py-2">
            <div className="flex gap-2 justify-between">
              <RoomActionButton tooltip="Kamerayı Aç">
                <VideoOff />
              </RoomActionButton>

              <RoomActionButton tooltip="Mikrofonu Kapat">
                <MicOff />
              </RoomActionButton>
              <RoomActionButton tooltip="Ekranı Paylaş">
                <ScreenShare />
              </RoomActionButton>
              {isChatOn && (
                <RoomActionButton
                  tooltip="Sohbetten Ayrıl"
                  variant="destructive"
                >
                  <PhoneOff />
                </RoomActionButton>
              )}
            </div>
          </div>
        )}
        <div className="flex justify-between items-center p-4 border-t border-neutral-700 ">
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage
                src={`https://cdn.dribbble.com/userupload/13643081/file/original-6bff19f67096525f84984e9465892dca.png?resize=400x300&vertical=center`}
              />
              <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center max-w-20">
              <p className="text-sm truncate">{username}</p>
              <p className="text-xs text-muted-foreground">Çevrim içi</p>
            </div>
          </div>

          {!isChatOn && (
            <RoomActionButton tooltip="Sohbete Katıl" variant="success">
              <Phone />
            </RoomActionButton>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
};
