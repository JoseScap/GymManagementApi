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

  @SubscribeMessage('App:Ping')
  AppPing() {
    console.log("App:Ping emit Bio:Ping")
    this.server.emit('Bio:Ping', { data: true })
  }

  @SubscribeMessage('Bio:Pong')
  BioPong(@MessageBody() data) {
    console.log("Bio:Pong emit App:Pong")
    this.server.emit('App:Pong', data)
  }

  @SubscribeMessage('App:RegisterFingerprint')
  registerFingerprint(@MessageBody() data: AppRegisterFingerprint) {
    if (typeof data.value === 'boolean') this.server.emit('Bio:RegisterFingerprint', data)
  }
}
