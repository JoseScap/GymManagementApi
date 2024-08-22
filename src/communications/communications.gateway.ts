import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChangeStatusMessage } from './dto/input/change-status-message';

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
    console.log("App:Ping -> Emit -> Bio:Ping -> Without data")
    this.server.emit('Bio:Ping')
  }

  @SubscribeMessage('Bio:Pong')
  BioPong() {
    console.log("Bio:Pong -> Emit -> App:Pong -> Without data")
    this.server.emit('App:Pong')
  }

  @SubscribeMessage('App:ChangeStatus')
  registerFingerprint(@MessageBody() data: ChangeStatusMessage) {
    console.log("App:ChangeStatus -> Emit -> Bio:ChangeStatus -> With ->", data)
    if (typeof data.value === 'boolean') this.server.emit('Bio:ChangeStatus', data)
  }
}
