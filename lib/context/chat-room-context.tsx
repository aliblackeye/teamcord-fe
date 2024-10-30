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
import { Participant, PeerData, VoiceChannel, WebRTCSignal } from "../types";
import useSound from "use-sound";
import { useChannel } from "./channel-context";

import Peer, { SignalData } from "simple-peer";

interface IChatRoomContext {
  joinVoiceChannel: (participant: Participant) => void;
  leaveVoiceChannel: (participant: Participant) => void;
  getMediaStream: (faceMode?: string) => Promise<MediaStream | null>;
  localStream: MediaStream | null;
  isOnVoiceChannel: boolean;
  voiceChannel: VoiceChannel | null;
  peers: PeerData[];
}

const ChatRoomContext = createContext<IChatRoomContext | null>(null);

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
  const [voiceChannel, setVoiceChannel] = useState<VoiceChannel | null>(null);
  const [isOnVoiceChannel, setIsOnVoiceChannel] = useState(false);
  const [peers, setPeers] = useState<PeerData[]>([]);

  const previousVoiceChannelRef = useRef<VoiceChannel | null>(null);

  const handleHangUp = useCallback(({}) => {}, []);

  const createPeer = useCallback(
    (stream: MediaStream, initiator: boolean, participant: Participant) => {
      const iceServers: RTCIceServer[] = [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
          ],
        },
        /* {
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
      }, */
      ];

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

  const joinVoiceChannel = useCallback(
    async (participant: Participant) => {
      if (!socket || !isSocketConnected) return;
      const stream = await getMediaStream();
      if (!stream) {
        console.log("No stream in joinVoiceChannel");
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

      socket?.emit("join-voice-channel", { channelId, participant });
      setIsOnVoiceChannel(true);
    },
    [socket, channelId, isSocketConnected]
  );

  const leaveVoiceChannel = useCallback(
    (participant: Participant) => {
      socket?.emit("leave-voice-channel", { channelId, participant });
      setIsOnVoiceChannel(false);
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
    [localStream, createPeer, peers, voiceChannel]
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
          audio: true,
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

  const getVoiceChannel = useCallback((updatedVoiceChannel: VoiceChannel) => {
    const previousVoiceChannel = previousVoiceChannelRef.current;

    if (previousVoiceChannel) {
      // VoiceChannel subscribers azalırsa
      if (
        previousVoiceChannel.subscribers.length >
        updatedVoiceChannel.subscribers.length
      ) {
        playLeaveSound();
      }

      // VoiceChannel subscribers artırırsa
      else {
        playJoinSound();
      }
    }

    setVoiceChannel(updatedVoiceChannel);
    previousVoiceChannelRef.current = updatedVoiceChannel;
  }, []);

  // Set online users
  useEffect(() => {
    if (!isSocketConnected || !socket) return;

    // İlk başta voiceChannel'ı almak için
    socket.emit("get-voice-channel");

    socket.on("get-voice-channel", getVoiceChannel);
    socket.on("webrtc-signal", completePeerConnection);
    return () => {
      socket.off("get-voice-channel", getVoiceChannel);
      socket.off("webrtc-signal", completePeerConnection);
    };
  }, [socket, isSocketConnected, getVoiceChannel, completePeerConnection]);

  return (
    <ChatRoomContext.Provider
      value={{
        voiceChannel,
        joinVoiceChannel,
        leaveVoiceChannel,
        isOnVoiceChannel,
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
