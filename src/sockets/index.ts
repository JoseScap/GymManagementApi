import { Server as IOServer } from "socket.io";
import { handleNotificationsEvents } from "./notification.socket";

export function rootEventHandler(io: IOServer): void {
  io.on('connection', (socket) => {
    console.log('a user connected');

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    // Handle notification events
    handleNotificationsEvents(socket, io);
  });
}
