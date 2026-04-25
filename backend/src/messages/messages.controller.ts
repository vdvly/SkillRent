import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UseGuards(JwtGuard)
  async sendMessage(@Request() req, @Body() dto: CreateMessageDto) {
    return this.messagesService.sendMessage(req.user.id, dto);
  }

  @Get('conversation/:userId')
  @UseGuards(JwtGuard)
  async getConversation(
    @Request() req,
    @Param('userId') userId: string,
    @Query('skip') skip: string = '0',
  ) {
    return this.messagesService.getConversation(
      req.user.id,
      userId,
      parseInt(skip),
    );
  }

  @Get('received')
  @UseGuards(JwtGuard)
  async getReceivedMessages(
    @Request() req,
    @Query('skip') skip: string = '0',
  ) {
    return this.messagesService.getReceivedMessages(
      req.user.id,
      parseInt(skip),
    );
  }

  @Post(':id/read')
  @UseGuards(JwtGuard)
  async markAsRead(@Param('id') id: string) {
    return this.messagesService.markAsRead(id);
  }
}
