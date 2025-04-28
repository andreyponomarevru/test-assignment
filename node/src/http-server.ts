import http from "http";
import { onServerError, onServerListening } from "./event-handlers/http-server";
import { expressApp } from "./express-app";

const httpServer = http.createServer(expressApp);
httpServer.on("error", onServerError);
httpServer.on("listening", onServerListening);

export { httpServer };
