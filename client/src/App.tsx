import { useInitAuth } from "./features/taskGroup/hooks/queries/auth/useInitAuth";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

export const App = () => {
  useInitAuth();

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />
    </>
  );
};
