import { Router } from "express";
import { getDummyMessage, getTestData } from "../controllers/dummy.controller";

const dummyRouter = Router()

dummyRouter.get("/message", getDummyMessage)
dummyRouter.get("/test-data", getTestData)

export default dummyRouter