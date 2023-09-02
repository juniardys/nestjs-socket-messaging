import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { User } from './user.schema';
import { ChatRoom } from './chat-room.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Chat {
  @Transform((params) => params.obj._id.toString())
  _id: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  @Type(() => User)
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
  })
  @Type(() => ChatRoom)
  chatRoom: ChatRoom;

  createdAt: Date;

  updatedAt: Date;

  _doc: { [x: string]: any };
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
