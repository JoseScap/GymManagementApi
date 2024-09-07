import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class _015AddLastSubscriptionWithinFingerprint1725732537903 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('fingerprints', new TableColumn({
            name: 'lastSubscription',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP'
        }));

        await queryRunner.manager.createQueryBuilder()
            .update('fingerprints')
            .set({ lastSubscription: () => 'CURRENT_TIMESTAMP' })
            .where('lastSubscription IS NULL')
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('fingerprints', 'lastSubscription');
    }
}
