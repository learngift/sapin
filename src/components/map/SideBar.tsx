import { useState } from "react";
import VisibilitySelection from "@/components/map/VisibilitySelection";
import { DataStateR, VisibilityState, VisibilityCategory } from "@/utils/types";

interface SidebarProps {
  visibility: VisibilityState;
  updateVisibility: (newVisibility: VisibilityState) => void;
  alltips: DataStateR;
}

const SideBar: React.FC<SidebarProps> = ({ visibility, updateVisibility, alltips }) => {
  const [selectedNavpts, setSelectedNavpts] = useState<VisibilityCategory>(visibility.navpts);
  const [selectedOutls, setSelectedOutls] = useState<VisibilityCategory>(visibility.outls);
  const [selectedAirports, setSelectedAirports] = useState<VisibilityCategory>(visibility.airports);
  const [selectedRunways, setSelectedRunways] = useState<VisibilityCategory>(visibility.runways);
  const [selectedSids, setSelectedSids] = useState<VisibilityCategory>(visibility.sids);
  const [selectedStars, setSelectedStars] = useState<VisibilityCategory>(visibility.stars);
  const [selectedAirways, setSelectedAirways] = useState<VisibilityCategory>(visibility.airways);
  const [selectedVolumes, setSelectedVolumes] = useState<VisibilityCategory>(visibility.volumes);
  const [selectedSectors, setSelectedSectors] = useState<VisibilityCategory>(visibility.sectors);
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
  const handlesetSelectedRunways = (updated: VisibilityCategory): void => {
    setSelectedRunways(updated);
    updateVisibility({ ...visibility, runways: updated });
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
          <button onClick={handleClick("navpts")} className={openSelection === "navpts" ? "active" : undefined}>
            Nav Points
          </button>
        </li>
        <li>
          <button onClick={handleClick("outls")} className={openSelection === "outls" ? "active" : undefined}>
            Outl Points
          </button>
        </li>
        <li>
          <button onClick={handleClick("airports")} className={openSelection === "airports" ? "active" : undefined}>
            Airports
          </button>
        </li>
        <li>
          <button onClick={handleClick("runways")} className={openSelection === "runways" ? "active" : undefined}>
            Runways
          </button>
        </li>
        <li>
          <button onClick={handleClick("sids")} className={openSelection === "sids" ? "active" : undefined}>
            SIDs
          </button>
        </li>
        <li>
          <button onClick={handleClick("stars")} className={openSelection === "stars" ? "active" : undefined}>
            STARs
          </button>
        </li>
        <li>
          <button onClick={handleClick("airways")} className={openSelection === "airways" ? "active" : undefined}>
            Airways
          </button>
        </li>
        <li>
          <button onClick={handleClick("volumes")} className={openSelection === "volumes" ? "active" : undefined}>
            Volumes
          </button>
        </li>
        <li>
          <button onClick={handleClick("sectors")} className={openSelection === "sectors" ? "active" : undefined}>
            Sectors
          </button>
        </li>
        <li>
          <button onClick={handleClick("flights")} className={openSelection === "flights" ? "active" : undefined}>
            Flights
          </button>
        </li>
        <li>
          <button onClick={handleClick("overlaps")} className={openSelection === "overlaps" ? "active" : undefined}>
            Holes & Overlaps
          </button>
        </li>
        <li>
          <button onClick={handleClick("play")} className={openSelection === "play" ? "active" : undefined}>
            Play
          </button>
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
      {openSelection === "runways" && (
        <VisibilitySelection
          title="Runways"
          data={selectedRunways}
          setData={handlesetSelectedRunways}
          onClose={handleClose}
        />
      )}
      {openSelection === "sids" && (
        <VisibilitySelection
          title="Sids"
          data={selectedSids}
          setData={handlesetSelectedSids}
          onClose={handleClose}
          tips={alltips.sids}
        />
      )}
      {openSelection === "stars" && (
        <VisibilitySelection
          title="Stars"
          data={selectedStars}
          setData={handlesetSelectedStars}
          onClose={handleClose}
          tips={alltips.stars}
        />
      )}
      {openSelection === "airways" && (
        <VisibilitySelection
          title="Airways"
          data={selectedAirways}
          setData={handlesetSelectedAirways}
          onClose={handleClose}
          tips={alltips.airways}
        />
      )}
      {openSelection === "volumes" && (
        <VisibilitySelection
          title="Volumes"
          data={selectedVolumes}
          setData={handlesetSelectedVolumes}
          onClose={handleClose}
          tips={alltips.volumes}
        />
      )}
      {openSelection === "sectors" && (
        <VisibilitySelection
          title="Sectors"
          data={selectedSectors}
          setData={handlesetSelectedSectors}
          onClose={handleClose}
          tips={alltips.sectors}
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
