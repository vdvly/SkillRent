import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(userId: string, dto: CreateReviewDto) {
    // Verify reviewed user exists
    const reviewedUser = await this.prisma.user.findUnique({
      where: { id: dto.reviewedUserId },
    });

    if (!reviewedUser) {
      throw new NotFoundException('User not found');
    }

    if (userId === dto.reviewedUserId) {
      throw new BadRequestException('You cannot review yourself');
    }

    // Check if review already exists
    const existingReview = await this.prisma.review.findFirst({
      where: {
        reviewerId: userId,
        reviewedUserId: dto.reviewedUserId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You already reviewed this user');
    }

    const review = await this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        reviewerId: userId,
        reviewedUserId: dto.reviewedUserId,
      },
      include: {
        reviewer: {
          select: { id: true, name: true, profilePicture: true },
        },
      },
    });

    // Update average rating
    await this.updateUserRating(dto.reviewedUserId);

    return review;
  }

  async getReviewsForUser(userId: string, skip: number = 0) {
    return this.prisma.review.findMany({
      where: { reviewedUserId: userId },
      include: {
        reviewer: {
          select: { id: true, name: true, profilePicture: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: 20,
    });
  }

  async updateUserRating(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { reviewedUserId: userId },
    });

    if (reviews.length === 0) return;

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await this.prisma.user.update({
      where: { id: userId },
      data: { averageRating },
    });
  }
}
