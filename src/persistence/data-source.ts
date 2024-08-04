import "reflect-metadata"
import { DataSource } from "typeorm"
import { Test } from "../entities/Test"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "test",
    synchronize: false,
    logging: true,
    entities: [Test],
    migrations: ["./**/**/migrations/*.ts"]
})
