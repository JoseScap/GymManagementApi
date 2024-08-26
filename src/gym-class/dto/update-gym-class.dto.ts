import { PartialType } from '@nestjs/mapped-types';
import { CreateGymClassDto } from './create-gym-class.dto';

export class UpdateGymClassDto extends PartialType(CreateGymClassDto) {}
