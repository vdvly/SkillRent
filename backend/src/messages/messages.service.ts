import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(userId: string, dto: CreateMessageDto) {
    // Verify receiver exists
    const receiver = await this.prisma.user.findUnique({
      where: { id: dto.receiverId },
    });

    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    if (userId === dto.receiverId) {
      throw new BadRequestException('Cannot send message to yourself');
    }

    // Get or create conversation
    let conversation = await this.prisma.conversation.findUnique({
      where: {
        participant1Id_participant2Id: {
          participant1Id: userId < dto.receiverId ? userId : dto.receiverId,
          participant2Id: userId < dto.receiverId ? dto.receiverId : userId,
        },
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          participant1Id: userId < dto.receiverId ? userId : dto.receiverId,
          participant2Id: userId < dto.receiverId ? dto.receiverId : userId,
        },
      });
    }

    // Create message in the conversation
    const message = await this.prisma.message.create({
      data: {
        content: dto.content,
        senderId: userId,
        conversationId: conversation.id,
      },
      include: {
        sender: {
          select: { id: true, name: true, profilePicture: true },
        },
        conversation: true,
      },
    });

    // Update conversation last updated time
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async getConversation(
    userId: string,
    otherUserId: string,
    skip: number = 0,
    take: number = 50,
  ) {
    // Verify both users exist
    const otherUser = await this.prisma.user.findUnique({
      where: { id: otherUserId },
    });

    if (!otherUser) {
      throw new NotFoundException('User not found');
    }

    // Get or create conversation
    const conversation = await this.prisma.conversation.findUnique({
      where: {
        participant1Id_participant2Id: {
          participant1Id: userId < otherUserId ? userId : otherUserId,
          participant2Id: userId < otherUserId ? otherUserId : userId,
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const messages = await this.prisma.message.findMany({
      where: { conversationId: conversation.id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    return messages.reverse(); // Return in chronological order
  }

  async getUserConversations(userId: string, skip: number = 0, take: number = 20) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
      include: {
        participant1: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        participant2: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take,
    });
  }

  async getConversationById(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participant1: {
          select: { id: true, name: true, profilePicture: true },
        },
        participant2: {
          select: { id: true, name: true, profilePicture: true },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify user is part of the conversation
    if (
      conversation.participant1Id !== userId &&
      conversation.participant2Id !== userId
    ) {
      throw new BadRequestException('You are not part of this conversation');
    }

    return conversation;
  }

  async getReceivedMessages(userId: string, skip: number = 0, take: number = 20) {
    return this.prisma.message.findMany({
      where: {
        conversation: {
          OR: [
            { participant1Id: userId },
            { participant2Id: userId },
          ],
        },
        NOT: { senderId: userId },
      },
      include: {
        sender: {
          select: { id: true, name: true, profilePicture: true },
        },
        conversation: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: { conversation: true },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Verify user is part of the conversation
    if (
      message.conversation.participant1Id !== userId &&
      message.conversation.participant2Id !== userId
    ) {
      throw new BadRequestException('You cannot mark this message as read');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markConversationAsRead(conversationId: string, userId: string) {
    const conversation = await this.getConversationById(conversationId, userId);

    return this.prisma.message.updateMany({
      where: {
        conversationId,
        NOT: { senderId: userId },
        isRead: false,
      },
      data: { isRead: true, readAt: new Date() },
    });
  }
}
