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
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { RequestUrgency } from '@prisma/client';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  async getAllRequests(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
    @Query('urgency') urgency?: RequestUrgency,
    @Query('minBudget') minBudget?: string,
    @Query('maxBudget') maxBudget?: string,
    @Query('search') search?: string,
  ) {
    return this.requestsService.getAllRequests(
      parseInt(skip),
      parseInt(take),
      urgency,
      minBudget ? parseFloat(minBudget) : undefined,
      maxBudget ? parseFloat(maxBudget) : undefined,
      search,
    );
  }

  @Get('urgency/:urgency')
  async getRequestsByUrgency(
    @Param('urgency') urgency: RequestUrgency,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
  ) {
    return this.requestsService.getRequestsByUrgency(
      urgency,
      parseInt(skip),
      parseInt(take),
    );
  }

  @Get('requester/:requesterId')
  async getRequestsByRequester(
    @Param('requesterId') requesterId: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    return this.requestsService.getRequestsByRequester(
      requesterId,
      parseInt(skip),
      parseInt(take),
    );
  }

  @Get(':id')
  async getRequest(@Param('id') id: string) {
    return this.requestsService.getRequestById(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  async createRequest(@Request() req, @Body() dto: CreateRequestDto) {
    return this.requestsService.createRequest(req.user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateRequest(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateRequestDto,
  ) {
    return this.requestsService.updateRequest(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteRequest(@Param('id') id: string, @Request() req) {
    return this.requestsService.deleteRequest(id, req.user.id);
  }
}
