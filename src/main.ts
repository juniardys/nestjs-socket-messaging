import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SharedModule } from './shared/shared.module';
import { ConfigService } from './shared/config/config.service';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.select(SharedModule).get(ConfigService);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.getNumber('PORT') || 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
