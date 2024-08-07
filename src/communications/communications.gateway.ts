import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppRegisterFingerprint } from './dto/input/app-register-fingerprint';

@WebSocketGateway()
export class CommunicationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  handleConnection(client: Socket) {
    console.log('Client connected', client.id)
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id)
  }

  @SubscribeMessage('App:RegisterFingerprint')
  registerFingerprint(@MessageBody() data: AppRegisterFingerprint) {
    if (typeof data.status === 'boolean') this.server.emit('Bio:RegisterFingerprint', data)
  }
}
