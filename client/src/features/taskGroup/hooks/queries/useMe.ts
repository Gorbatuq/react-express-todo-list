import { authApi } from "@/api/auth"
import { useQuery } from "@tanstack/react-query"

export const useMe = () => {
    return useQuery({
        queryKey: ["me"], 
        queryFn: authApi.getMe,
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false
    })
}