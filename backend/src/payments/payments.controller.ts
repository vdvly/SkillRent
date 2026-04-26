import { Controller, Get, Post, UseGuards, Request, Body, Param, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createPayment(
    @Request() req,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentsService.createPayment(req.user.id, dto);
  }

  @Get()
  @UseGuards(JwtGuard)
  async getUserPayments(
    @Request() req,
    @Query('skip', ParseIntPipe) skip: number = 0,
    @Query('take', ParseIntPipe) take: number = 50,
  ) {
    return this.paymentsService.getUserPayments(req.user.id, skip, take);
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  async getPaymentById(
    @Request() req,
    @Param('id') paymentId: string,
  ) {
    return this.paymentsService.getPaymentById(paymentId, req.user.id);
  }

  @Get('/stats')
  @UseGuards(JwtGuard)
  async getPaymentStats(@Request() req) {
    return this.paymentsService.getPaymentStats(req.user.id);
  }

  @Get('/platform/stats')
  async getPlatformStats() {
    return this.paymentsService.getPlatformPaymentStats();
  }
}
