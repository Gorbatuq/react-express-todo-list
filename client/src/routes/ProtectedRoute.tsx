import type { JSX } from "react";
import { Navigate } from "react-router-dom";

type Props = { isAuth: boolean; children: JSX.Element; isLoading: boolean };

export const ProtectedRoute = ({ isAuth, children, isLoading }: Props) => {
  if (isLoading) return null;
  return isAuth ? children : <Navigate to="/" replace />;
};
