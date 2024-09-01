import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class _014AddTransferTotalForGymClass1725191459144 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('gym_classes', new TableColumn({
            name: 'transferTotal',
            type: 'int',
            isNullable: false,
            default: 0,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('gym_classes', 'transferTotal');
    }

}
