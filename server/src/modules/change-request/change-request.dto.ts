import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateChangeRequestDto {
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
