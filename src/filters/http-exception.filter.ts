import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    const errorMessage =
      typeof message === 'string'
        ? message
        : typeof message === 'object' &&
            message !== null &&
            'message' in message
          ? (message as { message: string }).message
          : 'Internal server error';

    response.status(status).json({
      message: errorMessage,
    });
  }
}
