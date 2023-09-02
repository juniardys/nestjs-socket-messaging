import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dtos/CreateUserDto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async create(data: CreateUserDto): Promise<User> {
    return new this.userModel(data).save();
  }
}
