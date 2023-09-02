import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatRoom } from 'src/schemas/chat-room.schema';
import { User } from 'src/schemas/user.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IJoinedRoom } from 'src/interfaces/joined-room.interface';

@Injectable()
export class ChatRoomService {
  constructor(
    private chatRoomRepository: ChatRoomRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createChatRoomDto: CreateChatRoomDto): Promise<ChatRoom> {
    return this.chatRoomRepository.create(createChatRoomDto);
  }

  async findAll(): Promise<ChatRoom[]> {
    return this.chatRoomRepository.findAll();
  }

  async findOne(id: string): Promise<ChatRoom> {
    const data = await this.chatRoomRepository.findById(id);
    if (!data) throw new BadRequestException('Chat room not found');
    return data;
  }

  async delete(id: string): Promise<ChatRoom> {
    return this.chatRoomRepository.delete(id);
  }

  async join(id: string, user: User): Promise<ChatRoom> {
    const joined = await this.chatRoomRepository.addUser(id, user._id);
    this.eventEmitter.emit('room.joined', {
      roomId: id,
      userId: user._id,
    } as IJoinedRoom);
    return joined;
  }

  async leave(id: string, user: User): Promise<ChatRoom> {
    const leave = await this.chatRoomRepository.removeUser(id, user._id);
    this.eventEmitter.emit('room.leave', {
      roomId: id,
      userId: user._id,
    } as IJoinedRoom);
    return leave;
  }

  async findByUserId(id: string): Promise<ChatRoom[]> {
    return this.chatRoomRepository.findByUserId(id);
  }
}
