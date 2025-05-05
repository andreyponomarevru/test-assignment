export type User = {
  id: number;
  username: string;
  isChecked: boolean;
};

export type PatchUsersBody = { oldIndex: number; newIndex: number; q?: string };
