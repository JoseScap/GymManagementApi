import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class _004Subscription1723257367415 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "subscriptions",
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
                        name: "amount",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: "dateFrom",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                    {
                        name: "dateTo",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                    {
                        name: "isCanceled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "paymentMethod",
                        type: "enum",
                        enum: ["Efectivo", "Transferencia"],
                        default: "'Efectivo'",
                        isNullable: false,
                    },
                    {
                        name: "memberId",
                        type: "varchar",
                        length: "36",
                        isNullable: false,
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
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "subscriptions",
            new TableForeignKey({
                name: "FK_Subscriptions_MemberId",
                columnNames: ["memberId"],
                referencedColumnNames: ["id"],
                referencedTableName: "members",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("subscriptions");
        const foreignKey = table.foreignKeys.find(
            fk => fk.columnNames.indexOf("memberId") !== -1
        );
        await queryRunner.dropForeignKey("subscriptions", foreignKey);
        await queryRunner.dropTable("subscriptions");
    }
}
