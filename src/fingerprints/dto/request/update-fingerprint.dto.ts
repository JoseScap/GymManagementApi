import { PartialType } from '@nestjs/mapped-types';
import { CreateOneRequest } from './create-one.request';

export class UpdateFingerprintDto extends PartialType(CreateOneRequest) {}
