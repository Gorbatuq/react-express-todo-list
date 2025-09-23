import { FiX } from "react-icons/fi";

export const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-red-400 flex items-center justify-center"
    >
      <FiX />
    </button>
  );
};
