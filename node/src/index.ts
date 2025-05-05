import { HTTP_PORT } from "./config/env";
import {
  onUncaughtException,
  onUnhandledRejection,
  onWarning,
} from "./event-handlers/process";
import { cachedSearchResult } from "./express-app";
import { httpServer } from "./http-server";

process.once("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);
process.on("warning", onWarning);

httpServer.listen(HTTP_PORT);
httpServer.on("listening", () => {
  console.log(cachedSearchResult);
});
