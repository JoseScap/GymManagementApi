import { DataSource } from "typeorm";

export const MigrationDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'test',
  entities: [],
  migrations: ['./src/migrations/*.ts'],
  synchronize: false
})