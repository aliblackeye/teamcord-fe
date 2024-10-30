import { ResizablePanel } from "@/components/ui/resizable";
import { useChatRoom } from "@/lib/context/chat-room-context";
import { useSocket } from "@/lib/context/socket-context";
import { useEffect, useRef } from "react";
import { ParticipantVideo } from "./room-sidebar/participant-video";

export const RoomContentPanel = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { voiceChannel, localStream } = useChatRoom();
  const { socket } = useSocket();

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <ResizablePanel defaultSize={100} minSize={0}>
      <div className="p-4 h-full flex gap-4 flex-wrap justify-center items-center ">
        {voiceChannel?.subscribers?.map((p, index) => (
          <ParticipantVideo key={index} participant={p} />
        ))}
      </div>
    </ResizablePanel>
  );
};
