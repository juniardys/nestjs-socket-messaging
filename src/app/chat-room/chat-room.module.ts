import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomRepository } from './chat-room.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from 'src/schemas/chat-room.schema';
import { Chat, ChatSchema } from 'src/schemas/chat.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserModule } from '../user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: User.name, schema: UserSchema },
    ]),
    EventEmitterModule.forRoot(),
    UserModule,
  ],
  controllers: [ChatRoomController],
  providers: [ChatRoomService, ChatRoomRepository],
  exports: [ChatRoomService, ChatRoomRepository],
})
export class ChatRoomModule {}
