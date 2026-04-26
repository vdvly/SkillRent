import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceCategory } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async createService(userId: string, dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        ...dto,
        ownerId: userId,
      },
      include: {
        owner: {
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

  async getAllServices(
    skip: number = 0,
    take: number = 20,
    category?: ServiceCategory,
    minPrice?: number,
    maxPrice?: number,
    search?: string,
  ) {
    const where: any = {};

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Search by title or description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.service.findMany({
      where,
      skip,
      take,
      include: {
        owner: {
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

  async getServiceById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        owner: {
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

    if (!service) {
      throw new NotFoundException(`Service not found`);
    }

    return service;
  }

  async getServicesByOwner(ownerId: string, skip: number = 0, take: number = 10) {
    return this.prisma.service.findMany({
      where: { ownerId },
      skip,
      take,
      include: {
        owner: {
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

  async updateService(id: string, userId: string, dto: UpdateServiceDto) {
    const service = await this.prisma.service.findUnique({ where: { id } });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own services');
    }

    return this.prisma.service.update({
      where: { id },
      data: dto,
      include: {
        owner: {
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

  async deleteService(id: string, userId: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own services');
    }

    return this.prisma.service.delete({ where: { id } });
  }

  async getServicesByCategory(
    category: ServiceCategory,
    skip: number = 0,
    take: number = 20,
  ) {
    return this.prisma.service.findMany({
      where: { category },
      skip,
      take,
      include: {
        owner: {
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
}
