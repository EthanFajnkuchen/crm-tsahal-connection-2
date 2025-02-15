import { IsArray, IsObject, IsOptional } from 'class-validator';

export class LeadFilterDto {
  @IsObject()
  included?: Record<string, string[]>;

  @IsObject()
  @IsOptional()
  excluded?: Record<string, string[]>;

  @IsArray()
  fieldsToSend?: string[];
}
