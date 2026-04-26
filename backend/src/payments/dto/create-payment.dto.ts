import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  serviceId?: string; // Optional: link payment to a service
}
