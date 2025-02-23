import { useState } from "react";
import VisibilitySelection from "@/components/map/VisibilitySelection";
import { VisibilityState } from "@/utils/types";

interface SidebarProps {
  visibility: VisibilityState;
  updateVisibility: (newVisibility: VisibilityState) => void;
}

const SideBar: React.FC<SidebarProps> = ({ visibility, updateVisibility }) => {
  const [selectedNavpts, setSelectedNavpts] = useState<Record<string, boolean>>(visibility.navpts);
  const [selectedOutls, setSelectedOutls] = useState<Record<string, boolean>>(visibility.outls);
  const [selectedAirports, setSelectedAirports] = useState<Record<string, boolean>>(visibility.airports);
  const [selectedSids, setSelectedSids] = useState<Record<string, boolean>>(visibility.sids);
  const [selectedStars, setSelectedStars] = useState<Record<string, boolean>>(visibility.stars);
  const [selectedAirways, setSelectedAirways] = useState<Record<string, boolean>>(visibility.airways);
  const [selectedSectors, setSelectedSectors] = useState<Record<string, boolean>>(visibility.sectors);
  const [selectedVolumes, setSelectedVolumes] = useState<Record<string, boolean>>(visibility.volumes);
  const [selectedFlights, setSelectedFlights] = useState<Record<string, boolean>>(visibility.flights);
  const [openSelection, setOpenSelection] = useState<string>("");

  const handleClick = (selection: string) => () =>
    setOpenSelection(selection === openSelection ? "" : selection);
  const handleClose = () => setOpenSelection("");

  const handlesetSelectedNavpts = (updated: Record<string, boolean>): void => {
    setSelectedNavpts(updated);
    updateVisibility({ ...visibility, navpts: updated });
  };
  const handlesetSelectedOutls = (updated: Record<string, boolean>): void => {
    setSelectedOutls(updated);
    updateVisibility({ ...visibility, outls: updated });
  };
  const handlesetSelectedAirports = (updated: Record<string, boolean>): void => {
    setSelectedAirports(updated);
    updateVisibility({ ...visibility, airports: updated });
  };
  const handlesetSelectedSids = (updated: Record<string, boolean>): void => {
    setSelectedSids(updated);
    updateVisibility({ ...visibility, sids: updated });
  };
  const handlesetSelectedStars = (updated: Record<string, boolean>): void => {
    setSelectedStars(updated);
    updateVisibility({ ...visibility, stars: updated });
  };
  const handlesetSelectedAirways = (updated: Record<string, boolean>): void => {
    setSelectedAirways(updated);
    updateVisibility({ ...visibility, airways: updated });
  };
  const handlesetSelectedSectors = (updated: Record<string, boolean>): void => {
    setSelectedSectors(updated);
    updateVisibility({ ...visibility, sectors: updated });
  };
  const handlesetSelectedVolumes = (updated: Record<string, boolean>): void => {
    setSelectedVolumes(updated);
    updateVisibility({ ...visibility, volumes: updated });
  };
  const handlesetSelectedFlights = (updated: Record<string, boolean>): void => {
    setSelectedFlights(updated);
    updateVisibility({ ...visibility, flights: updated });
  };

  return (
    <>
      <ul className="space-y-2">
        <li>
          <button onClick={handleClick("navpts")}>Nav Points</button>
        </li>
        <li>
          <button onClick={handleClick("outls")}>Outl Points</button>
        </li>
        <li>
          <button onClick={handleClick("airports")}>Airports</button>
        </li>
        <li>
          <button onClick={handleClick("airways")}>Airways</button>
        </li>
        <li>
          <button onClick={handleClick("sids")}>SIDs</button>
        </li>
        <li>
          <button onClick={handleClick("stars")}>STARs</button>
        </li>
        <li>
          <button onClick={handleClick("runways")}>Runways</button>
        </li>
        <li>
          <button onClick={handleClick("sectors")}>Sectors</button>
        </li>
        <li>
          <button onClick={handleClick("volumes")}>Volumes</button>
        </li>
        <li>
          <button onClick={handleClick("flights")}>Flights</button>
        </li>
        <li>
          <button onClick={handleClick("overlaps")}>Holes & Overlaps</button>
        </li>
        <li>
          <button onClick={handleClick("play")}>Play</button>
        </li>
      </ul>
      {openSelection === "navpts" && (
        <VisibilitySelection
          title="Nav Points"
          data={selectedNavpts}
          setData={handlesetSelectedNavpts}
          onClose={handleClose}
        />
      )}
      {openSelection === "outls" && (
        <VisibilitySelection
          title="Outl Points"
          data={selectedOutls}
          setData={handlesetSelectedOutls}
          onClose={handleClose}
        />
      )}
      {openSelection === "airports" && (
        <VisibilitySelection
          title="Airports"
          data={selectedAirports}
          setData={handlesetSelectedAirports}
          onClose={handleClose}
        />
      )}
      {openSelection === "sids" && (
        <VisibilitySelection
          title="Sids"
          data={selectedSids}
          setData={handlesetSelectedSids}
          onClose={handleClose}
        />
      )}
      {openSelection === "stars" && (
        <VisibilitySelection
          title="Stars"
          data={selectedStars}
          setData={handlesetSelectedStars}
          onClose={handleClose}
        />
      )}
      {openSelection === "airways" && (
        <VisibilitySelection
          title="Airways"
          data={selectedAirways}
          setData={handlesetSelectedAirways}
          onClose={handleClose}
        />
      )}
      {openSelection === "sectors" && (
        <VisibilitySelection
          title="Sectors"
          data={selectedSectors}
          setData={handlesetSelectedSectors}
          onClose={handleClose}
        />
      )}
      {openSelection === "volumes" && (
        <VisibilitySelection
          title="Volumes"
          data={selectedVolumes}
          setData={handlesetSelectedVolumes}
          onClose={handleClose}
        />
      )}
      {openSelection === "flights" && (
        <VisibilitySelection
          title="Flights"
          data={selectedFlights}
          setData={handlesetSelectedFlights}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default SideBar;
