import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Exercise {
  name: string;
  description: string;
}

function ExerciseList() {
  const { simulationId } = useParams(); // Récupère le paramètre de l'URL
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les exercices depuis le fichier JSON correspondant à la simulation
    fetch(`/api/${simulationId}/exercises.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des exercices");
        }
        return response.json() as Promise<Record<string, string>>;
      })
      .then((data) => {
        // Transformer l'objet en tableau [{ name, description }]
        const formattedExercises: Exercise[] = Object.entries(data).map(
          ([name, description]) => ({
            name,
            description,
          })
        );
        setExercises(formattedExercises);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        setLoading(false);
      });
  }, [simulationId]);

  if (loading) {
    return <div>Chargement des exercices...</div>;
  }

  return (
    <div>
      <h1>Liste des exercices pour la simulation {simulationId}</h1>
      <ul>
        {exercises.map((exercise, index) => (
          <li key={index}>
            <h2>{exercise.name}</h2>
            <p>{exercise.description}</p>
            <a href={`/exercise/${simulationId}/${exercise.name}`}>
              Voir l'exercice
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExerciseList;
