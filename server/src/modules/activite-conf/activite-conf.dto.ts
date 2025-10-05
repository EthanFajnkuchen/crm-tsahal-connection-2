import {
  IsOptional,
  IsString,
  IsEmail,
  IsBoolean,
  IsNumber,
  IsPhoneNumber,
} from 'class-validator';

export class CreateActiviteConfDto {
  @IsNumber()
  activiteType: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsBoolean()
  isFuturSoldier: boolean;

  @IsString()
  phoneNumber: string;

  @IsEmail()
  mail: string;

  @IsNumber()
  lead_id: number;

  @IsBoolean()
  hasArrived: boolean;
}

export class UpdateActiviteConfDto {
  @IsOptional()
  @IsNumber()
  activiteType?: number;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsBoolean()
  isFuturSoldier?: boolean;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  mail?: string;

  @IsOptional()
  @IsNumber()
  lead_id?: number;

  @IsOptional()
  @IsBoolean()
  hasArrived?: boolean;
}

export class ActiviteConfFilterDto {
  @IsOptional()
  @IsNumber()
  activiteType?: number;

  @IsOptional()
  @IsNumber()
  lead_id?: number;

  @IsOptional()
  @IsBoolean()
  isFuturSoldier?: boolean;

  @IsOptional()
  @IsBoolean()
  hasArrived?: boolean;
}
