import { Controller, Get, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { ActivityService } from './activity.service';

@Controller('api/activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  async getActivity(
    @Query('skip', ParseIntPipe) skip: number = 0,
    @Query('take', ParseIntPipe) take: number = 50,
  ) {
    return this.activityService.getRecentActivity(take);
  }

  @Get('/user')
  @UseGuards(JwtGuard)
  async getUserActivity(
    @Request() req,
    @Query('skip', ParseIntPipe) skip: number = 0,
    @Query('take', ParseIntPipe) take: number = 50,
  ) {
    return this.activityService.getUserActivity(req.user.id, skip, take);
  }

  @Get('/user/stats')
  @UseGuards(JwtGuard)
  async getActivityStats(@Request() req) {
    return this.activityService.getActivityStats(req.user.id);
  }

  @Get('/platform/stats')
  async getPlatformStats() {
    return this.activityService.getPlatformStats();
  }
}