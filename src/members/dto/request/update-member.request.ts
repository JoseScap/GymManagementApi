import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberRequest } from './create-member.request';

export class UpdateMemberRequest extends PartialType(CreateMemberRequest) {}
