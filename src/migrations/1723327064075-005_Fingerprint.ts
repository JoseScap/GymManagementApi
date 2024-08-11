import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class _005Fingerprint1723327064075 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'fingerprints',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'fingerTemplate',
                    type: 'text',
                },
                {
                    name: 'memberId',
                    type: "varchar",
                    length: "36",
                }
            ]
        }), true);

        await queryRunner.createForeignKey('fingerprints', new TableForeignKey({
            name: "FK_Fingerprints_MemberId",
            columnNames: ['memberId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'members',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('fingerprints');
        const foreignKey = table.foreignKeys.find(
            index => index.columnNames.includes('memberId')
        );
        await queryRunner.dropForeignKey('fingerprints', foreignKey);
        await queryRunner.dropTable('fingerprints');
    }

}
