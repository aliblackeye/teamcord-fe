"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      router.push(`/rooms/${roomId}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Odaya Katıl</h1>
        <input
          type="text"
          placeholder="Oda ID'si"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleJoinRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
        >
          Katıl
        </button>
      </div>
    </div>
  );
}
