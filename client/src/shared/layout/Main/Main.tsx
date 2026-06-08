import type { ReactNode } from "react";

export const Main = ({ children }: { children: ReactNode }) => {
  return (
    <main className="mx-auto flex w-full max-w-screen-2xl flex-col items-center px-4 sm:px-6 md:px-8">
      {children}
    </main>
  );
};
