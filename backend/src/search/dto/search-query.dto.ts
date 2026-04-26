import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceCategory, RequestUrgency } from '@prisma/client';

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(ServiceCategory)
  category?: ServiceCategory;

  @IsOptional()
  @IsEnum(RequestUrgency)
  urgency?: RequestUrgency;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minBudget?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxBudget?: number;

  @IsOptional()
  @IsString()
  sortBy?: string; // 'latest', 'price-asc', 'price-desc', 'budget-asc', 'budget-desc'

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;
}
