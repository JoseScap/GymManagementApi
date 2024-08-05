import { IsString, IsOptional, IsNotEmpty, Length } from 'class-validator';

export class CreateMemberRequest {
    @IsString({ message: 'El nombre completo debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre completo es obligatorio.' })
    @Length(1, 255, { message: 'El nombre completo debe tener entre 1 y 255 caracteres.' })
    fullName: string;

    @IsString({ message: 'El número de teléfono debe ser una cadena de texto.' })
    @IsOptional()
    @Length(7, 15, { message: 'Si se proporciona, el número de teléfono debe tener entre 7 y 15 caracteres.' })
    phoneNumber?: string;

    @IsString({ message: 'El DNI debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El DNI es obligatorio.' })
    @Length(1, 20, { message: 'El DNI debe tener entre 1 y 20 caracteres.' })
    dni: string;
}
