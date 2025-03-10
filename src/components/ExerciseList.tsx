import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Exercise {
  name: string;
  description: string;
}
let i = 0,
  j = 0;

function ExerciseList() {
  const { simulationId } = useParams(); // Récupère le paramètre de l'URL
  const [exercises, setExercises] = useState<Exercise[] | string>("Chargement des exercices...");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentExercises, setRecentExercises] = useState<string[]>([]);
  const navigate = useNavigate();
  console.log(
    `render ${i++} simulationId=${simulationId} searchQuery=${searchQuery} recentExercises=${recentExercises}`
  );

  useEffect(() => {
    let isCancelled = false;
    // Charger les exercices depuis le fichier JSON correspondant à la simulation
    const local_j = j++;

    console.log(`fetch ${local_j}`);
    fetch(`/api/${simulationId}/exercises.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error when loading exercices");
        }
        return response.json() as Promise<Record<string, string>>;
      })
      .then((data) => {
        if (!isCancelled) {
          // Transformer l'objet en tableau [{ name, description }]
          const formattedExercises: Exercise[] = Object.entries(data).map(([name, description]) => ({
            name,
            description,
          }));
          setExercises(formattedExercises);
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          console.error("Error:", error);
          setExercises(error instanceof Error ? error.message : String(error));
        }
      });
    return () => {
      console.log(`cancel ${local_j}`);
      isCancelled = true;
    };
  }, [simulationId]);

  useEffect(() => {
    // ✅ Charger les exercices récents depuis le localStorage
    const recent = localStorage.getItem(`recentExercises_${simulationId}`);
    if (recent) {
      setRecentExercises(JSON.parse(recent).slice(0, 3)); // Limite à 3 récents
    }
  }, [simulationId]);

  // ✅ Gérer le clic sur un exercice
  const handleExerciseClick = (exerciseName: string) => {
    const updatedRecent = [exerciseName, ...recentExercises.filter((name) => name !== exerciseName)].slice(0, 3);
    setRecentExercises(updatedRecent);
    localStorage.setItem(`recentExercises_${simulationId}`, JSON.stringify(updatedRecent));

    // Redirection vers la page de l'exercice
    navigate(`/exercise/${simulationId}/${exerciseName}`);
  };

  if (typeof exercises === "string") {
    // loading or in error
    return <div>{exercises}</div>;
  }

  // ✅ Filtrage des exercices par recherche + tri alphabétique
  const filteredExercises = exercises
    .filter((ex) => !recentExercises.includes(ex.name)) // Exclure les récents
    .filter((ex) => ex.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name)); // Tri alphabétique

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Exercices of simulation {simulationId}</h1>

      {/* ✅ Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher un exercice..."
        className="mb-4 p-2 border rounded w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* ✅ Exercices récents */}
      {recentExercises.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Exercices récents</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentExercises.map((name) => {
              const exercise = exercises.find((ex) => ex.name === name);
              if (!exercise) return null;
              return (
                <li
                  key={exercise.name}
                  onClick={() => handleExerciseClick(exercise.name)}
                  className="p-4 rounded-lg shadow bg-blue-50 dark:bg-blue-900 hover:shadow-lg transition cursor-pointer"
                >
                  <h2 className="text-lg font-semibold">{exercise.name}</h2>
                  <p className="text-sm text-justify text-gray-700 dark:text-gray-400">{exercise.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ✅ Liste des exercices triés alphabétiquement */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <li
            key={exercise.name}
            onClick={() => handleExerciseClick(exercise.name)}
            className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="text-lg font-semibold">{exercise.name}</h2>
            <p className="text-sm text-justify text-gray-700 dark:text-gray-400">{exercise.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExerciseList;
