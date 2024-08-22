
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SingleApiResponse } from 'src/types/ApiResponse';

export interface FindOneSubscriptionResponse extends SingleApiResponse<Subscription> { }