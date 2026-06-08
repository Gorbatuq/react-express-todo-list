import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../../api";
import type { ApiError } from "../../../api/core/errors";

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await authApi.getMe();
      } catch (e) {
        const err = e as ApiError;
        if (err.status === 401) return null;
        throw err;
      }
    },
    staleTime: 10 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: false,
  });
