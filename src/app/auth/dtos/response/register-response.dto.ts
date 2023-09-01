import { Exclude } from 'class-transformer';

export class RegisterResponseDto {
  _id: string;

  name: string;

  email: string;

  @Exclude()
  password: string;

  createdAt: Date;

  updatedAt: Date;

  @Exclude()
  __v: number;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}
