import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async logActivity(userId: string, dto: CreateActivityDto) {
    try {
      return await this.prisma.activity.create({
        data: {
          userId,
          action: dto.action,
          description: dto.description,
          resourceId: dto.resourceId,
        },
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      // Fail silently - don't break main functionality for logging failures
      return null;
    }
  }

  async getUserActivity(userId: string, skip: number = 0, take: number = 50) {
    return this.prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async getActivityStats(userId: string) {
    const activities = await this.prisma.activity.findMany({
      where: { userId },
      select: { action: true },
    });

    // Count activities by type
    const stats = activities.reduce(
      (acc, activity) => {
        acc[activity.action] = (acc[activity.action] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalActivities: activities.length,
      breakdown: stats,
    };
  }

  async getRecentActivity(limit: number = 100) {
    return this.prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getPlatformStats() {
    const [totalActivities, activityByType] = await Promise.all([
      this.prisma.activity.count(),
      this.prisma.activity.findMany({
        select: { action: true },
      }),
    ]);

    const breakdown = activityByType.reduce(
      (acc, activity) => {
        acc[activity.action] = (acc[activity.action] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalActivities,
      breakdown,
    };
  }
}
