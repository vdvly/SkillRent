import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  success: boolean;
  data: null;
  message: string;
  error?: any;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;

    // Extract message from NestJS validation or custom exceptions
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const rawMessage = (exceptionResponse as any).message;

      if (Array.isArray(rawMessage)) {
        message = rawMessage.join(', ');
      } else if (typeof rawMessage === 'string') {
        message = rawMessage;
      }
    }

    const errorResponse: ErrorResponse = {
      success: false,
      data: null,
      message,
    };

    // Include full error details only in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error = exceptionResponse;
    }

    response.status(status).json(errorResponse);
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const rawMessage =
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
          ? (exceptionResponse as any).message
          : exception.message;

      if (Array.isArray(rawMessage)) {
        message = rawMessage.join(', ');
      } else if (typeof rawMessage === 'string') {
        message = rawMessage;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: ErrorResponse = {
      success: false,
      data: null,
      message,
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.error = exception;
    }

    response.status(status).json(errorResponse);
  }
}
