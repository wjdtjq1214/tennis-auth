import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { ResponseExceptionFilter } from './middleware/response.exception-filter';
import { ApiResponseInterceptor } from './middleware/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalFilters(new ResponseExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
  Logger.log(
    `Server Start Port: ${process.env.SERVER_PORT ?? 3000} Env: ${process.env.NODE_ENV}`,
  );
}
bootstrap();
