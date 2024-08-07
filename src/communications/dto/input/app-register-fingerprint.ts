import { IsBoolean } from "class-validator";

export class AppRegisterFingerprint {
    @IsBoolean()
    status: boolean;
}