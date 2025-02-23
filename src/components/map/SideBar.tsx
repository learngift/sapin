import { useState } from "react";

interface Visibility {
  airways: Record<string, boolean>; // Dictionnaire des airways cochés
}

interface SidebarProps {
  visibility: Visibility;
  updateVisibility: (newVisibility: Visibility) => void;
}

const SideBar: React.FC<SidebarProps> = ({ visibility, updateVisibility }) => {
  const [selectedAirways, setSelectedAirways] = useState<
    Record<string, boolean>
  >(visibility.airways);
  const [isAirwaysDialogOpen, setIsAirwaysDialogOpen] =
    useState<boolean>(false);

  const handleOpenAirwaysDialog = () => setIsAirwaysDialogOpen(true);
  const handleCloseAirwaysDialog = () => setIsAirwaysDialogOpen(false);

  const handleSelectAll = () => {
    const updated: Record<string, boolean> = { ...selectedAirways };
    for (const k in updated) {
      updated[k] = true;
    }
    setSelectedAirways(updated);
    updateVisibility({ ...visibility, airways: updated });
  };

  const handleDeselectAll = () => {
    const updated = { ...selectedAirways };
    for (const k in updated) {
      updated[k] = false;
    }
    setSelectedAirways(updated);
    updateVisibility({ ...visibility, airways: updated });
  };

  const handleCheckboxChange = (name: string): void => {
    const updated = { ...selectedAirways, [name]: !selectedAirways[name] };
    setSelectedAirways(updated);
    updateVisibility({ ...visibility, airways: updated });
  };

  return (
    <>
      <ul className="space-y-2">
        <li>
          <button>Nav Points</button>
        </li>
        <li>
          <button>Outl Points</button>
        </li>
        <li>
          <button>Airports</button>
        </li>
        <li>
          <button onClick={handleOpenAirwaysDialog}>Airways</button>
        </li>
        <li>
          <button>SIDs</button>
        </li>
        <li>
          <button>STARs</button>
        </li>
        <li>
          <button>Runways</button>
        </li>
        <li>
          <button>Sectors</button>
        </li>
        <li>
          <button>Volumes</button>
        </li>
        <li>
          <button>Flights</button>
        </li>
        <li>
          <button>Holes & Overlaps</button>
        </li>
        <li>
          <button>Play</button>
        </li>
      </ul>
      {isAirwaysDialogOpen && (
        <div className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg p-4 z-50 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Airways</h3>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSelectAll}
          >
            Select All
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleDeselectAll}
          >
            Deselect All
          </button>
          <button
            className="ml-auto px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            onClick={handleCloseAirwaysDialog}
          >
            Close
          </button>
          <ul>
            {Object.entries(selectedAirways).map(([k, v]) => (
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
          <br />
        </div>
      )}
    </>
  );
};

export default SideBar;
