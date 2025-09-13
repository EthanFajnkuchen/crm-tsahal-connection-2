import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateDiscussionDto {
  @IsNumber()
  id_lead: number;

  @IsDateString()
  date_discussion: string;

  @IsString()
  contenu: string;

  @IsString()
  created_by: string;
}

export class UpdateDiscussionDto {
  @IsOptional()
  @IsNumber()
  id_lead?: number;

  @IsOptional()
  @IsDateString()
  date_discussion?: string;

  @IsOptional()
  @IsString()
  contenu?: string;
}
