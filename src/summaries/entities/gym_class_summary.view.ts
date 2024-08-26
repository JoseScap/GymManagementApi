import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
    name: 'gym_classes_summaries',
})
export class GymClassSummary {
    @ViewColumn()
    classes_count: number;

    @ViewColumn()
    total: number;

    @ViewColumn()
    createdAt: Date;

    @ViewColumn()
    updatedAt: Date;
}
