import { Transform, Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export class FindPaginatedQuery {
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    page: number
    
    @IsString()
    @IsOptional()
    fullname?: string;

    @IsString()
    @IsOptional()
    dni?: string;   

    @IsDate()
    @Transform(({ value }) => new Date(value))
    @IsOptional()
    dateFrom?: Date;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    @IsOptional()
    dateTo?: Date;
}