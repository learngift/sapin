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
        <div className="absolute left-full top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg p-4 z-50 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Airways</h3>
          <button
            onClick={handleCloseAirwaysDialog}
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
        </div>
      )}
    </>
  );
};

export default SideBar;
