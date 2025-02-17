import { useState, useEffect } from "react";
import reactLogo from "@/assets/react.svg";
import viteLogo from "/vite.svg";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface Simulation {
  name: string;
  release: string;
  description: string;
}

function SimulationList() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les simulations depuis le fichier JSON
    fetch("/api/simulations.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des simulations");
        }
        return response.json();
      })
      .then((data) => {
        setSimulations(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Chargement des simulations...</div>;
  }

  return (
    <div>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[400px] w-fit rounded-lg border"
      >
        <ResizablePanel defaultSize={25}>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <h1>Liste des simulations</h1>
          <ul>
            {simulations.map((simulation, index) => (
              <li key={index}>
                <h2>{simulation.name}</h2>
                <p>
                  <strong>Release :</strong> {simulation.release}
                </p>
                <p>
                  <strong>Description :</strong> {simulation.description}
                </p>
                <a href={`/simulation/${simulation.name}`}>
                  Voir les exercices
                </a>
              </li>
            ))}
          </ul>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default SimulationList;
