import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionsRequest } from './create-subscriptions.request';

export class UpdateSubscriptionsRequest extends PartialType(CreateSubscriptionsRequest) { }
