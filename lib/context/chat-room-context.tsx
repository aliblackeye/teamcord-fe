"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useSocket } from "./socket-context";
import { Participant, PeerData, Room, WebRTCSignal } from "../types";
import useSound from "use-sound";
import { useChannel } from "./channel-context";

import Peer, { SignalData } from "simple-peer";

interface IChatRoomContext {
  joinRoom: (participant: Participant) => void;
  leaveRoom: (participant: Participant) => void;
  getMediaStream: (faceMode?: string) => Promise<MediaStream | null>;
  localStream: MediaStream | null;
  isOnCall: boolean;
  room: Room | null;
  peers: PeerData[];
}

const ChatRoomContext = createContext<IChatRoomContext | null>(null);
const iceServers: RTCIceServer[] = [
  {
    urls: [
      "stun:stun.l.google.com:19302",
      "stun:stun1.l.google.com:19302",
      "stun:stun2.l.google.com:19302",
      "stun:stun3.l.google.com:19302",
    ],
  },
  {
    urls: "stun:stun.relay.metered.ca:80",
  },
  {
    urls: "turn:a.relay.metered.ca:80",
    username: "3d33a57ef155efb838d32b7f",
    credential: "aZTrXGsg50igmOfN",
  },
  {
    urls: "turn:a.relay.metered.ca:443",
    username: "3d33a57ef155efb838d32b7f",
    credential: "aZTrXGsg50igmOfN",
  },
  {
    urls: "turn:a.relay.metered.ca:443?transport=tcp",
    username: "3d33a57ef155efb838d32b7f",
    credential: "aZTrXGsg50igmOfN",
  },
  {
    urls: "turn:a.relay.metered.ca:80?transport=tcp",
    username: "3d33a57ef155efb838d32b7f",
    credential: "aZTrXGsg50igmOfN",
  },
];
export const ChatRoomContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Sound
  const [playJoinSound] = useSound("/assets/sounds/join.mp3");
  const [playLeaveSound] = useSound("/assets/sounds/leave.mp3");

  // Socket
  const { socket, isSocketConnected } = useSocket();
  const { subscribers, channelId } = useChannel();

  // States
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [isOnCall, setIsOnCall] = useState(false);
  const [peers, setPeers] = useState<PeerData[]>([]);

  const previousVoiceChannelRef = useRef<Room | null>(null);

  const handleHangUp = useCallback(({}) => {}, []);

  const createPeer = useCallback(
    (stream: MediaStream, initiator: boolean, participant: Participant) => {
      const peer = new Peer({
        stream,
        initiator,
        trickle: true,
        config: {
          iceServers,
        },
      });

      peer.on("stream", (stream) => {
        setPeers((prev) => [
          ...prev,
          { peerConnection: peer, stream, participant },
        ]);
      });

      peer.on("error", (error) => {
        console.error("Peer error", error);
      });

      peer.on("close", handleHangUp);

      const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc;

      rtcPeerConnection.oniceconnectionstatechange = async () => {
        if (
          rtcPeerConnection.iceConnectionState === "disconnected" ||
          rtcPeerConnection.iceConnectionState === "failed"
        ) {
          handleHangUp({});
        }
      };

      return peer;
    },
    [setPeers, handleHangUp]
  );

  const joinRoom = useCallback(
    async (participant: Participant) => {
      if (!socket || !isSocketConnected) return;
      const stream = await getMediaStream();
      if (!stream) {
        console.log("No stream in joinRoom");
        return;
      }

      const newPeer = createPeer(stream, true, participant);

      setPeers((prev) => [
        ...prev,
        { peerConnection: newPeer, stream, participant },
      ]);

      newPeer.on("signal", async (data: SignalData) => {
        // emit signal to other peers
        socket?.emit("webrtc-signal", {
          sdp: data,
          participant,
        } as WebRTCSignal);
      });

      socket?.emit("join-room", { channelId, participant });
      setIsOnCall(true);
    },
    [socket, channelId, isSocketConnected]
  );

  const leaveRoom = useCallback(
    (participant: Participant) => {
      socket?.emit("leave-room", { channelId, participant });
      setIsOnCall(false);
    },
    [socket, channelId]
  );

  const completePeerConnection = useCallback(
    async ({ sdp, participant }: WebRTCSignal) => {
      if (!localStream) {
        console.log("No local stream in completePeerConnection");
        return;
      }

      const peer = peers.find(
        (p) => p.participant.socketId === participant.socketId
      );
      if (peer) {
        peer.peerConnection.signal(sdp);
      } else {
        const newPeer = createPeer(localStream, true, participant);

        setPeers((prev) => [
          ...prev,
          { peerConnection: newPeer, stream: null, participant },
        ]);

        newPeer.on("signal", async (data: SignalData) => {
          // emit signal to other peers
          socket?.emit("webrtc-signal", {
            sdp: data,
            participant,
          } as WebRTCSignal);
        });
      }
    },
    [localStream, createPeer, peers, room]
  );

  const getMediaStream = useCallback(
    async (faceMode?: string) => {
      if (localStream) {
        return localStream;
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        const stream = await navigator.mediaDevices.getUserMedia({
          // ses kalitesini maksimize et
          audio: {
            echoCancellation: false,
            noiseSuppression: true,
            sampleRate: 48000,
            sampleSize: 16,
          },
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 360, ideal: 720, max: 1080 },
            frameRate: { min: 16, ideal: 30, max: 30 },
            facingMode: videoDevices.length > 0 ? faceMode : undefined,
          },
        });

        setLocalStream(stream);
        return stream;
      } catch (error) {
        console.error("Failed to get media stream", error);
        setLocalStream(null);
        return null;
      }
    },
    [localStream]
  );

  const getRoom = useCallback((updatedVoiceChannel: Room) => {
    const previousVoiceChannel = previousVoiceChannelRef.current;

    if (previousVoiceChannel) {
      // VoiceChannel subscribers azalırsa
      if (
        previousVoiceChannel?.usersInCall?.length >
        updatedVoiceChannel?.usersInCall?.length
      ) {
        playLeaveSound();
      }

      // VoiceChannel subscribers artırırsa
      else {
        playJoinSound();
      }
    }

    setRoom(updatedVoiceChannel);
    previousVoiceChannelRef.current = updatedVoiceChannel;
  }, []);

  // Set online users
  useEffect(() => {
    if (!isSocketConnected || !socket) return;

    // İlk başta voiceChannel'ı almak için
    socket.emit("get-room");

    socket.on("get-room", getRoom);
    socket.on("webrtc-signal", completePeerConnection);
    return () => {
      socket.off("get-room", getRoom);
      socket.off("webrtc-signal", completePeerConnection);
    };
  }, [socket, isSocketConnected, getRoom, completePeerConnection]);

  return (
    <ChatRoomContext.Provider
      value={{
        room,
        joinRoom,
        leaveRoom,
        isOnCall,
        getMediaStream,
        localStream,
        peers,
      }}
    >
      {children}
    </ChatRoomContext.Provider>
  );
};

export const useChatRoom = () => {
  const context = useContext(ChatRoomContext);
  if (!context) {
    throw new Error(
      "useChatRoom must be used within a ChatRoomContextProvider"
    );
  }
  return context;
};
