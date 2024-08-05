import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { MemberStatus } from 'src/members/enums/member.enum';

export class CreateMemberRequest {
    @IsString()
    @IsOptional()
    fullName?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsEnum(MemberStatus)
    @IsOptional()
    currentStatus?: MemberStatus;

    @IsString()
    dni: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
