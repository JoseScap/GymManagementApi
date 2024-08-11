import { PartialType } from '@nestjs/mapped-types';
import { CreateOneFingerprintRequest } from './create-one.request';

export class UpdateOneFingerprintRequest extends PartialType(CreateOneFingerprintRequest) {}
