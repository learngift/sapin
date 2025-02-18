/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Projection from "@/utils/Projection";
import CanvasComponent from "@/components/CanvasComponent";
import { DataState } from "@/utils/types";

type DataKey =
  | "exercise"
  | "geo_pts"
  | "airways"
  | "sids"
  | "stars"
  | "volumes"
  | "flights";

type LoadStatus = "pending" | "loaded" | "finished" | "error" | "error parsing";

const dataModel: Record<DataKey, { label: string; api: string }> = {
  exercise: { label: "Exercise", api: "exercise.json" },
  geo_pts: { label: "Points", api: "geo_pts.json" },
  airways: { label: "Airways", api: "airways.json" },
  sids: { label: "SIDs", api: "sids.json" },
  stars: { label: "STARs", api: "stars.json" },
  volumes: { label: "Volumes", api: "volumes.json" },
  flights: { label: "Flights", api: "flights.json" },
};
const dataList: DataKey[] = [
  "exercise",
  "geo_pts",
  "airways",
  "sids",
  "stars",
  "volumes",
  "flights",
];

function ExerciseVisualization() {
  const { simulationId, exerciseId } = useParams(); // Paramètres de l'URL
  const [progress, setProgress] = useState<Record<DataKey, LoadStatus>>(
    Object.fromEntries(dataList.map((key) => [key, "pending"])) as Record<
      DataKey,
      LoadStatus
    >
  );

  const [data, setData] = useState<DataState>(
    Object.fromEntries(
      dataList.map((key) => [key, null])
    ) as unknown as DataState
  );

  // Fonction pour charger un fichier JSON
  const fetchJson = async (key: DataKey): Promise<void> => {
    const label = dataModel[key].label;
    console.log(label);
    const filename = dataModel[key].api;
    try {
      // delay for demo effect
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const response = await fetch(
        `/api/${simulationId}/${exerciseId}/${filename}`
      );
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement de ${filename}`);
      }
      await delay(Math.random() * (1000 - 200) + 200);
      const json = await response.json();
      console.log(`setData ${key}`);
      setData((prevData) =>
        prevData[key] === null ? { ...prevData, [key]: json } : prevData
      );
      console.log(`setProgress ${key} loaded`);
      setProgress((prev) =>
        prev[key] === "pending" ? { ...prev, [key]: "loaded" } : prev
      );
    } catch (error) {
      console.error(error);
      console.error(filename);
      setProgress((prev) => ({ ...prev, [key]: "error" }));
    }
  };

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
      if (progress.flights === "loaded" && progress.volumes === "finished") {
        //
        console.log(`setProgress flights finished`);
        setProgress((prev) => ({ ...prev, flights: "finished" }));
      } else if (
        progress.volumes === "loaded" &&
        progress.stars === "finished"
      ) {
        console.log(`setProgress volumes finished`);
        setProgress((prev) => ({ ...prev, volumes: "finished" }));
      } else if (progress.stars === "loaded" && progress.sids === "finished") {
        console.log(`setProgress stars finished`);
        setProgress((prev) => ({ ...prev, stars: "finished" }));
      } else if (
        progress.sids === "loaded" &&
        progress.airways === "finished"
      ) {
        console.log(`setProgress sids finished`);
        setProgress((prev) => ({ ...prev, sids: "finished" }));
      } else if (
        progress.airways === "loaded" &&
        progress.geo_pts === "finished"
      ) {
        console.log(`setProgress airways finished`);
        setProgress((prev) => ({ ...prev, airways: "finished" }));
      } else if (
        progress.geo_pts === "loaded" &&
        progress.exercise === "finished"
      ) {
        let projection: Projection;
        const pc = data.exercise?.proj_center;
        if (pc) {
          const point = data.geo_pts?.nav[pc] || data.geo_pts?.outl[pc];
          if (point === undefined) {
            console.log(`setProgress geo_pts error parsing`);
            setProgress((prev) => ({ ...prev, geo_pts: "error parsing" }));
            return;
          }
          projection = new Projection(point);
        } else {
          projection = new Projection();
        }
        const all_pts = [
          ...Object.entries(data.geo_pts?.nav ?? {}),
          ...Object.entries(data.geo_pts?.outl ?? {}),
        ];
        const new_geo_pts = {
          ...data.geo_pts,
          proj: Object.fromEntries(
            all_pts.map(([k, v]) => [k, projection.geo2stereo(v)])
          ),
        };
        console.log(new_geo_pts);
        const bounds = Object.values(new_geo_pts.proj).reduce(
          (acc, [x, y]) => ({
            xMin: Math.min(acc.xMin, x),
            xMax: Math.max(acc.xMax, x),
            yMin: Math.min(acc.yMin, y),
            yMax: Math.max(acc.yMax, y),
          }),
          {
            xMin: Number.POSITIVE_INFINITY,
            xMax: Number.NEGATIVE_INFINITY,
            yMin: Number.POSITIVE_INFINITY,
            yMax: Number.NEGATIVE_INFINITY,
          }
        );
        const new_exercise = {
          ...data.exercise,
          proj: projection,
          bounds: bounds,
        };
        console.log(`setData exercise geo_pts`);
        setData(
          (prevData: DataState) =>
            ({
              ...prevData,
              geo_pts: new_geo_pts,
              exercise: new_exercise,
            } as DataState)
        );
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

  // Affichage de la progression
  return (
    <>
      {progress.flights === "finished" ? (
        // Afficher uniquement le canvas lorsque le chargement est terminé
        <CanvasComponent data={data} />
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
