interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
export const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => (
  <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded shadow-md">
    <div className="p-4 border rounded bg-white">
      <p className="mb-4 text-center">{message}</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);
