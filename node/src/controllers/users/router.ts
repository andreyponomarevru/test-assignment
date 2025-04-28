import express from "express";
import { patchUsers, readUsers } from "./controller";

export const usersRouter = express.Router();

usersRouter.get("/users", readUsers);
usersRouter.patch("/users", patchUsers);
