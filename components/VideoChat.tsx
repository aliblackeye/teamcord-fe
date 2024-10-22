"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// Yeni backend URL'sini kullanın
const socket = io(process.env.NEXT_PUBLIC_BASE_URL);

interface VideoChatProps {
  roomId: string;
}

export default function VideoChat({ roomId }: VideoChatProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  useEffect(() => {
    async function getMedia() {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setAudioStream(audioStream);

        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
        });
        setVideoStream(videoStream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = videoStream;
        }

        // STUN sunucusu ekleyin
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            // TURN sunucusu eklemek isterseniz:
            // { urls: "turn:your.turn.server:3478", username: "user", credential: "pass" }
          ],
        });

        audioStream
          .getTracks()
          .forEach((track) => pc.addTrack(track, audioStream));
        videoStream
          .getTracks()
          .forEach((track) => pc.addTrack(track, videoStream));
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
    if (audioStream) {
      audioStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicrophoneOn(!isMicrophoneOn);
    }
  };

  const toggleCamera = () => {
    if (videoStream) {
      videoStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay playsInline muted />
      <video ref={remoteVideoRef} autoPlay playsInline />
      <button onClick={toggleMicrophone}>
        {isMicrophoneOn ? "Mikrofonu Kapat" : "Mikrofonu Aç"}
      </button>
      <button onClick={toggleCamera}>
        {isCameraOn ? "Kamerayı Kapat" : "Kamerayı Aç"}
      </button>
    </div>
  );
}
