"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BASE_URL);

const iceServers = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun3.l.google.com:19302" },
  { urls: "stun:stun4.l.google.com:19302" },
  {
    urls: "turn:numb.viagenie.ca",
    credential: "muazkh",
    username: "webrtc@live.com",
  },
];

interface VideoChatProps {
  roomId: string;
  username: string;
}

interface Participant {
  id: string;
  stream: MediaStream;
}

export default function VideoChat({ roomId, username }: VideoChatProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [peerConnections, setPeerConnections] = useState<
    Map<string, RTCPeerConnection>
  >(new Map());
  const [participants, setParticipants] = useState<Participant[]>([]);
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

        socket.emit("join-room", { roomId, username });

        socket.on("existing-users", (existingUsers: string[]) => {
          existingUsers.forEach((userId) => {
            if (!peerConnections.has(userId)) {
              createPeerConnection(userId);
            }
          });
        });

        socket.on("user-joined", ({ id, username }) => {
          console.log(`User joined: ${username} (${id})`);
          if (id !== socket.id && !peerConnections.has(id)) {
            createPeerConnection(id);
          }
        });

        socket.on("offer", async (offer, senderId) => {
          console.log(`Received offer from ${senderId}`);
          if (senderId !== socket.id) {
            let pc = peerConnections.get(senderId);
            if (!pc) {
              pc = createPeerConnection(senderId);
            }
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("answer", answer, roomId, senderId);
          }
        });

        socket.on("answer", async (answer, senderId) => {
          console.log(`Received answer from ${senderId}`);
          const pc = peerConnections.get(senderId);
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

        socket.on("ice-candidate", async (candidate, senderId) => {
          console.log(`Received ICE candidate from ${senderId}`);
          const pc = peerConnections.get(senderId);
          if (pc) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
              console.error("Error adding received ice candidate", e);
            }
          }
        });

        socket.on("user-left", ({ id }) => {
          setParticipants((prev) =>
            prev.filter((participant) => participant.id !== id)
          );
          const pc = peerConnections.get(id);
          if (pc) {
            pc.close();
            setPeerConnections((prev) => {
              const newMap = new Map(prev);
              newMap.delete(id);
              return newMap;
            });
          }
        });
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    }

    getMedia();

    return () => {
      peerConnections.forEach((pc) => pc.close());
      setPeerConnections(new Map());
      setParticipants([]);
      socket.off("existing-users");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
    };
  }, [roomId]);

  const createPeerConnection = (userId: string) => {
    if (peerConnections.has(userId)) {
      console.warn(`PeerConnection for ${userId} already exists`);
      return peerConnections.get(userId)!;
    }

    const pc = new RTCPeerConnection({ iceServers });

    if (audioStream) {
      audioStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, audioStream));
    }
    if (videoStream) {
      videoStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, videoStream));
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate, roomId, userId);
      }
    };

    pc.ontrack = (event) => {
      console.log(`Received track from ${userId}`);
      setParticipants((prev) => [
        ...prev.filter((p) => p.id !== userId),
        { id: userId, stream: event.streams[0] },
      ]);
    };

    setPeerConnections((prev) => new Map(prev).set(userId, pc));

    // Yeni eklenen kısım
    pc.onnegotiationneeded = async () => {
      try {
        await pc.setLocalDescription(await pc.createOffer());
        socket.emit("offer", pc.localDescription, roomId, userId);
      } catch (err) {
        console.error("Error creating offer:", err);
      }
    };

    return pc;
  };

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
      <h2>Kullanıcı: {username}</h2>
      <div className="grid grid-cols-2 gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full"
        />
        {participants.map((participant) => (
          <video
            key={participant.id}
            autoPlay
            playsInline
            className="w-full"
            ref={(videoElement) => {
              if (videoElement) {
                videoElement.srcObject = participant.stream;
              }
            }}
          />
        ))}
      </div>
      <button onClick={toggleMicrophone}>
        {isMicrophoneOn ? "Mikrofonu Kapat" : "Mikrofonu Aç"}
      </button>
      <button onClick={toggleCamera}>
        {isCameraOn ? "Kamerayı Kapat" : "Kamerayı Aç"}
      </button>
    </div>
  );
}
