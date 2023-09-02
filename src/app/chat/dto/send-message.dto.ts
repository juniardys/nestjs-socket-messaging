import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  constructor(partial: Partial<SendMessageDto>) {
    Object.assign(this, partial);
  }
}
