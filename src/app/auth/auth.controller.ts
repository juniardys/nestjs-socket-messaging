import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/decorators/response/response.decorator';
import { ResponseText } from 'src/constants/response.contants';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
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
}
