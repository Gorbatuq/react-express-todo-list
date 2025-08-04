import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage";
import { TodoPage } from "../pages/TodoPage";
import { ProfilePage } from "../pages/ProfilePage";
import { useAuthStore } from "@/store/authStore";

export const AppRoutes = () => {
  const { user, isGuest, isAuth, loading, init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  if (loading)
    return <p className="text-center mt-10">Kontrola přihlášení...</p>;

  return (
    <Routes>
      <Route
        path="/"
        element={!user ? <AuthPage /> : <Navigate to="/todo" replace />}
      />
      <Route
        path="/todo"
        element={user ? <TodoPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/profile"
        element={user ? <ProfilePage /> : <Navigate to="/" replace />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/todo" : "/"} replace />}
      />
    </Routes>
  );
};
