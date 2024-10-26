"use client";

import { RoomContextProvider } from "@/lib/context/room-context";

import { useSearchParams } from "next/navigation";

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "Anonim";
  const roomId = searchParams.get("roomId") || "Anonim";
  return (
    <RoomContextProvider roomId={roomId} participantId={username}>
      {children}
    </RoomContextProvider>
  );
};
