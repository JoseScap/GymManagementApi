import { ViewEntity, ViewColumn } from 'typeorm';
import { PaymentMethod } from '../../subscriptions/enums/subscription.enum';

@ViewEntity({
    name: 'subscription_summaries',
})
export class SubscriptionSummary {
    @ViewColumn()
    id: string;

    @ViewColumn()
    memberId: string;

    @ViewColumn()
    createdAt: Date;

    @ViewColumn()
    updatedAt: Date;

    @ViewColumn()
    amount: number;

    @ViewColumn()
    isCanceled: boolean;

    @ViewColumn()
    paymentMethod: PaymentMethod;

    @ViewColumn({ name: 'previous_count' })
    previousCount: number;
}
