import type { ReactNode } from "react";

export const Main = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col items-center max-w-7xl mx-auto sm:px-6 md:px-8">
      {children}
    </main>
  );
};
