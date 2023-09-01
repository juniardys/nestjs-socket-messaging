import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from 'src/shared/config/config.service';
import * as timestring from 'timestring';
import * as dayjs from 'dayjs';
import { RegisterDto } from './dtos/register.dto';
import { RegisterResponseDto } from './dtos/response/register-response.dto';
import { serialize } from 'v8';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    const expiredAt = dayjs().add(expiresInSeconds, 's');
    const payload = { id: user._id };

    return {
      access_token: await this.jwtService.signAsync(payload),
      expiresIn,
      expiredAt,
    };
  }

  async register(data: RegisterDto): Promise<RegisterResponseDto> {
    const registeredUser = await this.userRepository.findByEmail(data.email);
    if (registeredUser) {
      throw new HttpException('Already registered!', HttpStatus.FOUND);
    }

    const pass = await bcrypt.hash(data.password, 10);
    const createdUser = await this.userRepository.create({
      ...data,
      password: pass,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...responseUser } = createdUser._doc;

    return new RegisterResponseDto(responseUser);
  }
}
