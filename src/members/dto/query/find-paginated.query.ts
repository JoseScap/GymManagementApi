import { IsEnum, IsBooleanString, IsOptional, IsInt, Min, IsNotEmpty } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { MemberStatus } from 'src/members/enums/member.enum';

export class FindPaginatedMemberQuery {
  @IsOptional()
  @IsInt({ message: 'El valor de "page" debe ser un número entero' })
  @Type(() => Number)
  @Min(1, { message: 'El valor de "page" debe ser al menos 1' })
  page?: number;

  @IsNotEmpty()
  @IsBooleanString({ message: 'El valor de "embedSubscriptions" debe ser un booleano (true o false)' })
  embedSubscriptions: string;

  @IsOptional()
  @IsEnum(MemberStatus, { message: 'El estado debe ser un valor válido: Inactivo, Día, Semana, Mes' })
  currentStatus?: MemberStatus;
}
