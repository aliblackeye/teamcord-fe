import { useChatRoom } from "@/lib/context/chat-room-context";
import { useEffect, useRef } from "react";

interface ParticipantVideoProps {
  stream: MediaStream | null;
  isLocalStream: boolean;
}
export const ParticipantVideo = ({
  stream,
  isLocalStream,
}: ParticipantVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { localStream } = useChatRoom();

  useEffect(() => {
    if (videoRef.current && stream) {
      console.log("girdi");
      if (isLocalStream) {
        videoRef.current.srcObject = localStream;
      } else {
        return;
        // videoRef.current.srcObject = stream;
      }
    }
  }, [isLocalStream, localStream, stream]);

  return (
    <div className="rounded-md">
      <video
        ref={videoRef}
        className="w-full max-w-[100%] min-w-[350px] min-h-[225px] h-auto object-cover rounded-lg border"
        autoPlay
        muted={isLocalStream}
        playsInline
      />
    </div>
  );
};
