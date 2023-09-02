import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import {
  Injectable,
  Logger,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WebsocketExceptionsFilter } from 'src/filter/websocket-exception.filter';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatService } from './chat.service';
import { RequestAllMessages } from './dto/request-all-messages.dto';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongoose/mongoose-class-serializer.interceptor';
import { Chat } from 'src/schemas/chat.schema';
import { OnEvent } from '@nestjs/event-emitter';
import { IJoinedRoom } from 'src/interfaces/joined-room.interface';
import { ILeaveRoom } from 'src/interfaces/leave-room.interface';

@Injectable()
@WebSocketGateway({
  namespace: 'chat',
})
@UseFilters(new WebsocketExceptionsFilter())
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  public socketClients: { [x: string]: string[] } = {};

  constructor(
    private readonly authService: AuthService,
    private readonly chatRoomService: ChatRoomService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  io: Namespace;

  async afterInit(): Promise<void> {
    this.logger.log('Websocket Chat Gateway initialized.');
  }

  async handleConnection(socket: Socket): Promise<void> {
    const sockets = this.io.sockets;
    try {
      const user = await this.authService.getUserFromSocket(socket);

      this.logger.log(`User ${user._id} connected with socket: ${socket.id}!`);
      this.logger.debug(`Number of connected sockets: ${sockets.size}`);

      if (!this.socketClients[user._id]) {
        this.socketClients[user._id] = [socket.id];
      } else {
        this.socketClients[user._id].push(socket.id);
      }

      const rooms = await this.chatRoomService.findByUserId(user._id);
      rooms.forEach((room) => {
        socket.join(`room-${room._id}`);
      });
    } catch (error) {
      if (error instanceof WsException) {
        socket.emit('message', {
          id: socket.id,
          message: error.getError(),
        });
        socket.disconnect();
      }
    }
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    const sockets = this.io.sockets;

    try {
      const user = await this.authService.getUserFromSocket(socket);
      if (!this.socketClients[user._id]) {
        this.socketClients[user._id] = [];
      } else {
        const index = this.socketClients[user._id].indexOf(socket.id);
        this.socketClients[user._id].splice(index, 1);
      }
    } catch (error) {}

    this.logger.log(`Disconnected client socket with id: ${socket.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  @UsePipes(new ValidationPipe())
  @UseFilters(new WebsocketExceptionsFilter())
  @UseInterceptors(MongooseClassSerializerInterceptor(Chat))
  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: SendMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromSocket(socket);
    const message = await this.chatService.saveMessage(content, user);

    this.io.to(`room-${content.roomId}`).emit('message', message);
  }

  @UsePipes(new ValidationPipe())
  @UseFilters(new WebsocketExceptionsFilter())
  @UseInterceptors(MongooseClassSerializerInterceptor(Chat))
  @SubscribeMessage('request_all_messages')
  async requestAllMessagess(
    @MessageBody() content: RequestAllMessages,
    @ConnectedSocket() socket: Socket,
  ) {
    await this.authService.getUserFromSocket(socket);
    const messages = await this.chatService.getAllMessages(content);

    socket.emit('all_messages', messages);
    return 'hello';
  }

  @OnEvent('room.joined')
  handleJoinRoomEvent(payload: IJoinedRoom) {
    const socketClients = this.socketClients[payload.userId];
    if (socketClients) {
      socketClients.forEach((socketId) => {
        const socket = this.io.sockets.get(socketId);
        socket.join(`room-${payload.roomId}`);
      });
    }
  }

  @OnEvent('room.leave')
  handleLeaveRoomEvent(payload: ILeaveRoom) {
    const socketClients = this.socketClients[payload.userId];
    if (socketClients) {
      socketClients.forEach((socketId) => {
        const socket = this.io.sockets.get(socketId);
        socket.leave(`room-${payload.roomId}`);
      });
    }
  }
}
