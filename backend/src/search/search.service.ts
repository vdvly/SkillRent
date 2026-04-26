import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../config/prisma.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchServices(query: SearchQueryDto) {
    const {
      keyword = '',
      category,
      minPrice,
      maxPrice,
      sortBy = 'latest',
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ServiceWhereInput = {};

    if (keyword) {
      where.OR = [
        {
          title: {
            contains: keyword,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          description: {
            contains: keyword,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: Prisma.ServiceOrderByWithRelationInput = { createdAt: 'desc' };

    if (sortBy === 'price-asc') orderBy = { price: 'asc' };
    if (sortBy === 'price-desc') orderBy = { price: 'desc' };
    if (sortBy === 'latest') orderBy = { createdAt: 'desc' };

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
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
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      data: services,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchRequests(query: SearchQueryDto) {
    const {
      keyword = '',
      urgency,
      minBudget,
      maxBudget,
      sortBy = 'latest',
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ServiceRequestWhereInput = {};

    if (keyword) {
      where.OR = [
        {
          title: {
            contains: keyword,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          description: {
            contains: keyword,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ];
    }

    if (urgency) {
      where.urgency = urgency;
    }

    if (minBudget !== undefined || maxBudget !== undefined) {
      where.budget = {};
      if (minBudget !== undefined) where.budget.gte = minBudget;
      if (maxBudget !== undefined) where.budget.lte = maxBudget;
    }

    let orderBy: Prisma.ServiceRequestOrderByWithRelationInput = {
      createdAt: 'desc',
    };

    if (sortBy === 'budget-asc') orderBy = { budget: 'asc' };
    if (sortBy === 'budget-desc') orderBy = { budget: 'desc' };
    if (sortBy === 'latest') orderBy = { createdAt: 'desc' };

    const [requests, total] = await Promise.all([
      this.prisma.serviceRequest.findMany({
        where,
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
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.serviceRequest.count({ where }),
    ]);

    return {
      data: requests,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchEverything(keyword: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const serviceFilter: Prisma.ServiceWhereInput = {
      OR: [
        {
          title: {
            contains: keyword,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          description: {
            contains: keyword,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    };

    const requestFilter: Prisma.ServiceRequestWhereInput = {
      OR: [
        {
          title: {
            contains: keyword,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          description: {
            contains: keyword,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    };

    const [services, requests] = await Promise.all([
      this.prisma.service.findMany({
        where: serviceFilter,
        include: {
          owner: {
            select: { id: true, name: true, profilePicture: true },
          },
        },
        take: limit,
        skip,
      }),
      this.prisma.serviceRequest.findMany({
        where: requestFilter,
        include: {
          requester: {
            select: { id: true, name: true, profilePicture: true },
          },
        },
        take: limit,
        skip,
      }),
    ]);

    return {
      services,
      requests,
      totalResults: services.length + requests.length,
    };
  }
}
