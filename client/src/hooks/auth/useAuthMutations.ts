import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../api/core/errors";
import { authApi } from "../../api";

type Credentials = { email: string; password: string };
type ResetPayload = { token: string; newPassword: string };

export const useAuthMutations = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // LOGIN
  const login = useMutation({
    mutationFn: ({ email, password }: Credentials) =>
      authApi.login(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(["me"], user);
      toast.success("Logged in");
      navigate("/todo", { replace: true });
    },
    onError: (err: ApiError) => {
      if (err.status === 401) return toast.error("Invalid credentials");
      toast.error(err.message);
    },
  });

  // REGISTER
  const register = useMutation({
    mutationFn: ({ email, password }: Credentials) =>
      authApi.register(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(["me"], user);
      toast.success("Registered");
      navigate("/todo", { replace: true });
    },
    onError: (err: ApiError) => {
      if (err.status === 409) return toast.error("User already exists");
      toast.error(err.message);
    },
  });

  // MODE GUEST
  const guest = useMutation({
    mutationFn: () => authApi.createGuest(),
    onSuccess: async () => {
      const me = await authApi.getMe();
      queryClient.setQueryData(["me"], me);
      toast.success("Guest session created");
      navigate("/todo", { replace: true });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  // LOGOUT
  const logout = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      toast.success("Logged out");
      navigate("/", { replace: true });
    },
    onError: (err: ApiError) => {
      toast.error(err.message);
    },
  });

  const forgotPassword = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => toast.success("If account exists, email was sent"),
    onError: (err: ApiError) => toast.error(err.message),
  });

  const resetPassword = useMutation({
    mutationFn: ({ token, newPassword }: ResetPayload) =>
      authApi.resetPassword(token, newPassword),
    onSuccess: () => toast.success("Password Update"),
    onError: (err: ApiError) => {
      if (err.status === 400 || err.status === 401)
        return toast.error("Invalid or expired token");
      toast.error(err.message);
    },
  });

  return { login, register, logout, guest, forgotPassword, resetPassword };
};
