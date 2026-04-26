import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('api/recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getRecommendations(
    @Request() req,
    @Param('limit') limit: number = 10,
  ) {
    return this.recommendationsService.getRecommendationsForUser(
      req.user.id,
      limit,
    );
  }

  @Get('/requests')
  @UseGuards(JwtGuard)
  async getRecommendedRequests(
    @Request() req,
    @Param('limit') limit: number = 10,
  ) {
    return this.recommendationsService.getRecommendedRequests(
      req.user.id,
      limit,
    );
  }

  @Get('/trending')
  async getTrendingServices(@Param('limit') limit: number = 10) {
    return this.recommendationsService.getTrendingServices(limit);
  }
}
