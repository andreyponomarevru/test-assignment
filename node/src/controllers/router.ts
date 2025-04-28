import express from "express";
import { usersRouter } from "./users/router";

export const apiRouter = express.Router().use("/api", usersRouter);
