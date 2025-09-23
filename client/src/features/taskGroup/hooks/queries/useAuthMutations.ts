import { authApi } from '@/api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useAuthMutations = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const login = useMutation({
        mutationFn: (data: {email: string; password: string}) =>
            authApi.login(data.email, data.password),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["me"]});
            toast.success("Logged in successfully");
            navigate("/todo");
        },
        onError: () => {
            toast.error("Invalid credentials or server error");
        }
        
    });

    const register = useMutation({
        mutationFn: (data: {email: string; password: string}) =>
            authApi.register(data.email, data.password),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["me"]});
            toast.success("User registered successfully");
            navigate("/todo")
        },
        onError: () => {
            toast.error("User already exist or server problem");
        }
    });

    const guest = useMutation({
        mutationFn: () => authApi.createGuest(),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["me"]});
            toast.success("You are guest...");
            navigate("/todo")
        },
        onError: () => {
            toast.error("Unable to create guest");
        }
    });

    const logout = useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            queryClient.setQueryData(["me"], null);
            toast.success("Logged out successfully");
            navigate("/")
        },
        onError: () => {
            toast.error("Logout failed");
        }
    })

    return { login, register, logout, guest}
}