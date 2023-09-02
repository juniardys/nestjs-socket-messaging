import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { ChatRoomModule } from '../chat-room/chat-room.module';
import { ChatRepository } from './chat.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/schemas/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    AuthModule,
    ChatRoomModule,
  ],
  providers: [ChatGateway, ChatService, ChatRepository],
})
export class ChatModule {}
