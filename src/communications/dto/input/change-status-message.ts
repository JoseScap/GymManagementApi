import { IsBoolean } from "class-validator";

export class ChangeStatusMessage {
    @IsBoolean()
    value: boolean;
}