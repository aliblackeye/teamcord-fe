import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { Channel, VoiceChannel } from "@/lib/types";
import { onJoinVoiceChannel } from "./lib/socket-events/on-join-voice-channel";
import { onSubscribeChannel } from "./lib/socket-events/on-subscribe-channel";

import { onGetVoiceChannel } from "./lib/socket-events/on-get-voice-channel";
import { onLeaveVoiceChannel } from "./lib/socket-events/on-leave-voice-channel";
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
export const voiceChannels: VoiceChannel[] = [];
export let channels: Channel[] = [];

export let io: Server;
app.prepare().then(() => {
  const httpServer = createServer(handler);
  io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("client connected...", socket.id);

    socket.on("subscribe-channel", (data) =>
      onSubscribeChannel({ ...data, socket })
    );

    socket.on("get-voice-channel", onGetVoiceChannel);

    socket.on("join-voice-channel", onJoinVoiceChannel);

    socket.on("leave-voice-channel", onLeaveVoiceChannel);

    socket.on("disconnect", () => {
      const channelIds = channels
        .filter((c) => c.subscribers.some((s) => s.socketId === socket.id))
        .map((c) => c.channelId);

      // Remove user from channels
      channels = channels
        .map((c) => ({
          ...c,
          subscribers: c.subscribers.filter((s) => s.socketId !== socket.id),
        }))
        .filter((c) => c.subscribers.length > 0);
      // Send channels to the same channel subscribers
      io.to(channelIds).emit("get-channel-subscribers", channels);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`Server is running on http://${hostname}:${port}`);
    });
});
