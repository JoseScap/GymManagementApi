import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class _008ClasesCRUD1724649346560 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "Gym_classes",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        default: "UUID()",
                        isNullable: false,
                    },
                    {
                        name: "className",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "professor",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "total",
                        type: "int",
                    },
                    {
                        name: "date",
                        type: "timestamp",
                    },
                    {
                        name: "isCanceled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "countAssistant",
                        type: "int",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("Gym_classes");
    }
}