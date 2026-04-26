import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestUrgency } from '@prisma/client';

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(userId: string, dto: CreateRequestDto) {
    return this.prisma.serviceRequest.create({
      data: {
        ...dto,
        requesterId: userId,
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            averageRating: true,
          },
        },
      },
    });
  }

  async getAllRequests(
    skip: number = 0,
    take: number = 20,
    urgency?: RequestUrgency,
    minBudget?: number,
    maxBudget?: number,
    search?: string,
  ) {
    const where: any = {};

    // Filter by urgency
    if (urgency) {
      where.urgency = urgency;
    }

    // Filter by budget range
    if (minBudget !== undefined || maxBudget !== undefined) {
      where.budget = {};
      if (minBudget !== undefined) {
        where.budget.gte = minBudget;
      }
      if (maxBudget !== undefined) {
        where.budget.lte = maxBudget;
      }
    }

    // Search by title or description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.serviceRequest.findMany({
      where,
      skip,
      take,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
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
            bio: true,
            profilePicture: true,
            averageRating: true,
            createdAt: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }

  async getRequestsByRequester(
    requesterId: string,
    skip: number = 0,
    take: number = 10,
  ) {
    return this.prisma.serviceRequest.findMany({
      where: { requesterId },
      skip,
      take,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            averageRating: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRequestsByUrgency(
    urgency: RequestUrgency,
    skip: number = 0,
    take: number = 20,
  ) {
    return this.prisma.serviceRequest.findMany({
      where: { urgency },
      skip,
      take,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            averageRating: true,
          },
        },
      },
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
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            averageRating: true,
          },
        },
      },
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
