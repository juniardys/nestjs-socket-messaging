import { Injectable } from '@nestjs/common';
import { Chat } from 'src/schemas/chat.schema';
import { ChatRepository } from './chat.repository';
import { SendMessageDto } from './dto/send-message.dto';
import { User } from 'src/schemas/user.schema';
import { ChatRoomRepository } from '../chat-room/chat-room.repository';
import { RequestAllMessages } from './dto/request-all-messages.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly chatRoomRepository: ChatRoomRepository,
  ) {}

  async saveMessage(content: SendMessageDto, user: User): Promise<Chat> {
    const chat = await this.chatRepository.save(
      content.message,
      user._id,
      content.roomId,
    );
    await this.chatRoomRepository.addMessage(content.roomId, chat._id);

    return chat;
  }

  async getAllMessages(content: RequestAllMessages): Promise<Chat[]> {
    return this.chatRepository.findByChatRoom(content.roomId);
  }
}
