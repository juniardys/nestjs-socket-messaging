import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { User } from './user.schema';
import { Chat } from './chat.schema';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class ChatRoom {
  @Transform((params) => params.obj._id.toString())
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
      },
    ],
  })
  @Type(() => Chat)
  chats: Chat[];

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  @Type(() => User)
  users: User[];

  createdAt: Date;

  updatedAt: Date;

  _doc: { [x: string]: any };
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
