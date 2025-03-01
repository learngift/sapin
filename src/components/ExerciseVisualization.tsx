/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import CanvasComponent from "@/components/map/CanvasComponent";
import { DataState, DataStateR, DataKey, LoadStatus } from "@/utils/types";
import { processData } from "@/utils/transform";

const dataModel: Record<DataKey, { label: string; api: string }> = {
  exercise: { label: "Exercise", api: "exercise.json" },
  geo_pts: { label: "Points", api: "geo_pts.json" },
  airports: { label: "Airports", api: "airports.json" },
  runways: { label: "Runways", api: "runways.json" },
  airways: { label: "Airways", api: "airways.json" },
  sids: { label: "SIDs", api: "sids.json" },
  stars: { label: "STARs", api: "stars.json" },
  volumes: { label: "Volumes", api: "volumes.json" },
  sectors: { label: "Sectors", api: "sectors.json" },
  flights: { label: "Flights", api: "flights.json" },
};
const dataList: DataKey[] = [
  "exercise",
  "geo_pts",
  "airports",
  "runways",
  "airways",
  "sids",
  "stars",
  "volumes",
  "sectors",
  "flights",
];

function ExerciseVisualization() {
  const { simulationId, exerciseId } = useParams(); // Paramètres de l'URL
  const [progress, setProgress] = useState<Record<DataKey, LoadStatus>>(
    Object.fromEntries(dataList.map((key) => [key, "pending"])) as Record<DataKey, LoadStatus>
  );

  const [data, setData] = useState<DataState>(
    Object.fromEntries(dataList.map((key) => [key, null])) as unknown as DataState
  );
  const [dataR, setDataR] = useState<DataStateR | null>(null);

  // Fonction pour charger un fichier JSON
  const fetchJson = useCallback(
    async (key: DataKey): Promise<void> => {
      const label = dataModel[key].label;
      console.log(label);
      const filename = dataModel[key].api;
      try {
        // delay for demo effect
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

        const response = await fetch(`/api/${simulationId}/${exerciseId}/${filename}`);
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement de ${filename}`);
        }
        await delay(Math.random() * (1000 - 200) + 200); // slow
        // await delay(Math.random() * (100 - 20) + 20); // fast
        const json = await response.json();
        console.log(`setData ${key}`);
        setData((prevData) => (prevData[key] === null ? { ...prevData, [key]: json } : prevData));
        console.log(`setProgress ${key} loaded`);
        setProgress((prev) => (prev[key] === "pending" ? { ...prev, [key]: "loaded" } : prev));
      } catch (error) {
        console.error(error);
        console.error(filename);
        setProgress((prev) => ({ ...prev, [key]: "error" }));
      }
    },
    [simulationId, exerciseId]
  );

  useEffect(() => {
    console.log("Component mounted");
    return () => {
      console.log("Component unmounted");
    };
  }, []);

  useEffect(() => {
    // Use Promise.all to parallelize queries
    Promise.all(dataList.map((key) => fetchJson(key)));
  }, [simulationId, exerciseId, fetchJson]);

  useEffect(() => {
    if (progress.flights !== "finished") {
      if (progress.flights === "loaded" && progress.sectors === "finished") {
        console.log(`setProgress flights finished`);
        setProgress((prev) => ({ ...prev, flights: "finished" }));
        setDataR(processData(data, setProgress));
      } else if (progress.sectors === "loaded" && progress.volumes === "finished") {
        console.log(`setProgress sectors finished`);
        setProgress((prev) => ({ ...prev, sectors: "finished" }));
      } else if (progress.volumes === "loaded" && progress.stars === "finished") {
        console.log(`setProgress volumes finished`);
        setProgress((prev) => ({ ...prev, volumes: "finished" }));
      } else if (progress.stars === "loaded" && progress.sids === "finished") {
        console.log(`setProgress stars finished`);
        setProgress((prev) => ({ ...prev, stars: "finished" }));
      } else if (progress.sids === "loaded" && progress.airways === "finished") {
        console.log(`setProgress sids finished`);
        setProgress((prev) => ({ ...prev, sids: "finished" }));
      } else if (progress.airways === "loaded" && progress.runways === "finished") {
        console.log(`setProgress airways finished`);
        setProgress((prev) => ({ ...prev, airways: "finished" }));
      } else if (progress.runways === "loaded" && progress.airports === "finished") {
        console.log(`setProgress runways finished`);
        setProgress((prev) => ({ ...prev, runways: "finished" }));
      } else if (progress.airports === "loaded" && progress.geo_pts === "finished") {
        console.log(`setProgress airports finished`);
        setProgress((prev) => ({ ...prev, airports: "finished" }));
      } else if (progress.geo_pts === "loaded" && progress.exercise === "finished") {
        console.log(`setProgress geo_pts finished`);
        setProgress((prev) => ({ ...prev, geo_pts: "finished" }));
      } else if (progress.exercise === "loaded") {
        console.log(`setProgress exercises finished`);
        setProgress((prev) => ({ ...prev, exercise: "finished" }));
      } else {
        // console.log('do nothing')
      }
    }
  }, [progress]);

  useEffect(() => {
    (window as any).data = data;
  }, [data]);
  useEffect(() => {
    (window as any).dataR = dataR;
  }, [dataR]);

  // Affichage de la progression
  return (
    <>
      {dataR !== null ? (
        // Afficher uniquement le canvas lorsque le chargement est terminé
        <CanvasComponent data={dataR} />
      ) : (
        // Afficher l'état de progression si le chargement n'est pas terminé
        <div>
          <h1>Visualisation de l'exercice {exerciseId}</h1>
          <table>
            <thead>
              <tr>
                <th>Étape</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dataList.map((key) => (
                <tr key={key}>
                  <td>{dataModel[key].label}</td>
                  <td>{progress[key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default ExerciseVisualization;
