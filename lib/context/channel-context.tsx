"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSocket } from "./socket-context";
import { Channel, Subscriber } from "../types";

interface IChannelContext {
  channelId: string;
  subscribers: Subscriber[];
}

const ChannelContext = createContext<IChannelContext>({
  channelId: "",
  subscribers: [],
});

export const ChannelContextProvider = ({
  children,
  channelId,
}: {
  children: React.ReactNode;
  channelId: string;
}) => {
  const { socket, isSocketConnected } = useSocket();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  if (!channelId) throw new Error("Channel ID is required");

  const handleGetChannelSubscribers = useCallback((channel: Channel) => {
    setSubscribers(channel.subscribers);
  }, []);

  // Set online users
  useEffect(() => {
    if (!isSocketConnected || !socket) return;

    const isSubscribed = subscribers?.find((sub) => sub.socketId === socket.id);

    socket.on("get-channel-subscribers", handleGetChannelSubscribers);

    if (!isSubscribed) {
      socket.emit("subscribe-channel", {
        channelId,
        socketId: socket.id,
      });
    }

    return () => {
      socket.off("get-channel-subscribers", handleGetChannelSubscribers);
    };
  }, [
    socket,
    isSocketConnected,
    channelId,
    handleGetChannelSubscribers,
    subscribers,
  ]);

  return (
    <ChannelContext.Provider value={{ channelId, subscribers }}>
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannel = () => {
  const context = useContext(ChannelContext);

  if (context === undefined) {
    throw new Error(
      "useChannelContext must be used within a ChannelContextProvider"
    );
  }
  return context;
};
