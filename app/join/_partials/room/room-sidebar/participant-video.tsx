import { useChatRoom } from "@/lib/context/chat-room-context";
import { useSocket } from "@/lib/context/socket-context";
import { Participant } from "@/lib/types";
import { useEffect, useRef } from "react";

export const ParticipantVideo = ({
  participant,
}: {
  participant: Participant;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { localStream, peers } = useChatRoom();
  const { socket } = useSocket();

  const isLocalStream = participant?.socketId === socket?.id;
  const stream = peers?.find(
    (p) => p.participant.socketId === participant.socketId
  )?.stream;

  useEffect(() => {
    if (videoRef.current && stream) {
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
        muted={false}
        playsInline
      />
    </div>
  );
};
