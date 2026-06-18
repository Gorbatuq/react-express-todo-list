import type { ReactNode } from "react";

type Props = {
  title: string;
  onBack: () => void;
  children: ReactNode;
};

export const AuthShell = ({ title, onBack, children }: Props) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-cover bg-center px-6 py-8 text-black"
      style={{ backgroundImage: 'url("/back-img-auth.jpg")' }}
    >
      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/10 px-4 py-2 text-sm text-white hover:bg-black/20 transition"
        aria-label="Back"
      >
        <span className="text-lg leading-none">←</span>
        <span>Back</span>
      </button>

      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-center text-2xl font-bold text-slate-800">
          {title}
        </h2>

        {children}
      </div>
    </div>
  );
};
