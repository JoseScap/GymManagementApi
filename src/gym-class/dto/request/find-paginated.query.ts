import { Transform, Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

export class FindPaginatedQuery {
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    page: number

    @IsString()
    @IsOptional()
    className?: string;

    @IsString()
    @IsOptional()
    professor?: string;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    @IsOptional()
    date?: Date;
}