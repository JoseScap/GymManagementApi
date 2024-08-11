import { query } from "express";
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class _006SubscriptionStatus1723340742963 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("subscriptions", 
            new TableColumn({
                name: "status",
                type: "boolean",
                default: false
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("subscriptions", "status");
    }

}
