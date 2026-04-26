import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceNotFoundException extends HttpException {
  constructor(resource: string, id?: string) {
    super(
      `${resource} not found${id ? ` (ID: ${id})` : ''}`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UnauthorizedAccessException extends HttpException {
  constructor(message: string = 'Unauthorized access') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
