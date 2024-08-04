import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class _001InitApi1722755320097 implements MigrationInterface {
  name = '001InitApi1722755320097'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "test",
      columns: [
        {
          name: "id",
          type: "char",
          length: "36",
          isPrimary: true,
          generationStrategy: "uuid",
          default: `UUID()`
        },
        {
          name: "firstName",
          type: "varchar",
          isNullable: false
        },
        {
          name: "lastName",
          type: "varchar",
          isNullable: false
        },
        {
          name: "age",
          type: "int",
          isNullable: false
        },
        {
          name: "email",
          type: "varchar",
          isNullable: true
        },
        {
          name: "createdAt",
          type: "timestamp",
          default: "CURRENT_TIMESTAMP"
        },
        {
          name: "updatedAt",
          type: "timestamp",
          default: "CURRENT_TIMESTAMP",
          onUpdate: "CURRENT_TIMESTAMP"
        }
      ]
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("test");
  }
}
