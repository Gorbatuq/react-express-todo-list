import { Toaster } from "react-hot-toast";
import { AppRoutes } from "../routes/AppRoutes";
import { useInitAuth } from "../features/taskGroup/hooks/queries/auth/useInitAuth";

export const App = () => {
  useInitAuth();

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
    </>
  );
};
