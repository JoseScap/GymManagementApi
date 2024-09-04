import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GymLoggerService } from 'src/gym-logger/gym-logger.service';
import { MembersService } from 'src/members/members.service';

@WebSocketGateway()
export class CommunicationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  constructor(
    private readonly membersService: MembersService,
    private readonly logger: GymLoggerService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log('Client connected', client.id)
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected', client.id)
  }

  @SubscribeMessage('App:Log')
  AppLog(@MessageBody() message) {
    this.logger.log("App:Log ->", message)
  }

  @SubscribeMessage('Bio:Log')
  BioLog(@MessageBody() message) {
    this.logger.log("Bio:Log ->", message)
  }

  @SubscribeMessage('App:Ping')
  AppPing() {
    this.logger.log("App:Ping -> Emit -> Bio:Ping -> Without data")
    this.server.emit('Bio:Ping')
  }

  @SubscribeMessage('Bio:Pong')
  BioPong() {
    this.logger.log("Bio:Pong -> Emit -> App:Pong -> Without data")
    this.server.emit('App:Pong')
  }

  @SubscribeMessage('Bio:Capture')
  BioCapture(@MessageBody() message) {
    this.logger.log("Bio:Capture -> Emit -> App:Capture -> with data:", message)
    this.server.emit('App:Capture', message)
  }

  @SubscribeMessage('Bio:ErrorMerge')
  BioErrorMerge() {
    this.logger.log("Bio:ErrorMerge -> Emit -> App:ErrorMerge -> with data:")
    this.server.emit('App:ErrorMerge')
  }

  @SubscribeMessage('Bio:Identify')
  async BioIdentify(@MessageBody() message) {
    if (message.id < 0) {
      this.logger.log("Bio:Identify -> Emit -> App:Identify -> with ", message, "-> Result ->", null)
      return this.server.emit('App:Identify', null)
    }
    let member = await this.membersService.findOneByFingerprintId(message.Id)
    this.logger.log("Bio:Identify -> Emit -> App:Identify -> with ", message, "-> Result ->", member)
    this.server.emit('App:Identify', member)
  }

  @SubscribeMessage('App:ChangeAction')
  AppChangeAction(@MessageBody() message) {
    this.logger.log("App:ChangeAction -> Emit -> Bio:ChangeAction -> With ->", message)
    this.server.emit('Bio:ChangeAction', message)
  }

  @SubscribeMessage('App:AddFingerTemplate')
  AppAddFingerTemplate(@MessageBody() message) {
    this.logger.log("App:AddFingerTemplate -> Emit -> Bio:AddFingerTemplate -> With ->", message)
    this.server.emit('Bio:AddFingerTemplate', message)
  }
}
