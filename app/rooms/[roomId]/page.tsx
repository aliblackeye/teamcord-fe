"use client";

import VideoChat from "@/components/VideoChat";
import React from "react";

type Params = {
  roomId: string;
};

export default function Room({ params }: { params: Params }) {
  const { roomId } = React.use(params as any) as Params;

  return (
    <div>
      <h1>Oda: {roomId}</h1>
      <VideoChat roomId={roomId as string} />
    </div>
  );
}
