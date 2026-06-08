import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage";
import { TodoPage } from "../pages/TodoPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { WelcomePage } from "../pages/WelcomePage";
import { useMe } from "../features/auth/hooks/useMe";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/5 backdrop-blur-sm">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
    </div>
  );
}

export const AppRoutes = () => {
  const { data: user, isLoading } = useMe();

  const isAuth = !!user?.id;
  const entry = isAuth ? "/todo" : "/welcome";

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={entry} replace />} />

        <Route
          path="/welcome"
          element={
            <PublicOnlyRoute isAuth={isAuth} isLoading={isLoading}>
              <WelcomePage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/auth"
          element={
            <PublicOnlyRoute isAuth={isAuth} isLoading={isLoading}>
              <AuthPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicOnlyRoute isAuth={isAuth} isLoading={isLoading}>
              <ResetPasswordPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/todo"
          element={
            <ProtectedRoute isAuth={isAuth} isLoading={isLoading}>
              <TodoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuth={isAuth} isLoading={isLoading}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {isLoading && <LoadingOverlay />}
    </>
  );
};
