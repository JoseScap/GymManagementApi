import { Type } from 'class-transformer';
import { IsString, IsNumber, IsDate } from 'class-validator';

export class UpdateGymClassRequest {
    @IsString()
    className?: string;

    @IsString()
    professor?: string;

    @IsNumber()
    total?: number;

    // @IsDate()
    // @Type(() => Date)
    // date?: Date;

    @IsNumber()
    countAssistant?: number;
}
