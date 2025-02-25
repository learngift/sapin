import { useState } from "react";
import VisibilitySelection from "@/components/map/VisibilitySelection";
import { VisibilityState, VisibilityCategory } from "@/utils/types";

interface SidebarProps {
  visibility: VisibilityState;
  updateVisibility: (newVisibility: VisibilityState) => void;
}

const SideBar: React.FC<SidebarProps> = ({ visibility, updateVisibility }) => {
  const [selectedNavpts, setSelectedNavpts] = useState<VisibilityCategory>(visibility.navpts);
  const [selectedOutls, setSelectedOutls] = useState<VisibilityCategory>(visibility.outls);
  const [selectedAirports, setSelectedAirports] = useState<VisibilityCategory>(visibility.airports);
  const [selectedSids, setSelectedSids] = useState<VisibilityCategory>(visibility.sids);
  const [selectedStars, setSelectedStars] = useState<VisibilityCategory>(visibility.stars);
  const [selectedAirways, setSelectedAirways] = useState<VisibilityCategory>(visibility.airways);
  const [selectedSectors, setSelectedSectors] = useState<VisibilityCategory>(visibility.sectors);
  const [selectedVolumes, setSelectedVolumes] = useState<VisibilityCategory>(visibility.volumes);
  const [selectedFlights, setSelectedFlights] = useState<VisibilityCategory>(visibility.flights);
  const [openSelection, setOpenSelection] = useState<string>("");

  const handleClick = (selection: string) => () => setOpenSelection(selection === openSelection ? "" : selection);
  const handleClose = () => setOpenSelection("");

  const handlesetSelectedNavpts = (updated: VisibilityCategory): void => {
    setSelectedNavpts(updated);
    updateVisibility({ ...visibility, navpts: updated });
  };
  const handlesetSelectedOutls = (updated: VisibilityCategory): void => {
    setSelectedOutls(updated);
    updateVisibility({ ...visibility, outls: updated });
  };
  const handlesetSelectedAirports = (updated: VisibilityCategory): void => {
    setSelectedAirports(updated);
    updateVisibility({ ...visibility, airports: updated });
  };
  const handlesetSelectedSids = (updated: VisibilityCategory): void => {
    setSelectedSids(updated);
    updateVisibility({ ...visibility, sids: updated });
  };
  const handlesetSelectedStars = (updated: VisibilityCategory): void => {
    setSelectedStars(updated);
    updateVisibility({ ...visibility, stars: updated });
  };
  const handlesetSelectedAirways = (updated: VisibilityCategory): void => {
    setSelectedAirways(updated);
    updateVisibility({ ...visibility, airways: updated });
  };
  const handlesetSelectedSectors = (updated: VisibilityCategory): void => {
    setSelectedSectors(updated);
    updateVisibility({ ...visibility, sectors: updated });
  };
  const handlesetSelectedVolumes = (updated: VisibilityCategory): void => {
    setSelectedVolumes(updated);
    updateVisibility({ ...visibility, volumes: updated });
  };
  const handlesetSelectedFlights = (updated: VisibilityCategory): void => {
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
        <VisibilitySelection title="Sids" data={selectedSids} setData={handlesetSelectedSids} onClose={handleClose} />
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
