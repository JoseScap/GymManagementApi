import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class _003AddTimeStamps1723251438564 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("members", [
            new TableColumn({
                name: "createdAt",
                type: "timestamp",
                isNullable: false,
                default: "CURRENT_TIMESTAMP"
            }),
            new TableColumn({
                name: "updatedAt",
                type: "timestamp",
                isNullable: false,
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP"
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("members", ["createdAt", "updatedAt"]);
    }

}