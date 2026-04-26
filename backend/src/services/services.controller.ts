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
import { ServiceCategory } from '@prisma/client';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getAllServices(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
    @Query('category') category?: ServiceCategory,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('search') search?: string,
  ) {
    return this.servicesService.getAllServices(
      parseInt(skip),
      parseInt(take),
      category,
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined,
      search,
    );
  }

  @Get('category/:category')
  async getServicesByCategory(
    @Param('category') category: ServiceCategory,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
  ) {
    return this.servicesService.getServicesByCategory(
      category,
      parseInt(skip),
      parseInt(take),
    );
  }

  @Get(':id')
  async getService(@Param('id') id: string) {
    return this.servicesService.getServiceById(id);
  }

  @Get('owner/:ownerId')
  async getServicesByOwner(
    @Param('ownerId') ownerId: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    return this.servicesService.getServicesByOwner(ownerId, parseInt(skip), parseInt(take));
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
