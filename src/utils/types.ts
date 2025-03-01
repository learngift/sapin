// utils/types.ts
import Projection from "@/utils/Projection";

export interface ExerciseData {
  proj_center?: string;
  proj?: Projection;
  bounds?: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  };
}

export interface ExerciseDataR {
  proj_center: string;
  proj: Projection;
  bounds: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  };
}

export interface GeoPtsData {
  nav: Record<string, [number, number]>;
  outl: Record<string, [number, number]>;
  proj?: Record<string, [number, number]>;
}

export interface GeoPtsDataR {
  nav: Record<string, [number, number]>;
  outl: Record<string, [number, number]>;
  proj: Record<string, [number, number]>;
}

export interface AirportDataR {
  latlong: [number, number];
  proj: [number, number];
}

export interface AirwaysData {
  [airwayName: string]: string[];
}

export interface AirwaysEntryR {
  points: string[];
  tip: string;
}

export interface AirwaysDataR {
  [airwayName: string]: AirwaysEntryR;
}

export interface SidEntry {
  runway: string;
  points: string[];
}
export interface SidEntryR extends SidEntry {
  tip: string;
}
export interface SidsData {
  [sidName: string]: SidEntry;
}
export interface SidsDataR {
  [sidName: string]: SidEntryR;
}

export interface StarPoint {
  point_name: string;
  phase: "INITIAL" | "INTERMEDIATE" | "FINAL";
}

export interface StarEntry {
  runway: string;
  points: StarPoint[];
}

export interface StarEntryR extends StarEntry {
  tip: string;
}

export interface StarsData {
  [starName: string]: StarEntry;
}

export interface StarsDataR {
  [starName: string]: StarEntryR;
}

export interface VolumeEntry {
  lower_level: number;
  upper_level: number;
  points: string[];
}
export interface VolumeEntryR extends VolumeEntry {
  center: [number, number];
  area: number;
  tip: string;
}

export interface RunwayData {
  airport: string;
  point: string;
  heading: number;
  length: number;
}

export interface RunwayDataR extends RunwayData {
  proj: [number, number];
  proj1: [number, number];
}

/**
 * Décrit l'ensemble de volumes : les clés sont les noms des volumes,
 * et chaque clé pointe vers un objet VolumeEntry.
 */
export interface VolumesData {
  [volumeName: string]: VolumeEntry;
}

export interface VolumesDataR {
  [volumeName: string]: VolumeEntryR;
}

export interface SectorDataR {
  volumes: string[];
  center: [number, number];
  tip: string;
  lines: string[][];
}

export interface FlightPointsData {
  sid: string | null;
  star: string | null;
  points: string[];
}

/**
 * Décrit la structure d’un vol (un élément du tableau `flights`).
 */
export interface FlightEntry {
  callsign: string;
  type: string;
  dep: string | null; // Dans l’exemple, c’est toujours null
  adep: string; // Aéroport de départ (code OACI, etc.)
  ades: string; // Aéroport d’arrivée
  route: string;
  rfl: number;
  tas: number;
  efl: number;
  points: FlightPointsData;
}

export interface FlightEntryR {
  callsign: string;
  type: string;
  dep: string | null; // Dans l’exemple, c’est toujours null
  adep: string; // Aéroport de départ (code OACI, etc.)
  ades: string; // Aéroport d’arrivée
  route: string;
  rfl: number;
  tas: number;
  efl: number;
  points: FlightPointsData;
}

/**
 * Structure globale pour l'état "data".
 * Adaptez les types `any` ci-dessous si vous connaissez la structure de vos JSON.
 */
export interface DataState {
  exercise: ExerciseData | null;
  geo_pts: GeoPtsData | null;
  airways: AirwaysData | null;
  airports: Record<string, [number, number]> | null;
  runways: Record<string, RunwayData> | null;
  sids: SidsData | null;
  stars: StarsData | null;
  volumes: VolumesData | null;
  sectors: Record<string, [string]> | null;
  flights: FlightEntry[] | null;
}
export interface DataStateR {
  exercise: ExerciseDataR;
  geo_pts: GeoPtsDataR;
  airways: AirwaysDataR;
  airports: Record<string, AirportDataR>;
  runways: Record<string, RunwayDataR>;
  sids: SidsDataR;
  stars: StarsDataR;
  volumes: VolumesDataR;
  sectors: Record<string, SectorDataR>;
  flights: FlightEntryR[];
}

export interface VisibilityCategory {
  items: Record<string, boolean>;
  showLabels: boolean;
  showPoints?: boolean;
}
export interface VisibilityState {
  navpts: VisibilityCategory;
  outls: VisibilityCategory;
  airports: VisibilityCategory;
  runways: VisibilityCategory;
  airways: VisibilityCategory;
  sids: VisibilityCategory;
  stars: VisibilityCategory;
  volumes: VisibilityCategory;
  sectors: VisibilityCategory;
  flights: VisibilityCategory;
}

export type DataKey =
  | "exercise"
  | "geo_pts"
  | "airports"
  | "runways"
  | "airways"
  | "sids"
  | "stars"
  | "volumes"
  | "sectors"
  | "flights";

export type LoadStatus = "pending" | "loaded" | "finished" | "error" | "error parsing";
