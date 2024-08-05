import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class _000AddTestEntity1722816965214 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "tests",
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
          name: "text",
          type: "varchar",
          isNullable: false,
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
    await queryRunner.dropTable("tests");
  }

}
