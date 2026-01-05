import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage";
import { TodoPage } from "../pages/TodoPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { WelcomePage } from "../pages/WelcomePage";
import { useMe } from "../hooks/auth/useMe";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";

export const AppRoutes = () => {
  const { data: user, isLoading } = useMe();
  if (isLoading) return <p className="text-center mt-10">Checking login...</p>;

  const isAuth = !!user?.id;
  const entry = isAuth ? "/todo" : "/welcome";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={entry} replace />} />

      <Route
        path="/welcome"
        element={
          <PublicOnlyRoute isAuth={isAuth}>
            <WelcomePage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/auth"
        element={
          <PublicOnlyRoute isAuth={isAuth}>
            <AuthPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/reset-password"
        element={
          <PublicOnlyRoute isAuth={isAuth}>
            <ResetPasswordPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/todo"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <TodoPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
