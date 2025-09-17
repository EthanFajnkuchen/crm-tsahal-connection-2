import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  name: string;

  @IsDateString()
  date: string;

  @IsString()
  category: string;
}

export class UpdateActivityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

export class ActivityFilterDto {
  @IsOptional()
  @IsString()
  category?: string;
}
