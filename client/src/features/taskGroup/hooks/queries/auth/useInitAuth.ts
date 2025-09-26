import { authApi } from "@/api/auth";
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react";

export const useInitAuth  = () => {
    const queryClient = useQueryClient();

    // user availability check
    useEffect(() => {
        const init = async () => {
            try {
                await queryClient.fetchQuery({queryKey: ["me"], queryFn: authApi.getMe})
            } catch {
                await authApi.createGuest()
                await queryClient.fetchQuery({queryKey: ["me"], queryFn: authApi.getMe})
            }
        }
        init();
    }, [queryClient])
}