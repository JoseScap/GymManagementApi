import { Type } from 'class-transformer';
import { IsString, IsNumber, IsDate, isNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateGymClassRequest {
    @IsString()
    @IsNotEmpty({ message: "El campo 'className' no puede estar vacío" })
    className: string;

    @IsString()
    @IsNotEmpty({ message: "El campo 'professor' no puede estar vacío" })
    professor: string;

    @IsNumber()
    @IsNotEmpty({ message: "El campo 'total' no puede estar vacío" }) 
    total: number;

    @IsNotEmpty({ message: "El campo 'date' no puede estar vacío" })
    @IsDate()
    @Type(() => Date)
    date: Date;

    @IsNotEmpty({ message: "El campo 'countAssistant' no puede estar vacío" })
    @IsNumber()
    countAssistant: number;
}