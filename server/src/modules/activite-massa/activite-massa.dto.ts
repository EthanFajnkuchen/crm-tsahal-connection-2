import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateActiviteMassaDto {
  @IsNumber()
  id_activite_type: number;

  @IsString()
  programName: string;

  @IsString()
  programYear: string;
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
}

export class ActiviteMassaFilterDto {
  @IsOptional()
  @IsNumber()
  id_activite_type?: number;

  @IsOptional()
  @IsString()
  programYear?: string;
}
