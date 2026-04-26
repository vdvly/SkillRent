import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.warn('Prisma connection skipped during startup:', error instanceof Error ? error.message : error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
