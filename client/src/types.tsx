export type User = {
  id: number;
  username: string;
  isChecked: boolean;
};

export type PatchUsersBody =
  | {
      indexPosition: { oldIndex: number; newIndex: number };
    }
  | { idPosition: { itemId: number; moveAfterId: number } };
