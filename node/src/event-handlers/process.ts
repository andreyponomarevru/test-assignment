import util from "util";

export function onWarning(err: Error) {
  console.warn(err.stack);
}

export async function onUncaughtException(err: Error) {
  console.error(`uncaughtException: ${err.message} \n${err.stack}`);
  process.exit(1);
}

export function onUnhandledRejection(reason: string, p: Promise<Error>) {
  console.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
}
