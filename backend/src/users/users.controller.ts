import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    return this.usersService.getAllUsers(parseInt(skip), parseInt(take));
  }

  @Get('profile/:id')
  async getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @Get(':id/reputation')
  async getUserReputation(@Param('id') id: string) {
    const reviews = await this.usersService.getUserReviews(id);
    const averageRating = await this.usersService.calculateReputationScore(id);
    
    return {
      userId: id,
      averageRating,
      totalReviews: reviews.length,
      reviews,
    };
  }

  @Get(':id/services')
  async getUserServices(
    @Param('id') id: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    return this.usersService.getUserServices(id, parseInt(skip), parseInt(take));
  }

  @Get(':id/requests')
  async getUserRequests(
    @Param('id') id: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    return this.usersService.getUserRequests(id, parseInt(skip), parseInt(take));
  }

  @Get(':id/reviews')
  async getUserReviews(@Param('id') id: string) {
    return this.usersService.getUserReviews(id);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put('profile')
  @UseGuards(JwtGuard)
  async updateProfile(@Request() req, @Body() data: any) {
    return this.usersService.updateProfile(req.user.id, data);
  }
}

