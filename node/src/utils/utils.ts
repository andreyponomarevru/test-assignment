export function moveInArray<T>(arr: T[], from: number, to: number) {
  // Del. from current position
  const item = arr.splice(from, 1);

  // Make sure there's an item to move
  if (!item.length) {
    throw new Error(`No item at index ${from}`);
  }

  arr.splice(to, 0, item[0]);
}
