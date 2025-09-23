import type { JSX } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  isAuth: boolean;
  children: JSX.Element;
};

export const ProtectedRoute = ({ isAuth, children }: Props) => {
  return isAuth ? children : <Navigate to="/" replace />;
};
