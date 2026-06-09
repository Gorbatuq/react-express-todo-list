import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonVariant = "muted" | "danger";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  variant?: IconButtonVariant;
  sizeClassName?: string;
};

export const IconButton = ({
  icon,
  variant = "muted",
  sizeClassName = "h-8 w-8",
  className = "",
  type = "button",
  ...props
}: IconButtonProps) => {
  const variantClass =
    variant === "danger" ? "app-icon-button-danger" : "app-icon-button-muted";

  return (
    <button
      type={type}
      className={`app-icon-button ${variantClass} ${sizeClassName} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
