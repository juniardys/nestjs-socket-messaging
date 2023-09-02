import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongoose/mongoose-class-serializer.interceptor';
import { ChatRoom } from 'src/schemas/chat-room.schema';
import { TransformInterceptor } from 'src/interceptors/transform/transform.interceptor';
import { ResponseText } from 'src/constants/response.contants';
import { ResponseMessage } from 'src/decorators/response/response.decorator';
import { AuthGuard } from '../auth/auth.guard';
import mongoose from 'mongoose';

@Controller('chat-room')
@UseInterceptors(MongooseClassSerializerInterceptor(ChatRoom))
@UseInterceptors(TransformInterceptor)
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @HttpCode(HttpStatus.OK)
  @ResponseMessage(ResponseText.ME)
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.chatRoomService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @ResponseMessage(ResponseText.ME)
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createChatRoomDto: CreateChatRoomDto) {
    return this.chatRoomService.create(createChatRoomDto);
  }

  @HttpCode(HttpStatus.OK)
  @ResponseMessage(ResponseText.ME)
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid params id');
    return this.chatRoomService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @ResponseMessage(ResponseText.ME)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid params id');
    return this.chatRoomService.delete(id);
  }

  @HttpCode(HttpStatus.OK)
  @ResponseMessage(ResponseText.ME)
  @UseGuards(AuthGuard)
  @Post(':id/join')
  async join(@Param('id') id: string, @Request() req) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid params id');
    return this.chatRoomService.join(id, req.user);
  }

  @HttpCode(HttpStatus.OK)
  @ResponseMessage(ResponseText.ME)
  @UseGuards(AuthGuard)
  @Post(':id/leave')
  async leave(@Param('id') id: string, @Request() req) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid params id');
    return this.chatRoomService.leave(id, req.user);
  }
}
