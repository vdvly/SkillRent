import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
  ) {}

  async createPayment(userId: string, dto: CreatePaymentDto) {
    // Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate amount
    if (dto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // Create payment with pending status
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        amount: dto.amount,
        currency: dto.currency || 'USD',
        status: 'pending',
        description: dto.description,
        serviceId: dto.serviceId,
      },
    });

    // Log activity
    await this.activityService.logActivity(userId, {
      action: 'made_payment',
      description: `Payment of ${dto.amount} ${dto.currency || 'USD'} created`,
      resourceId: payment.id,
    });

    // Simulate payment processing (mock implementation)
    // In production, this would integrate with Stripe/PayPal
    const processedPayment = await this.processPaymentMock(payment.id);

    return processedPayment;
  }

  private async processPaymentMock(paymentId: string) {
    // Mock 90% success rate
    const isSuccess = Math.random() > 0.1;

    const status = isSuccess ? 'completed' : 'failed';

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: { status, updatedAt: new Date() },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async getUserPayments(userId: string, skip: number = 0, take: number = 50) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      this.prisma.payment.count({ where: { userId } }),
    ]);

    return {
      data: payments,
      total,
      skip,
      take,
    };
  }

  async getPaymentById(paymentId: string, userId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify ownership
    if (payment.userId !== userId) {
      throw new BadRequestException(
        'You do not have permission to view this payment',
      );
    }

    return payment;
  }

  async getPaymentStats(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { userId },
      select: { amount: true, status: true },
    });

    const stats = {
      totalPayments: payments.length,
      totalSpent: payments
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0),
      completedPayments: payments.filter((p) => p.status === 'completed').length,
      failedPayments: payments.filter((p) => p.status === 'failed').length,
      pendingPayments: payments.filter((p) => p.status === 'pending').length,
    };

    return stats;
  }

  async getPlatformPaymentStats() {
    const payments = await this.prisma.payment.findMany({
      select: { amount: true, status: true },
    });

    const stats = {
      totalTransactions: payments.length,
      totalVolume: payments
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0),
      successRate:
        payments.length > 0
          ? (payments.filter((p) => p.status === 'completed').length /
              payments.length) *
            100
          : 0,
      breakdown: {
        completed: payments.filter((p) => p.status === 'completed').length,
        failed: payments.filter((p) => p.status === 'failed').length,
        pending: payments.filter((p) => p.status === 'pending').length,
      },
    };

    return stats;
  }
}
