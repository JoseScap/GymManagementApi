import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class _001InitMembers1722820925220 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "members",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    length: "36",
                    isPrimary: true,
                    default: `UUID()`,
                    isNullable: false,
                },
                {
                    name: "fullName",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "phoneNumber",
                    type: "varchar",
                    length: "15",
                    isNullable: true,
                },
                {
                    name: "currentStatus",
                    type: "enum",
                    enum: ["Inactivo", "Día", "Semana", "Mes"],
                    default: "'Inactivo'",
                    isNullable: false,
                },
                {
                    name: "dni",
                    type: "varchar",
                    length: "20",
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: "isActive",
                    type: "boolean",
                    default: true,
                    isNullable: false,
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("members");
    }

}
