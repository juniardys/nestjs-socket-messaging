import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoom } from 'src/schemas/chat-room.schema';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';

@Injectable()
export class ChatRoomRepository {
  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
  ) {}

  async findAll(): Promise<ChatRoom[]> {
    return this.chatRoomModel.find().populate(['users', 'chats']);
  }

  async findById(id: string): Promise<ChatRoom> {
    return this.chatRoomModel.findById(id).populate(['users', 'chats']);
  }

  async delete(id: string): Promise<ChatRoom> {
    return this.chatRoomModel.findByIdAndDelete(id);
  }

  async addUser(id: string, userId: string): Promise<ChatRoom> {
    return this.chatRoomModel
      .findByIdAndUpdate(
        id,
        { $addToSet: { users: userId } },
        { new: true, useFindAndModify: false },
      )
      .populate(['users', 'chats']);
  }

  async removeUser(id: string, userId: string): Promise<ChatRoom> {
    return this.chatRoomModel
      .findByIdAndUpdate(
        id,
        { $pull: { users: userId } },
        { new: true, useFindAndModify: false },
      )
      .populate(['users', 'chats']);
  }

  async create(data: CreateChatRoomDto): Promise<ChatRoom> {
    const created = new this.chatRoomModel(data);
    await created.populate(['users', 'chats']);
    return created.save();
  }

  async findByUserId(id: string): Promise<ChatRoom[]> {
    return this.chatRoomModel
      .find({
        users: id,
      })
      .populate(['users', 'chats']);
  }

  async addMessage(id: string, messageId: string): Promise<ChatRoom> {
    return this.chatRoomModel
      .findByIdAndUpdate(
        id,
        { $addToSet: { chats: messageId } },
        { new: true, useFindAndModify: false },
      )
      .populate(['users', 'chats']);
  }
}
