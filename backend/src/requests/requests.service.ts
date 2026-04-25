import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(userId: string, dto: CreateRequestDto) {
    return this.prisma.serviceRequest.create({
      data: {
        ...dto,
        requesterId: userId,
      },
    });
  }

  async getAllRequests(skip: number = 0, take: number = 20) {
    return this.prisma.serviceRequest.findMany({
      skip,
      take,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            averageRating: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRequestById(id: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            averageRating: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }

  async getRequestsByRequester(requesterId: string) {
    return this.prisma.serviceRequest.findMany({
      where: { requesterId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateRequest(id: string, userId: string, dto: UpdateRequestDto) {
    const request = await this.prisma.serviceRequest.findUnique({ where: { id } });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.requesterId !== userId) {
      throw new ForbiddenException('You can only update your own requests');
    }

    return this.prisma.serviceRequest.update({
      where: { id },
      data: dto,
    });
  }

  async deleteRequest(id: string, userId: string) {
    const request = await this.prisma.serviceRequest.findUnique({ where: { id } });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.requesterId !== userId) {
      throw new ForbiddenException('You can only delete your own requests');
    }

    return this.prisma.serviceRequest.delete({ where: { id } });
  }
}
