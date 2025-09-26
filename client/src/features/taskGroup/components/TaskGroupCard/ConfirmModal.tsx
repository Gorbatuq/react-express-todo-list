interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// group deletion confirmation button //
export const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
      <div className="w-72 rounded-xl bg-white dark:bg-zinc-800 shadow-xl border border-gray-200 dark:border-zinc-700 p-5">
        <p className="text-sm text-gray-700 dark:text-gray-200 mb-4 text-center">
          {message}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
