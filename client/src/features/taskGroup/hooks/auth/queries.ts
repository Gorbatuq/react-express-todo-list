// src/hooks/auth/queries.ts
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { qk } from "../queryKeys";

export const useMe = () =>
  useQuery({
    queryKey: qk.me,
    queryFn: authApi.getMe, // за бажанням уніфікуй через safeRequest
    retry: false,
    staleTime: 0,
  });
