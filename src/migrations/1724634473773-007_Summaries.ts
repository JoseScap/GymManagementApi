import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class _007Summaries1724634473773 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'summaries',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'day',
                    type: 'int',
                },
                {
                    name: 'week',
                    type: 'int',
                },
                {
                    name: 'month',
                    type: 'int',
                },
                {
                    name: 'year',
                    type: 'int',
                },
                {
                    name: 'newMembersCount',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'newMembersIncome',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'newMembersCanceledCount',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'newMembersCanceledIncome',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'renewedMembersCount',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'renewedMembersIncome',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'renewedMembersCanceledCount',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'renewedMembersCanceledIncome',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'gymClassesCount',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'gymClassesIncome',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'gymClassesCanceledCount',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'gymClassesCanceledIncome',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'totalIncome',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'totalCanceled',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'totalAmount',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'isModified',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);

        await queryRunner.createIndex('summaries', new TableIndex({
            name: 'IDX_YEAR_MONTH',
            columnNames: ['year', 'month'],
        }));

        await queryRunner.createIndex('summaries', new TableIndex({
            name: 'IDX_YEAR_WEEK',
            columnNames: ['year', 'week'],
        }));

        await queryRunner.createIndex('summaries', new TableIndex({
            name: 'IDX_YEAR_MONTH_DAY',
            columnNames: ['year', 'month', 'day'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('summaries', 'IDX_YEAR_MONTH');
        await queryRunner.dropIndex('summaries', 'IDX_YEAR_WEEK');
        await queryRunner.dropIndex('summaries', 'IDX_YEAR_MONTH_DAY');

        await queryRunner.dropTable('summaries', true);
    }
}
