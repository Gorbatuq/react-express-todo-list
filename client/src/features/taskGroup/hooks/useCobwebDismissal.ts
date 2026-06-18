import { useEffect, useState } from "react";

export const useCobwebDismissal = (updatedAt: string) => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsDismissed(false);
  }, [updatedAt]);

  return {
    isDismissed,
    dismiss: () => setIsDismissed(true),
  };
};
