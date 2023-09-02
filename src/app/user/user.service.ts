import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }
}
