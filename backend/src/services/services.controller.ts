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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getAllServices(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
  ) {
    return this.servicesService.getAllServices(
      parseInt(skip),
      parseInt(take),
    );
  }

  @Get(':id')
  async getService(@Param('id') id: string) {
    return this.servicesService.getServiceById(id);
  }

  @Get('owner/:ownerId')
  async getServicesByOwner(@Param('ownerId') ownerId: string) {
    return this.servicesService.getServicesByOwner(ownerId);
  }

  @Post()
  @UseGuards(JwtGuard)
  async createService(@Request() req, @Body() dto: CreateServiceDto) {
    return this.servicesService.createService(req.user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateService(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.updateService(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteService(@Param('id') id: string, @Request() req) {
    return this.servicesService.deleteService(id, req.user.id);
  }
}
