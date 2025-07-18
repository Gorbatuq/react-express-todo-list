import { FiX } from "react-icons/fi";

export const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="ml-3 bg-red-400 text-white rounded-full w-7 h-7 flex items-center justify-center"
    >
      <FiX />
    </button>
  );
};
