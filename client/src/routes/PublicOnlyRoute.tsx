import type { JSX } from "react";
import { Navigate } from "react-router-dom";

type Props = { isAuth: boolean; children: JSX.Element };

export const PublicOnlyRoute = ({ isAuth, children }: Props) => {
  return isAuth ? <Navigate to="/todo" replace /> : children;
};
