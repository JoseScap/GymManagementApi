import { MigrationInterface, QueryRunner } from "typeorm";

export class _011UpdateSubSummary1724921891528 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP VIEW IF EXISTS subscription_summaries;`);
        await queryRunner.query(`
CREATE VIEW subscription_summaries AS
SELECT 
    ss.id,
    ss.memberId,
    ss.createdAt,
    ss.updatedAt,
    ss.amount,
    ss.paymentMethod,
    ss.isCanceled,
    COALESCE(prev_subscriptions.previous_count, 0) AS previous_count
FROM 
    subscriptions ss
LEFT JOIN (
    SELECT 
        memberId,
        COUNT(*) AS previous_count
    FROM 
        subscriptions
    GROUP BY 
        memberId
) AS prev_subscriptions
ON ss.memberId = prev_subscriptions.memberId;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP VIEW IF EXISTS subscription_summaries;');
    }

}
