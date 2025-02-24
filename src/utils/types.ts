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

export interface AirwaysData {
  [airwayName: string]: string[];
}
export interface AirwaysDataR {
  [airwayName: string]: string[];
}

export interface SidEntry {
  runway: string;
  points: string[];
}
export interface SidEntryR {
  runway: string;
  points: string[];
}
export interface SidsData {
  [sidName: string]: SidEntry;
}
export interface SidsDataR {
  [sidName: string]: SidEntry;
}

export interface StarPoint {
  point_name: string;
  phase: "INITIAL" | "INTERMEDIATE" | "FINAL";
}

export interface StarEntry {
  runway: string;
  points: StarPoint[];
}

export interface StarsData {
  [starName: string]: StarEntry;
}

export interface StarsDataR {
  [starName: string]: StarEntry;
}

export interface VolumeEntry {
  lower_level: number;
  upper_level: number;
  points: string[];
}

/**
 * Décrit l'ensemble de volumes : les clés sont les noms des volumes,
 * et chaque clé pointe vers un objet VolumeEntry.
 */
export interface VolumesData {
  [volumeName: string]: VolumeEntry;
}

export interface VolumesDataR {
  [volumeName: string]: VolumeEntry;
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
  sids: SidsData | null;
  stars: StarsData | null;
  volumes: VolumesData;
  flights: FlightEntry[] | null;
}
export interface DataStateR {
  exercise: ExerciseDataR;
  geo_pts: GeoPtsDataR;
  airways: AirwaysDataR;
  sids: SidsDataR;
  stars: StarsDataR;
  volumes: VolumesDataR;
  flights: FlightEntryR[];
}

export interface VisibilityCategory {
  items: Record<string, boolean>;
  showLabels: boolean;
}
export interface VisibilityState {
  navpts: VisibilityCategory;
  outls: VisibilityCategory;
  airports: VisibilityCategory;
  airways: VisibilityCategory;
  sids: VisibilityCategory;
  stars: VisibilityCategory;
  sectors: VisibilityCategory;
  volumes: VisibilityCategory;
  flights: VisibilityCategory;
}
