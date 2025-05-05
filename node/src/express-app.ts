import express from "express";
import cors from "cors";
import { faker } from "@faker-js/faker";
import { HTTP_PORT } from "./config/env";
import { UserRecord } from "./types";
import { handleErrors } from "./middlewares/handle-errors";
import { handle404Error } from "./middlewares/handle-404-error";
import { apiRouter } from "./controllers/router";

// Fake DB
export const dbRecordsTotal = 1000000;
export const db: UserRecord[] = [];
for (let i = 0, username = 1; i < dbRecordsTotal; i++, username++) {
  db.push({
    id: i,
    username: String(username),
    isChecked: false,
  });
}
//
export const cachedSearchResult: { [key: string]: UserRecord[] } = {};

const expressApp = express();
expressApp.set("port", HTTP_PORT);
expressApp.set("trust proxy", 1);
expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use("/", apiRouter);
expressApp.use(handle404Error);
expressApp.use(handleErrors);

export { expressApp };
