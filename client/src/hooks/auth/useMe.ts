import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../api/auth";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: authApi.getMe,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
