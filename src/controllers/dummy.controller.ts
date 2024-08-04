import { Request, Response } from "express";
import { AppDataSource } from "../persistence/data-source";
import { Test } from "../entities/Test";

const getDummyMessage = (req: Request, res: Response) => {
    res.json({ message: "Hello" })
}

const getTestData = async  (req: Request, res: Response) => {
    let rows = await AppDataSource.getRepository(Test).find()
    res.json({ data: rows })
}

export {
    getDummyMessage,
    getTestData
}