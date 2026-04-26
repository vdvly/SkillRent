import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
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

    // Check if review already exists - using unique constraint from schema
    const existingReview = await this.prisma.review.findUnique({
      where: {
        reviewerId_reviewedUserId: {
          reviewerId: userId,
          reviewedUserId: dto.reviewedUserId,
        },
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
        reviewedUser: {
          select: { id: true, name: true },
        },
      },
    });

    // Update average rating
    await this.updateUserRating(dto.reviewedUserId);

    return review;
  }

  async getReviewsForUser(userId: string, skip: number = 0, take: number = 20) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.review.findMany({
      where: { reviewedUserId: userId },
      include: {
        reviewer: {
          select: { id: true, name: true, profilePicture: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async getReviewsByUser(userId: string, skip: number = 0, take: number = 20) {
    // Get reviews given by a user
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.review.findMany({
      where: { reviewerId: userId },
      include: {
        reviewedUser: {
          select: { id: true, name: true, profilePicture: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async getReviewStats(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { reviewedUserId: userId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    reviews.forEach((review) => {
      totalRating += review.rating;
      ratingDistribution[review.rating]++;
    });

    const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

    return {
      totalReviews: reviews.length,
      averageRating,
      ratingDistribution,
    };
  }

  async getReviewById(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        reviewer: {
          select: { id: true, name: true, profilePicture: true },
        },
        reviewedUser: {
          select: { id: true, name: true, profilePicture: true },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async updateReview(
    reviewId: string,
    userId: string,
    data: { rating?: number; comment?: string },
  ) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.reviewerId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating ?? review.rating,
        comment: data.comment ?? review.comment,
      },
      include: {
        reviewer: {
          select: { id: true, name: true, profilePicture: true },
        },
        reviewedUser: {
          select: { id: true, name: true },
        },
      },
    });

    // Update average rating
    await this.updateUserRating(review.reviewedUserId);

    return updatedReview;
  }

  async deleteReview(reviewId: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.reviewerId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const deletedReview = await this.prisma.review.delete({
      where: { id: reviewId },
    });

    // Update average rating
    await this.updateUserRating(review.reviewedUserId);

    return deletedReview;
  }

  private async updateUserRating(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { reviewedUserId: userId },
    });

    if (reviews.length === 0) {
      // No reviews, set rating to 0
      await this.prisma.user.update({
        where: { id: userId },
        data: { averageRating: 0 },
      });
      return;
    }

    const averageRating =
      Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10;

    await this.prisma.user.update({
      where: { id: userId },
      data: { averageRating },
    });
  }
}
