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

  @SubscribeMessage('App:Log')
  AppLog(@MessageBody() message) {
    console.log("App:Log ->", message)
  }

  @SubscribeMessage('Bio:Log')
  BioLog(@MessageBody() message) {
    console.log("Bio:Log ->", message)
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

  @SubscribeMessage('Bio:Capture')
  BioCapture(@MessageBody() message) {
    console.log("Bio:Capture -> Emit -> App:Capture -> with data:", message)
    this.server.emit('App:Capture', message)
  }

  @SubscribeMessage('Bio:ErrorMerge')
  BioErrorMerge() {
    console.log("Bio:ErrorMerge -> Emit -> App:ErrorMerge -> with data:")
    this.server.emit('App:ErrorMerge')
  }

  @SubscribeMessage('Bio:Identify')
  BioIdentify(@MessageBody() message) {
    console.log("Bio:Identify -> Emit -> App:Identify -> with data:", message)
    this.server.emit('App:Identify', message)
  }

  @SubscribeMessage('App:ChangeAction')
  registerFingerprint(@MessageBody() data) {
    console.log("App:ChangeAction -> Emit -> Bio:ChangeAction -> With ->", data)
    this.server.emit('Bio:ChangeAction', data)
  }
}
