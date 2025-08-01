import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage";
import { TodoPage } from "../pages/TodoPage";
import { ProfilePage } from "../pages/ProfilePage";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth";

const fetchMe = () => authApi.getMe();

export const AppRoutes = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
    staleTime: 0,
  });

  if (isLoading) {
    return <p className="text-center mt-10">Login check...</p>;
  }

  const isAuth = !!user;

  return (
    <Routes>
      <Route
        path="/"
        element={!isAuth ? <AuthPage /> : <Navigate to="/todo" replace />}
      />
      <Route
        path="/todo"
        element={isAuth ? <TodoPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/profile"
        element={isAuth ? <ProfilePage /> : <Navigate to="/" replace />}
      />
      <Route
        path="*"
        element={<Navigate to={isAuth ? "/todo" : "/"} replace />}
      />
    </Routes>
  );
};
