import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Simulation {
  name: string;
  release: string;
  description: string;
}

function SimulationList() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSimulations, setRecentSimulations] = useState<string[]>([]);
  const navigate = useNavigate();

  // ✅ Charger les simulations depuis l'API
  useEffect(() => {
    fetch("/api/simulations.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des simulations");
        }
        return response.json();
      })
      .then((data) => {
        setSimulations(
          data.sort((a: Simulation, b: Simulation) =>
            a.name.localeCompare(b.name)
          )
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        setLoading(false);
      });

    // ✅ Charger les simulations récemment consultées
    const recent = localStorage.getItem("recentSimulations");
    if (recent) {
      setRecentSimulations(JSON.parse(recent).slice(0, 3));
    }
  }, []);

  // ✅ Gestion des clics sur une simulation
  const handleSimulationClick = (simulationName: string) => {
    const updatedRecent = [
      simulationName,
      ...recentSimulations.filter((name) => name !== simulationName),
    ].slice(0, 5);
    setRecentSimulations(updatedRecent);
    localStorage.setItem("recentSimulations", JSON.stringify(updatedRecent));

    // Redirection vers la page des exercices
    navigate(`/simulation/${simulationName}`);
  };

  // ✅ Filtrage des simulations par recherche
  const filteredSimulations = simulations.filter((sim) =>
    sim.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Chargement des simulations...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Simulations</h1>

      {/* ✅ Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher une simulation..."
        className="mb-4 p-2 border rounded w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* ✅ Simulations récemment consultées */}
      {recentSimulations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Simulations récentes</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentSimulations.map((name) => {
              const sim = simulations.find((s) => s.name === name);
              if (!sim) return null;
              return (
                <li
                  key={sim.name}
                  onClick={() => handleSimulationClick(sim.name)}
                  className="p-4 rounded-lg shadow bg-blue-50 dark:bg-blue-900 hover:shadow-lg transition cursor-pointer"
                >
                  <h2 className="text-lg font-semibold">{sim.name}</h2>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    <span className="text-gray-600 dark:text-gray-300">
                      {sim.release}
                    </span>
                    :{sim.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ✅ Liste filtrée des simulations */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSimulations.map((simulation) => (
          <li
            key={simulation.name}
            onClick={() => handleSimulationClick(simulation.name)}
            className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="text-lg font-semibold">{simulation.name}</h2>
            <p className="text-sm text-justify text-gray-700 dark:text-gray-400">
              <span className="text-indigo-800 dark:text-indigo-300">
                {simulation.release}
              </span>
              :{simulation.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SimulationList;
