import { DataSource } from "typeorm";
import { config } from "dotenv"
config()

export const MigrationDataSource = new DataSource({
  type: process.env.DATABASE_TYPE as 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.GM_DATABASE_USERNAME,
  password: process.env.GM_DATABASE_PASSWORD,
  entities: [],
  migrations: ['./src/migrations/*.ts', './src/seeds/*.ts'],
  synchronize: false
})
