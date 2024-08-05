import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class _002DniIsNonUnique1722830632453 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('members');
        const index = table.indices.find(
            index => index.columnNames.includes('dni')
        );
        if (index) {
            await queryRunner.dropIndex('members', index);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createIndex(
            'members',
            new TableIndex({
                name: 'UQ_members_dni',
                columnNames: ['dni']
            })
        );
    }
}
