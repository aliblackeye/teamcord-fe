"use client";

import VideoChat from "@/components/VideoChat";
import React from "react";
import { useSearchParams } from "next/navigation";

type Params = {
  roomId: string;
};

export default function Room({ params }: any) {
  const { roomId } = React.use(params as any) as Params;

  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "Anonim";

  return (
    <div>
      <h1>Oda: {roomId}</h1>
      <VideoChat roomId={roomId} username={username} />
    </div>
  );
}
