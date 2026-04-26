import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';

@Injectable()
export class RecommendationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecommendationsForUser(userId: string, limit = 10) {
    try {
      // Get user's past requests to understand interests
      const userRequests = await this.prisma.serviceRequest.findMany({
        where: { requesterId: userId },
        take: 10,
        select: { title: true, description: true },
      });

      // Extract keywords from user's requests
      const keywords = userRequests
        .map((r) => [r.title, r.description])
        .flat()
        .filter(Boolean);

      // Rule-based recommendation: Find services matching user's interests
      const recommendations = await this.prisma.service.findMany({
        where: {
          OR: keywords.length
            ? [
                {
                  OR: keywords.map((kw) => ({
                    title: { contains: kw, mode: 'insensitive' },
                  })),
                },
              ]
            : undefined,
          // Exclude services from the same user
          NOT: { ownerId: userId },
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
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      // If no recommendations based on keywords, get popular services
      if (recommendations.length === 0) {
        return this.getPopularServices(userId, limit);
      }

      return {
        recommendations,
        source: 'interest-based', // Show recommendation source
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getPopularServices(userId, limit);
    }
  }

  private async getPopularServices(userId: string, limit = 10) {
    const services = await this.prisma.service.findMany({
      where: {
        NOT: { ownerId: userId },
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
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return {
      recommendations: services,
      source: 'popular', // Fallback to popular services
    };
  }

  async getRecommendedRequests(userId: string, limit = 10) {
    try {
      // Get user's provided services to understand expertise
      const userServices = await this.prisma.service.findMany({
        where: { ownerId: userId },
        take: 10,
        select: { category: true, title: true },
      });

      const categories = userServices.map((s) => s.category);

      // Find requests matching user's service categories
      const recommendations = await this.prisma.serviceRequest.findMany({
        where: {
          OR: categories.length
    ? categories.map((cat) => ({
        title: { contains: cat, mode: 'insensitive' },
      }))
    : undefined,
  NOT: { requesterId: userId },
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
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      // Fallback to recent requests if no matching categories
      if (recommendations.length === 0) {
        return this.getRecentRequests(userId, limit);
      }

      return {
        recommendations,
        source: 'skill-based',
      };
    } catch (error) {
      console.error('Error generating request recommendations:', error);
      return this.getRecentRequests(userId, limit);
    }
  }

  private async getRecentRequests(userId: string, limit = 10) {
    const requests = await this.prisma.serviceRequest.findMany({
      where: {
        NOT: { requesterId: userId },
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
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return {
      recommendations: requests,
      source: 'recent',
    };
  }

  async getTrendingServices(limit = 10) {
    // Simple trending: Most recently created or by rating
    const services = await this.prisma.service.findMany({
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
      orderBy: [{ createdAt: 'desc' }],
      take: limit,
    });

    return {
      trending: services,
      algorithm: 'recent-first',
    };
  }
}
