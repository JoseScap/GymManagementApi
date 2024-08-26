import { MigrationInterface, QueryRunner } from "typeorm";

export class _010GymClassSummaries1724711312617 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP VIEW IF EXISTS gym_classes_summaries;`);
        await queryRunner.query(`
CREATE VIEW gym_classes_summaries AS
SELECT COUNT(ggcc.id) AS classes_count, SUM(ggcc.total) AS total, ggcc.createdAt, ggcc.updatedAt FROM gym_classes ggcc
GROUP BY DATE(ggcc.createdAt);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP VIEW IF EXISTS gym_classes_summaries;');
    }

}
