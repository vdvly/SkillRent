import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaService } from '../config/prisma.service';
import { ActivityService } from '../activity/activity.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, ActivityService],
})
export class PaymentsModule {}
