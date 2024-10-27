import { ResizablePanel } from "@/components/ui/resizable";
import { useChatRoom } from "@/lib/context/chat-room-context";
import { useSocket } from "@/lib/context/socket-context";
import { useEffect, useRef } from "react";

export const RoomContentPanel = ({
  localStream,
}: {
  localStream: MediaStream | null;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { voiceChannel } = useChatRoom();
  const { socket } = useSocket();

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <ResizablePanel defaultSize={100} minSize={0}>
      <div className="p-4 h-full flex gap-4 flex-wrap justify-center items-center ">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
        {voiceChannel?.subscribers?.map((p, index) => {
          return (
            <div
              key={index}
              className="min-w-[300px] min-h-[200px] flex items-center justify-center"
            >
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted={p.socketId === socket?.id}
                playsInline
                /* ref={p.stream} */
              />
            </div>
          );
        })}
      </div>
    </ResizablePanel>
  );
};
