import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/decorators/response/response.decorator';
import { ResponseText } from 'src/constants/response.contants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './auth.guard';
import { TransformInterceptor } from 'src/interceptors/transform/transform.interceptor';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongoose/mongoose-class-serializer.interceptor';
import { User } from 'src/schemas/user.schema';

@Controller('auth')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ResponseMessage(ResponseText.LOGIN)
  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(ResponseText.REGISTER)
  @Post('register')
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @HttpCode(HttpStatus.OK)
  @ResponseMessage(ResponseText.ME)
  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Request() req) {
    return this.authService.me(req.user);
  }
}
