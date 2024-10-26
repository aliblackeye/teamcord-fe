import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ParticipantVideoProps {
  isMicrophoneOn: boolean;
  isCameraOn: boolean;
  toggleMicrophone: () => void;
  toggleCamera: () => void;
  videoRef: any;
}
export const ParticipantVideo = ({
  videoRef,
  isMicrophoneOn,
  isCameraOn,
  toggleMicrophone,
  toggleCamera,
}: ParticipantVideoProps) => {
  return (
    <div className="rounded-md bg-primary">
      <video ref={videoRef} autoPlay muted />

      <div className="flex gap-4">
        <Button onClick={toggleMicrophone}>
          {isMicrophoneOn ? <MicOff /> : <Mic />}
        </Button>
        <Button onClick={toggleCamera}>
          {isCameraOn ? <VideoOff /> : <Video />}
        </Button>
      </div>
    </div>
  );
};
