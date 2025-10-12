import { IsOptional, IsNumber } from 'class-validator';

export class CreateActiviteMassaParticipationDto {
  @IsNumber()
  id_activite_massa: number;

  @IsNumber()
  lead_id: number;
}

export class UpdateActiviteMassaParticipationDto {
  @IsOptional()
  @IsNumber()
  id_activite_massa?: number;

  @IsOptional()
  @IsNumber()
  lead_id?: number;
}

export class ActiviteMassaParticipationFilterDto {
  @IsOptional()
  @IsNumber()
  id_activite_massa?: number;

  @IsOptional()
  @IsNumber()
  lead_id?: number;
}
