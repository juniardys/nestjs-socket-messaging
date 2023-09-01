import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ChatModule } from './app/chat/chat.module';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './shared/config/config.service';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forRootAsync({
      imports: [SharedModule],
      useFactory: async (configService: ConfigService) =>
        configService.mongooseOptions,
      inject: [ConfigService],
    }),
    ChatModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
