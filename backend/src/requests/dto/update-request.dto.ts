import { IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';
import { RequestUrgency } from '@prisma/client';

export class UpdateRequestDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @IsEnum(RequestUrgency)
  @IsOptional()
  urgency?: RequestUrgency;
}
