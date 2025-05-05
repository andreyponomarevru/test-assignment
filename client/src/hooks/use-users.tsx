import { useInfiniteQuery } from "@tanstack/react-query";
import { API_ROOT_URL } from "../config/env";

export function useGetUsers(searchInput: string) {
  return useInfiniteQuery({
    queryKey: ["users", searchInput],

    queryFn: async ({ pageParam = 1 }) => {
      const currentPage = pageParam;
      let url = `${API_ROOT_URL}/users?page=${currentPage}&pagesize=20`;

      if (searchInput?.trim().length > 0) {
        url = url + `&q=${searchInput}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response error for ${url}}`);
      }

      return response.json();
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return undefined;

      const nextPage = lastPage.pagination.currentPage + 1;
      if (nextPage > lastPage.pagination.totalPages) return undefined;
      else return nextPage;
    },

    refetchOnWindowFocus: false,
  });
}
