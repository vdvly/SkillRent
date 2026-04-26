import { IsString, IsOptional } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  action: string; // created_service, sent_message, posted_request, left_review, made_payment, etc.

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  resourceId?: string; // ID of the related resource
}
