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

  @Get('conversations')
  @UseGuards(JwtGuard)
  async getConversations(
    @Request() req,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
  ) {
    return this.messagesService.getUserConversations(
      req.user.id,
      parseInt(skip),
      parseInt(take),
    );
  }

  @Get('conversations/:conversationId')
  @UseGuards(JwtGuard)
  async getConversationById(
    @Request() req,
    @Param('conversationId') conversationId: string,
  ) {
    return this.messagesService.getConversationById(conversationId, req.user.id);
  }

  @Get('conversation/:userId')
  @UseGuards(JwtGuard)
  async getConversation(
    @Request() req,
    @Param('userId') userId: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '50',
  ) {
    return this.messagesService.getConversation(
      req.user.id,
      userId,
      parseInt(skip),
      parseInt(take),
    );
  }

  @Get('received')
  @UseGuards(JwtGuard)
  async getReceivedMessages(
    @Request() req,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
  ) {
    return this.messagesService.getReceivedMessages(
      req.user.id,
      parseInt(skip),
      parseInt(take),
    );
  }

  @Post(':id/read')
  @UseGuards(JwtGuard)
  async markAsRead(@Request() req, @Param('id') id: string) {
    return this.messagesService.markAsRead(id, req.user.id);
  }

  @Post('conversations/:conversationId/read')
  @UseGuards(JwtGuard)
  async markConversationAsRead(
    @Request() req,
    @Param('conversationId') conversationId: string,
  ) {
    return this.messagesService.markConversationAsRead(conversationId, req.user.id);
  }
}
