import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../api";

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await authApi.getMe();
      } catch (e: any) {
        if (e?.status === 401) return null;
        throw e;
      }
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
