import { useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

type Props = {
  registration: UseFormRegisterReturn;
  error?: FieldError;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
};

export const FormField = ({
  registration,
  error,
  type = "text",
  placeholder,
  autoComplete,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          {...registration}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-md border px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </button>
        )}
      </div>

      {error?.message && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};
