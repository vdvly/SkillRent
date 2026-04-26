import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        bio: true,
        averageRating: true,
        createdAt: true,
      },
    });
  }

  async getAllUsers(skip: number = 0, take: number = 10) {
    return this.prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        bio: true,
        averageRating: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPublicProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        profilePicture: true,
        bio: true,
        averageRating: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get reputation score (total reviews received)
    const reviewsReceived = await this.prisma.review.count({
      where: { reviewedUserId: id },
    });

    // Get services count
    const servicesCount = await this.prisma.service.count({
      where: { ownerId: id },
    });

    // Get requests count
    const requestsCount = await this.prisma.serviceRequest.count({
      where: { requesterId: id },
    });

    return {
      ...user,
      reviewsCount: reviewsReceived,
      servicesCount,
      requestsCount,
    };
  }

  async getUserServices(userId: string, skip: number = 0, take: number = 10) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.service.findMany({
      where: { ownerId: userId },
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

  async getUserRequests(userId: string, skip: number = 0, take: number = 10) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.serviceRequest.findMany({
      where: { requesterId: userId },
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

  async getUserReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { reviewedUserId: userId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async calculateReputationScore(userId: string): Promise<number> {
    const reviews = await this.prisma.review.findMany({
      where: { reviewedUserId: userId },
    });

    if (reviews.length === 0) {
      return 0;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal
  }

  async updateProfile(id: string, data: any) {
    // Validate data
    const allowedFields = ['name', 'profilePicture', 'bio', 'latitude', 'longitude'];
    const updateData: any = {};

    for (const field of allowedFields) {
      if (field in data) {
        updateData[field] = data[field];
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        bio: true,
        averageRating: true,
        latitude: true,
        longitude: true,
        createdAt: true,
      },
    });
  }

  async updateAverageRating(userId: string) {
    const averageRating = await this.calculateReputationScore(userId);
    return this.prisma.user.update({
      where: { id: userId },
      data: { averageRating },
    });
  }
}