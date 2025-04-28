import { db } from "../express-app";

export function moveInArray(from: number, to: number) {
  // Del. from current position
  const item = db.splice(from, 1);

  // Make sure there's an item to move
  if (!item.length) {
    throw new Error(`No item at index ${from}`);
  }

  db.splice(to, 0, item[0]);
}
