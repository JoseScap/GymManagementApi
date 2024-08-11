import { IsBoolean } from "class-validator";

export class AppRegisterFingerprint {
    @IsBoolean()
    value: boolean;
}