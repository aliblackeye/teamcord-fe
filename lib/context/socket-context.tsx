"use client";
import { useContext, useEffect, useState, createContext } from "react";
import { io, Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
  isSocketConnected: boolean;
  ping: number;
}

export const SocketContext = createContext<ISocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [ping, setPing] = useState(0);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const start = Date.now();

      socket?.emit("ping", () => {
        const duration = Date.now() - start;
        setPing(duration);
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [socket]);

  useEffect(() => {
    const newSocket = io(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"
    );

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      setIsSocketConnected(true);
    };

    const onDisconnect = () => {
      setIsSocketConnected(false);
    };

    if (socket?.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isSocketConnected,
        ping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
};
