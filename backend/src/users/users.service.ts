import { Injectable } from '@nestjs/common';
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
    });
  }

  async updateProfile(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        bio: true,
        averageRating: true,
      },
    });
  }
}
