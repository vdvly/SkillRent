import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createReview(@Request() req, @Body() dto: CreateReviewDto) {
    return this.reviewsService.createReview(req.user.id, dto);
  }

  @Get(':userId')
  async getReviewsForUser(
    @Param('userId') userId: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
  ) {
    return this.reviewsService.getReviewsForUser(
      userId,
      parseInt(skip),
      parseInt(take),
    );
  }

  @Get(':userId/stats')
  async getReviewStats(@Param('userId') userId: string) {
    return this.reviewsService.getReviewStats(userId);
  }

  @Get('user/:userId')
  @UseGuards(JwtGuard)
  async getReviewsByUser(
    @Param('userId') userId: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
  ) {
    return this.reviewsService.getReviewsByUser(
      userId,
      parseInt(skip),
      parseInt(take),
    );
  }

  @Get('review/:reviewId')
  async getReviewById(@Param('reviewId') reviewId: string) {
    return this.reviewsService.getReviewById(reviewId);
  }

  @Put(':reviewId')
  @UseGuards(JwtGuard)
  async updateReview(
    @Request() req,
    @Param('reviewId') reviewId: string,
    @Body() data: { rating?: number; comment?: string },
  ) {
    return this.reviewsService.updateReview(reviewId, req.user.id, data);
  }

  @Delete(':reviewId')
  @UseGuards(JwtGuard)
  async deleteReview(@Request() req, @Param('reviewId') reviewId: string) {
    return this.reviewsService.deleteReview(reviewId, req.user.id);
  }
}
