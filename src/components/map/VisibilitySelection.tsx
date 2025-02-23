interface VisibilitySelectionProps {
  title: string;
  data: Record<string, boolean>;
  setData: (newData: Record<string, boolean>) => void;
  onClose: () => void;
}

const VisibilitySelection: React.FC<VisibilitySelectionProps> = ({
  title,
  data,
  setData,
  onClose,
}) => {
  const handleSelectAll = () => {
    const updated: Record<string, boolean> = { ...data };
    for (const k in updated) {
      updated[k] = true;
    }
    setData(updated);
  };

  const handleDeselectAll = () => {
    const updated = { ...data };
    for (const k in updated) {
      updated[k] = false;
    }
    setData(updated);
  };

  const handleCheckboxChange = (name: string): void => {
    const updated = { ...data, [name]: !data[name] };
    setData(updated);
  };

  return (
    <div className="absolute left-full top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg p-4 z-50 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        ✕
      </button>
      <div className="flex justify-evenly text-sm mb-2">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleSelectAll();
          }}
          className=" hover:underline"
        >
          Select all
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleDeselectAll();
          }}
          className="hover:underline"
        >
          Deselect all
        </a>
      </div>
      <ul className="grid grid-cols-3 gap-2">
        {Object.entries(data).map(([k, v]) => (
          <li key={k} className="flex items-center gap-2">
            <input
              type="checkbox"
              onChange={() => handleCheckboxChange(k)}
              checked={v}
              className="accent-blue-500"
            />
            <label>{k}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VisibilitySelection;
