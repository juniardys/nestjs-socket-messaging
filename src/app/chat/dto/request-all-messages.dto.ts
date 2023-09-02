import { IsNotEmpty, IsString } from 'class-validator';

export class RequestAllMessages {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  constructor(partial: Partial<RequestAllMessages>) {
    Object.assign(this, partial);
  }
}
