import { Type } from "class-transformer";
import { IsOptional, IsPositive, ValidateIf } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsPositive()
  @ValidateIf(value => value >= 0)
  @Type(() => Number)
  offset: number;
}