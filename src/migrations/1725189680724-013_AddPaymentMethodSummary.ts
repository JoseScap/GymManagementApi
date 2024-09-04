import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class _013AddPaymentMethodSummary1725189680724 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('summaries', [
            // New Members Columns
            new TableColumn({
                name: 'newMembersCashIncome',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),
            new TableColumn({
                name: 'newMembersTransferIncome',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),

            // New Members Canceled Columns
            new TableColumn({
                name: 'newMembersCanceledCashIncome',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),
            new TableColumn({
                name: 'newMembersCanceledTransferIncome',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),

            // Renewed Members Columns
            new TableColumn({
                name: 'renewedMembersCashIncome',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),
            new TableColumn({
                name: 'renewedMembersTransferIncome',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),

            // Renewed Members Canceled Columns
            new TableColumn({
                name: 'renewedMembersCanceledCashIncome',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),
            new TableColumn({
                name: 'renewedMembersCanceledTransferIncome',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),

            // Gym Classes Columns
            new TableColumn({
                name: 'gymClassesCashIncome',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),
            new TableColumn({
                name: 'gymClassesTransferIncome',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),

            // Gym Classes Canceled Columns
            new TableColumn({
                name: 'gymClassesCanceledCashIncome',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),
            new TableColumn({
                name: 'gymClassesCanceledTransferIncome',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),

            // Total Income Columns
            new TableColumn({
                name: 'totalCashIncome',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),
            new TableColumn({
                name: 'totalTransferIncome',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('summaries', [
            'newMembersCashIncome',
            'newMembersTransferIncome',
            'newMembersCanceledCashIncome',
            'newMembersCanceledTransferIncome',
            'renewedMembersCashIncome',
            'renewedMembersTransferIncome',
            'renewedMembersCanceledCashIncome',
            'renewedMembersCanceledTransferIncome',
            'gymClassesCashIncome',
            'gymClassesTransferIncome',
            'gymClassesCanceledCashIncome',
            'gymClassesCanceledTransferIncome',
            'totalCashIncome',
            'totalTransferIncome',
        ]);
    }

}
