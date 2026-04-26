import { IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';
import { ServiceCategory } from '@prisma/client';

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsEnum(ServiceCategory)
  @IsOptional()
  category?: ServiceCategory;
}
