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
import { Participant, VoiceChannel } from "../types";
import useSound from "use-sound";
import { useChannel } from "./channel-context";

interface IChatRoomContext {
  joinVoiceChannel: (participant: Participant) => void;
  leaveVoiceChannel: (participant: Participant) => void;
  getVoiceChannel: () => void;
  isOnVoiceChannel: boolean;
  voiceChannel: VoiceChannel | null;
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
  const [voiceChannel, setVoiceChannel] = useState<VoiceChannel | null>(null);
  const [isOnVoiceChannel, setIsOnVoiceChannel] = useState(false);

  const previousVoiceChannelRef = useRef<VoiceChannel | null>(null);

  const joinVoiceChannel = useCallback(
    (participant: Participant) => {
      socket?.emit("join-voice-channel", { channelId, participant });
      setIsOnVoiceChannel(true);
    },
    [socket, channelId]
  );

  const leaveVoiceChannel = useCallback(
    (participant: Participant) => {
      socket?.emit("leave-voice-channel", { channelId, participant });
      setIsOnVoiceChannel(false);
    },
    [socket, channelId]
  );

  const getVoiceChannel = useCallback(() => {
    socket?.emit("get-voice-channel", channelId);
  }, [socket, channelId]);

  // Set online users
  useEffect(() => {
    if (!isSocketConnected || !socket) return;

    // İlk başta voiceChannel'ı almak için
    getVoiceChannel();

    socket.on("get-voice-channel", (updatedVoiceChannel) => {
      console.log("voiceChannel received on client", updatedVoiceChannel);

      const previousVoiceChannel = previousVoiceChannelRef.current;

      if (previousVoiceChannel) {
        console.log("ses oynatılıyor");
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
    });

    return () => {
      socket.off("get-voice-channel");
    };
  }, [socket, isSocketConnected, getVoiceChannel]);

  return (
    <ChatRoomContext.Provider
      value={{
        voiceChannel,
        joinVoiceChannel,
        leaveVoiceChannel,
        isOnVoiceChannel,
        getVoiceChannel,
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
