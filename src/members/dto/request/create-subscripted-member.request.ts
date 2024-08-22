import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty, Length, IsNumber, IsDate, IsBoolean, IsEnum } from 'class-validator';
import { ActiveMemberStatus } from 'src/members/enums/member.enum';
import { PaymentMethod } from 'src/subscriptions/enums/subscription.enum';

export class CreateSubscriptedMemberRequest {
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

    @IsNumber({}, { message: "El campo 'amount' debe ser un número" })
    @IsNotEmpty({ message: "El campo 'amount' no puede estar vacío" })
    amount: number;

    @IsNotEmpty({ message: "El campo 'dateFrom' no puede estar vacío" })
    @IsDate({ message: "El campo 'dateFrom' debe ser una fecha válida" })
    @Type(() => Date)
    dateFrom: Date;

    @IsDate({ message: "El campo 'dateTo' debe ser una fecha válida" })
    @IsNotEmpty({ message: "El campo 'dateTo' no puede estar vacío" })
    @Type(() => Date)
    dateTo: Date;

    @IsEnum(PaymentMethod, { message: "El campo 'paymentMethod' debe ser un valor válido de PaymentMethod" })
    @IsNotEmpty({ message: "El campo 'paymentMethod' no puede estar vacío" })
    paymentMethod: PaymentMethod;

    @IsEnum(ActiveMemberStatus, { message: "El campo 'status' debe ser un valor válido de ActiveMemberStatus" })
    @IsString({ message: "El campo 'status' debe ser una cadena de texto" })
    @IsNotEmpty({ message: "El campo 'status' no puede estar vacío" })
    status: ActiveMemberStatus;

    @IsString({ message: 'El número de teléfono debe ser una cadena de texto.' })
    @IsOptional()
    fingerTemplate?: string;
}
