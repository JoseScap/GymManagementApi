import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";

export class CreateOneFingerprintRequest {
    @IsString({ message: 'La plantilla dactilar debe ser un blob convertida a base64' })
    @IsNotEmpty({ message: 'La plantilla dactilar es obligatoria' })
    fingerTemplate: string;
    
    @IsUUID()
    @IsString()
    @Length(36, 36, { message: 'El Id de miembro debe ser un UUID' })
    memberId: string;
}
