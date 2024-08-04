import { Server as IOServer, Socket } from "socket.io";

interface NotificationData {
  message: string;
}

export function handleNotificationsEvents(socket: Socket, io: IOServer): void {
  socket.on('notification', handleNotification);

  function handleNotification(notificationData: NotificationData): void {
    console.log('Notification:', notificationData);
    io.emit('notification', notificationData);
  }
}
