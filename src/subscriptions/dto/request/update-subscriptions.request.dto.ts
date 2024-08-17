import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionsDto } from './create-subscriptions.request.dto';

export class UpdateSubscriptionsDto extends PartialType(CreateSubscriptionsDto) {
    // hay q definir q parametros hacer opcional aquí
}
