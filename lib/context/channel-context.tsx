"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./socket-context";
import { SocketUser } from "../types";

interface IChannelContext {
  channelId: string;
  subscribers: SocketUser[];
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
  const [subscribers, setSubscribers] = useState<SocketUser[]>([]);

  if (!channelId) throw new Error("Channel ID is required");

  // Set online users
  useEffect(() => {
    if (!isSocketConnected || !socket) return;
    socket.emit("subscribe-channel", { channelId, socketId: socket.id });

    socket.on("get-channel-subscribers", (users) => {
      setSubscribers(users);
    });

    return () => {
      socket.off("get-channel-subscribers");
    };
  }, [socket, isSocketConnected, channelId]);

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
