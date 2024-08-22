import { IsByteLength, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";
import { PaymentMethod } from "src/subscriptions/enums/subscription.enum";
import { ActiveMemberStatus } from "src/members/enums/member.enum";

export class CreateSubscriptionsRequest {
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

    @IsString({ message: "El campo 'memberId' debe ser una cadena de texto" })
    @IsNotEmpty({ message: "El campo 'memberId' no puede estar vacío" })
    @IsByteLength(36, 36, { message: "El campo 'memberId' debe tener una longitud de 36 caracteres" })
    memberId: string;
}
