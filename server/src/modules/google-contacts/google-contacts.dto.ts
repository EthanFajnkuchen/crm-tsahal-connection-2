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

export class GoogleContactWithLeadDto {
  leadId?: number;
  mobilePhone?: string;
  otherPhone?: string;
  resourceName?: string;
}

export class GoogleContactsWithLeadResponseDto {
  success: boolean;
  message: string;
  contacts: GoogleContactWithLeadDto[];
  totalCount: number;
}
