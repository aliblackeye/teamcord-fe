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
import { User, PeerData, Room, WebRTCSignal } from "../types";
import useSound from "use-sound";
import { useChannel } from "./channel-context";

import Peer, { SignalData } from "simple-peer";

interface IChatRoomContext {
  joinCall: (user: User) => void;
  joinRoom: (username: string) => void;
  leaveRoom: (user: User) => void;
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
  const { channelId } = useChannel();

  // States
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [isOnCall, setIsOnCall] = useState(false);
  const [peers, setPeers] = useState<PeerData[]>([]);

  const previousRoomRef = useRef<Room | null>(null);

  const handleHangUp = useCallback(({}) => {}, []);

  const createPeer = useCallback(
    (stream: MediaStream, initiator: boolean, user: User) => {
      const peer = new Peer({
        stream,
        initiator,
        trickle: true,
        config: {
          iceServers,
        },
      });

      peer.on("stream", (stream) => {
        setPeers((prev) => [...prev, { peerConnection: peer, stream, user }]);
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

  const joinCall = useCallback(
    async (user: User) => {
      if (!socket || !isSocketConnected) return;
      const stream = await getMediaStream();
      if (!stream) {
        console.log("No stream in joinCall");
        return;
      }

      const newPeer = createPeer(stream, true, user);

      setPeers((prev) => [...prev, { peerConnection: newPeer, stream, user }]);

      newPeer.on("signal", async (data: SignalData) => {
        // emit signal to other peers
        socket?.emit("webrtc-signal", {
          sdp: data,
          user,
        } as WebRTCSignal);
      });

      socket?.emit("join-call", { channelId, user });
      setIsOnCall(true);
    },
    [socket, channelId, isSocketConnected]
  );

  const joinRoom = useCallback(
    (username: string) => {
      if (!socket || !isSocketConnected) return;
      socket.emit("join-room", {
        channelId,
        user: { socketId: socket.id, username },
      });
      console.log("odaya giriş yapılıyor");
    },
    [socket, channelId, isSocketConnected]
  );

  const leaveRoom = useCallback(
    (user: User) => {
      socket?.emit("leave-room", { channelId, user });
      setIsOnCall(false);
    },
    [socket, channelId]
  );

  const completePeerConnection = useCallback(
    async ({ sdp, user }: WebRTCSignal) => {
      if (!localStream) {
        console.log("No local stream in completePeerConnection");
        return;
      }

      const peer = peers.find((p) => p.user.socketId === user.socketId);
      if (peer) {
        peer.peerConnection.signal(sdp);
      } else {
        const newPeer = createPeer(localStream, true, user);

        setPeers((prev) => [
          ...prev,
          { peerConnection: newPeer, stream: null, user },
        ]);

        newPeer.on("signal", async (data: SignalData) => {
          // emit signal to other peers
          socket?.emit("webrtc-signal", {
            sdp: data,
            user,
          } as WebRTCSignal);
        });
      }
    },
    [localStream, peers]
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

  const getRoom = useCallback((updatedRoom: Room) => {
    const previousRoom = previousRoomRef.current;

    if (previousRoom) {
      // Room subscribers azalırsa
      if (
        previousRoom?.usersInCall?.length > updatedRoom?.usersInCall?.length
      ) {
        playLeaveSound();
      }

      // VoiceChannel subscribers artırırsa
      else {
        playJoinSound();
      }
    }

    setRoom(updatedRoom);
    previousRoomRef.current = updatedRoom;
  }, []);

  // Set online users
  useEffect(() => {
    console.log("ChatRoomContextProvider useEffect çalıştı");
    if (!isSocketConnected || !socket) return;

    socket.on("get-room", getRoom);
    socket.on("webrtc-signal", completePeerConnection);

    return () => {
      socket.off("get-room", getRoom);
      socket.off("webrtc-signal", completePeerConnection);
    };
  }, [socket, isSocketConnected, getRoom, completePeerConnection, channelId]);

  return (
    <ChatRoomContext.Provider
      value={{
        room,
        joinCall,
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
