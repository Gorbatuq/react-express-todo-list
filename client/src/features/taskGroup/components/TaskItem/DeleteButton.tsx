import { FiX } from "react-icons/fi";
import { IconButton } from "../../../../shared/ui/IconButton";

export const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButton
      onClick={onClick}
      aria-label="Delete task"
      className="ml-2"
      icon={<FiX className="text-base" />}
      sizeClassName="h-7 w-7"
      variant="danger"
    />
  );
};
