import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/schemas/chat.schema';

@Injectable()
export class ChatRepository {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async save(message: string, userId: string, roomId: string): Promise<Chat> {
    return new this.chatModel({
      message,
      user: userId,
      chatRoom: roomId,
    }).save();
  }

  async findByChatRoom(chatRoomId: string): Promise<Chat[]> {
    return this.chatModel
      .find({ chatRoom: chatRoomId })
      .sort({ createdAt: 'desc' });
  }
}
