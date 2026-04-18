import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class AiFiltersDto {
  @IsOptional()
  @IsString()
  sector?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class AiSearchResponseDto {
  @ValidateNested()
  @Type(() => AiFiltersDto)
  filters: AiFiltersDto;

  @IsArray()
  @IsString({ each: true })
  similarTerms: string[];

  @IsArray()
  @IsString({ each: true })
  suggestions: string[];

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;
}
