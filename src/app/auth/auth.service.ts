import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from 'src/shared/config/config.service';
import * as timestring from 'timestring';
import * as dayjs from 'dayjs';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/schemas/user.schema';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);
    const isAuthValid =
      user && (await bcrypt.compare(data.password, user.password));

    if (!isAuthValid) {
      throw new UnauthorizedException();
    }

    const expiresIn = this.configService.jwtConfig.expiry;
    const expiresInSeconds = timestring(expiresIn);
    const expiredAt = dayjs().add(expiresInSeconds, 's').toDate();
    const payload = { id: user._id };

    return {
      access_token: await this.jwtService.signAsync(payload),
      expiresIn,
      expiredAt,
    };
  }

  async register(data: RegisterDto): Promise<User> {
    const registeredUser = await this.userRepository.findByEmail(data.email);
    if (registeredUser) {
      throw new HttpException('Already registered!', HttpStatus.FOUND);
    }

    const pass = await bcrypt.hash(data.password, 10);
    const createdUser = await this.userRepository.create({
      ...data,
      password: pass,
    });

    return createdUser;
  }

  async me(user: User): Promise<User> {
    return user;
  }

  async getUserFromAuthenticationToken(token: string): Promise<User> {
    if (!token) throw new WsException('Invalid Credentials.');
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.jwtConfig.secret,
      });
      return this.userService.getUserById(payload.id);
    } catch (error) {
      return null;
    }
  }

  async getUserFromSocket(socket: Socket) {
    const token = socket.handshake.headers.authorization;
    const user = await this.getUserFromAuthenticationToken(token);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }
}
