import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';

export class CreateActiviteMassaDto {
  @IsNumber()
  id_activite_type: number;

  @IsString()
  programName: string;

  @IsString()
  programYear: string;

  @IsDate()
  date: Date;
}

export class UpdateActiviteMassaDto {
  @IsOptional()
  @IsNumber()
  id_activite_type?: number;

  @IsOptional()
  @IsString()
  programName?: string;

  @IsOptional()
  @IsString()
  programYear?: string;

  @IsOptional()
  @IsDate()
  date?: Date;
}

export class ActiviteMassaFilterDto {
  @IsOptional()
  @IsNumber()
  id_activite_type?: number;

  @IsOptional()
  @IsString()
  programYear?: string;

  @IsOptional()
  @IsDate()
  date?: Date;
}
