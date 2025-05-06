import { db } from "../express-app";

export function moveInArray<T>(from: number, to: number) {
  // Del. from current position
  const item = db.splice(from, 1);

  // Make sure there's an item to move
  if (!item.length) {
    throw new Error(`No item at index ${from}`);
  }

  db.splice(to, 0, item[0]);
}

export function moveInArrayById(itemId: number, moveAfterId: number) {
  const to = db.findIndex((obj) => obj.id === moveAfterId);
  const from = db.findIndex((o) => o.id === itemId);

  if (from < 0) {
    throw new Error(`No item with id ${itemId}`);
  }

  moveInArray(from, to);
}
