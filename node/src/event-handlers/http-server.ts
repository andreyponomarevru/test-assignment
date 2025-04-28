import { HTTP_PORT } from "../config/env";

export async function onServerListening(): Promise<void> {
  console.log(
    `${__filename}: API HTTP Server is listening on port ${HTTP_PORT}`,
  );
}

export function onServerError(err: NodeJS.ErrnoException): void | never {
  if (err.syscall !== "listen") throw err;

  const bind =
    typeof HTTP_PORT === "string" ? `Pipe ${HTTP_PORT}` : `Port ${HTTP_PORT}`;

  switch (err.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
}
