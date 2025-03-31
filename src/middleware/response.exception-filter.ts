import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

import { ApiResponseDto } from './dto/response.dto';

@Catch(HttpException)
export class ResponseExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const code = exception.getStatus();
    const data = exception.getResponse();
    const success = false;

    Logger.error('ResponseExceptionFilter', code, data);

    response.status(code).json(new ApiResponseDto(code, success, data));
  }
}
