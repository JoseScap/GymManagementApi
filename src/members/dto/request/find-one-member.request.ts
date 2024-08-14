import { IsBoolean, IsOptional } from 'class-validator';

export class FindOneMemberQueryDto {
  @IsBoolean()
  @IsOptional()
  embedSubscriptions?: boolean;
}