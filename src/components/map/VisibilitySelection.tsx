import { VisibilityCategory } from "@/utils/types";

interface VisibilitySelectionProps {
  title: string;
  data: VisibilityCategory;
  setData: (newData: VisibilityCategory) => void;
  onClose: () => void;
  tips?: Record<string, { tip?: string; error?: string; warning?: string }>;
}

const VisibilitySelection: React.FC<VisibilitySelectionProps> = ({ title, data, setData, onClose, tips }) => {
  const handleSelectAll = () => {
    const updated: Record<string, boolean> = { ...data.items };
    for (const k in updated) {
      updated[k] = true;
    }
    setData({ ...data, items: updated });
  };

  const handleDeselectAll = () => {
    const updated = { ...data.items };
    for (const k in updated) {
      updated[k] = false;
    }
    setData({ ...data, items: updated });
  };

  const handleCheckboxChange = (name: string): void => {
    const updated = { ...data.items, [name]: !data.items[name] };
    setData({ ...data, items: updated });
  };

  const setShowLabels = (show: boolean) => {
    setData({ ...data, showLabels: show });
  };
  const setShowPoints = (show: boolean) => {
    setData({ ...data, showPoints: show });
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

      <ul className="grid grid-cols-3 gap-2">
        <li className="flex items-center gap-2">
          <button onClick={handleSelectAll}>
            Select
            <br />
            all
          </button>
        </li>
        <li className="flex items-center gap-2">
          <button onClick={handleDeselectAll}>
            Deselect
            <br />
            all
          </button>
        </li>
        <li className="flex flex-col items-center gap-2">
          <div>
            <input
              type="checkbox"
              onChange={() => setShowLabels(!data.showLabels)}
              checked={data.showLabels}
              className="accent-blue-500"
            />
            <label className="cursor-pointer">Labels</label>
          </div>
          {data.showPoints !== undefined && (
            <div>
              <input
                type="checkbox"
                onChange={() => setShowPoints(!data.showPoints)}
                checked={data.showPoints}
                className="accent-blue-500"
              />
              <label className="cursor-pointer">Points</label>
            </div>
          )}
        </li>
        {Object.entries(data.items).map(([k, v]) => {
          const tipInfo = tips?.[k];
          const tooltip = [tipInfo?.tip, tipInfo?.error, tipInfo?.warning].filter(Boolean).join("\n");
          const className = tipInfo?.error
            ? "text-red-900 dark:text-red-600"
            : tipInfo?.warning
            ? "text-orange-900 dark:text-orange-600"
            : "accent-blue-500";
          return (
            <li key={k} className="flex items-center gap-2">
              <input type="checkbox" onChange={() => handleCheckboxChange(k)} checked={v} />
              <label title={tooltip} className={className}>
                {k}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default VisibilitySelection;
