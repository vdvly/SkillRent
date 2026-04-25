import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

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
}
