import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthMutations } from "../hooks/auth/useAuthMutations";
import { AuthShell } from "../features/auth/components/AuthShell";
import { AuthForm } from "../features/auth/components/AuthForm";
import { ForgotPasswordForm } from "../features/auth/components/ForgotPasswordForm";

export const AuthPage = () => {
  const [mode, setMode] = useState<"auth" | "forgot">("auth");
  const navigate = useNavigate();
  const { login, register, guest, forgotPassword } = useAuthMutations();

  const onBack = () => {
    if (mode === "forgot") {
      setMode("auth");
      return;
    }
    navigate("/welcome", { replace: false });
  };

  return (
    <AuthShell onBack={onBack} title="“It’s Tasking Time!”">
      {mode === "auth" ? (
        <AuthForm
          login={login}
          register={register}
          guest={guest}
          onForgot={() => setMode("forgot")}
        />
      ) : (
        <ForgotPasswordForm
          forgotPassword={forgotPassword}
          onBackToLogin={() => setMode("auth")}
        />
      )}
    </AuthShell>
  );
};
