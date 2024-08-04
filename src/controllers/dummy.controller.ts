import { Request, Response } from "express";

const getDummyMessage = (req: Request, res: Response) => {
    res.json({ message: "Hello" })
}

export {
    getDummyMessage
}