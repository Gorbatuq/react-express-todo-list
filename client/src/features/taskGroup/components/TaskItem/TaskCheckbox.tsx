export const TaskCheckbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => {
  return <input type="checkbox" checked={checked} onChange={onChange} />;
};
