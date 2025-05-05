import { useMutation } from "@tanstack/react-query";
import { API_ROOT_URL } from "../config/env";
import { PatchUsersBody } from "../types";

export function usePatchUsers() {
  return useMutation({
    mutationFn: (body: PatchUsersBody) => {
      return fetch(`${API_ROOT_URL}/users`, {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({ position: body }),
      });
    },
  });
}
