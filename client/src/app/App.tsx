import { Toaster } from "react-hot-toast";
import { AppRoutes } from "../routes/AppRoutes";

export const App = () => {

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
    </>
  );
};
