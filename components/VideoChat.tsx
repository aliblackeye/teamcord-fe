"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

interface VideoChatProps {
  roomId: string;
}

export default function VideoChat({ roomId }: VideoChatProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  useEffect(() => {
    async function getMedia() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true,
        });
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }

        const pc = new RTCPeerConnection();
        mediaStream
          .getTracks()
          .forEach((track) => pc.addTrack(track, mediaStream));
        setPeerConnection(pc);

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", event.candidate, roomId);
          }
        };

        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        socket.emit("join-room", roomId);

        socket.on("offer", async (offer) => {
          if (!pc.currentRemoteDescription) {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("answer", answer, roomId);
          }
        });

        socket.on("answer", async (answer) => {
          if (!pc.currentRemoteDescription) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

        socket.on("ice-candidate", async (candidate) => {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.error("Error adding received ice candidate", e);
          }
        });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", offer, roomId);
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    }

    getMedia();
  }, [roomId]);

  const toggleMicrophone = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicrophoneOn(!isMicrophoneOn);
    }
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay playsInline muted />
      <video ref={remoteVideoRef} autoPlay playsInline />
      <button onClick={toggleMicrophone}>
        {isMicrophoneOn ? "Mikrofonu Kapat" : "Mikrofonu Aç"}
      </button>
    </div>
  );
}
