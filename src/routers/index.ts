import { Router } from "express";
import dummyRouter from "./dummy.router";

const rootRouter = Router()

rootRouter.use("/dummy", dummyRouter)

export default rootRouter