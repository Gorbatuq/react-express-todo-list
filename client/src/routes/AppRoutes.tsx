import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage";
import { TodoPage } from "../pages/TodoPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ProtectedRoute } from "./ProtectedRoute";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { useMe } from "../hooks/auth/useMe";

export const AppRoutes = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading) return <p className="text-center mt-10">Checking login...</p>;
  return (
    <Routes>
      <Route
        path="/"
        element={!user ? <AuthPage /> : <Navigate to="/todo" replace />}
      />
      <Route
        path="/reset-password"
        element={
          !user ? <ResetPasswordPage /> : <Navigate to="/todo" replace />
        }
      />
      {/*  */}
      <Route
        path="/todo"
        element={
          <ProtectedRoute isAuth={!!user}>
            <TodoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute isAuth={!!user}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
