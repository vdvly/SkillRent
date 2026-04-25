import { IsNumber, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  reviewedUserId: string;
}
