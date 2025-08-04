import { AppRoutes } from "./routes";
import { Toaster } from "react-hot-toast";

export const App = () => {
  return (
    <>
      {" "}
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />
    </>
  );
};
