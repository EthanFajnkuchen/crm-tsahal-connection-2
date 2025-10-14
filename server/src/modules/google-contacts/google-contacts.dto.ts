import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateGoogleContactDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsNumber()
  leadId: number;

  @IsOptional()
  @IsString()
  email?: string;
}

export class GoogleContactResponseDto {
  success: boolean;
  message: string;
  contactId?: string;
  resourceName?: string;
}

