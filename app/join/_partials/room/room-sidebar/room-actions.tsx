import { useChatRoom } from "@/lib/context/chat-room-context";
import { useSocket } from "@/lib/context/socket-context";
import { cn } from "@/lib/utils/cn";
import {
  Mic,
  MicOff,
  MonitorX,
  Phone,
  PhoneOff,
  ScreenShare,
  Video,
  VideoOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoomActionButton } from "./room-action-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShowPing } from "@/components/show-ping";

export const RoomActions = () => {
  const delayDuration = 1000;
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "Anonim";
  const {
    joinVoiceChannel,
    leaveVoiceChannel,
    isOnVoiceChannel,

    localStream,
  } = useChatRoom();
  const { socket } = useSocket();

  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenShareOn, setIsScreenShareOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      console.log("videoTrack.enabled", videoTrack.enabled);
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];

      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  const toggleScreenShare = () => {
    setIsScreenShareOn(!isScreenShareOn);
  };

  useEffect(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      const videoTrack = localStream.getVideoTracks()[0];
      setIsMicOn(audioTrack.enabled);
      setIsCameraOn(videoTrack.enabled);
    }
  }, [localStream]);

  return (
    <div
      className={cn(
        "min-h-[108px] h-[108px] border-t dark:border-neutral-800",
        !isOnVoiceChannel && "min-h-[60px] h-[60px]"
      )}
    >
      <TooltipProvider delayDuration={delayDuration}>
        {isOnVoiceChannel && (
          <div className="px-4 py-2 h-12">
            <div className="flex gap-2 justify-between">
              <RoomActionButton
                tooltip={isCameraOn ? "Kamerayı Kapat" : "Kamerayı Aç"}
                onClick={toggleCamera}
              >
                {isCameraOn ? <Video /> : <VideoOff />}
              </RoomActionButton>

              <RoomActionButton
                tooltip={isMicOn ? "Mikrofonu Sessize Al" : "Mikrofonu Aç"}
                onClick={toggleMic}
              >
                {isMicOn ? <Mic /> : <MicOff />}
              </RoomActionButton>
              <RoomActionButton
                disabled
                tooltip={isScreenShareOn ? "Paylaşımı Durdur" : "Ekranı Paylaş"}
                onClick={toggleScreenShare}
              >
                {isScreenShareOn ? <MonitorX /> : <ScreenShare />}
              </RoomActionButton>
              {isOnVoiceChannel && (
                <RoomActionButton
                  tooltip="Bağlantıyı Kes"
                  variant="destructive"
                  onClick={() =>
                    leaveVoiceChannel({
                      username,
                      socketId: socket?.id as string,
                    })
                  }
                >
                  <PhoneOff />
                </RoomActionButton>
              )}
            </div>
          </div>
        )}
        <div className="flex justify-between h-[60px]  items-center px-4  border-t dark:border-neutral-800">
          <div className="flex gap-2">
            <Avatar className="w-8 h-8">
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

          {!isOnVoiceChannel ? (
            <RoomActionButton
              tooltip="Sohbete Bağlan"
              variant="success"
              onClick={() =>
                joinVoiceChannel({ username, socketId: socket?.id as string })
              }
            >
              <Phone />
            </RoomActionButton>
          ) : (
            <ShowPing ping={100} />
          )}
        </div>
      </TooltipProvider>
    </div>
  );
};
