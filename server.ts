import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { SocketUser } from "@/lib/types";
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  let onlineUsers: SocketUser[] = [];

  io.on("connection", (socket) => {
    console.log("client connected...", socket.id);
    // Add user to online users list
    socket.on("add-user", (username) => {
      if (username && !onlineUsers.some((user) => user.username === username)) {
        onlineUsers.push({ username, socketId: socket.id });
      }

      // Send active users to all clients
      io.emit("get-users", onlineUsers);
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

      // Send active users to all clients
      io.emit("get-users", onlineUsers);
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
