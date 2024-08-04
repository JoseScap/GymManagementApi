import { Router } from "express";
import { getDummyMessage } from "../controllers/dummy.controller";

const dummyRouter = Router()

dummyRouter.get("/message", getDummyMessage)

export default dummyRouter