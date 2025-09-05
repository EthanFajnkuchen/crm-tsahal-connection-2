import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateChangeRequestDto {
  @IsNumber()
  leadId: number;

  @IsString()
  fieldChanged: string;

  @IsString()
  oldValue: string;

  @IsString()
  newValue: string;

  @IsString()
  changedBy: string;

  @IsDateString()
  dateModified: string;
}

export class UpdateChangeRequestDto {
  @IsOptional()
  @IsNumber()
  leadId?: number;

  @IsOptional()
  @IsString()
  fieldChanged?: string;

  @IsOptional()
  @IsString()
  oldValue?: string;

  @IsOptional()
  @IsString()
  newValue?: string;

  @IsOptional()
  @IsString()
  changedBy?: string;

  @IsOptional()
  @IsDateString()
  dateModified?: string;
}
