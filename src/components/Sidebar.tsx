import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Visibility {
  airways: Record<string, boolean>; // Dictionnaire des airways cochés
}

interface SidebarProps {
  visibility: Visibility;
  updateVisibility: (newVisibility: Visibility) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  visibility,
  updateVisibility,
  onClose,
}) => {
  const navigate = useNavigate();
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
    <div
      style={{
        width: "250px",
        height: "100vh",
        position: "fixed",
        top: 40,
        left: 0,
        background: "#f4f4f4",
        borderRight: "1px solid #ddd",
        padding: "10px",
        overflowY: "auto",
        zIndex: 999,
      }}
    >
      <button onClick={onClose} style={{ marginBottom: "10px" }}>
        Close
      </button>
      <button onClick={() => navigate("/exercises")}>Exercises</button>
      <ul>
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
        <div
          style={{
            width: "250px",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            background: "#f4f4f4",
            borderRight: "1px solid #ddd",
            padding: "10px",
            overflowY: "auto",
            zIndex: 999,
          }}
        >
          <h3>Airways</h3>
          <button onClick={handleSelectAll}>Select All</button>
          <button onClick={handleDeselectAll}>Deselect All</button>
          <button onClick={handleCloseAirwaysDialog}>Close</button>
          <ul>
            {Object.entries(selectedAirways).map(([k, v]) => (
              <li key={k}>
                <label>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(k)}
                    checked={v}
                  />
                  {k}
                </label>
              </li>
            ))}
          </ul>
          <br />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
