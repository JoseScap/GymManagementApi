import { Subscription } from "src/subscriptions/entities/subscription.entity";
import { PaginatedApiResponse } from "src/types/ApiResponse";

export interface FindPaginatedSubscriptionsResponse extends PaginatedApiResponse<Subscription> { }