import {
  DataKey,
  LoadStatus,
  DataState,
  DataStateR,
  ExerciseDataR,
  GeoPtsDataR,
  AirportDataR,
  RunwayData,
  RunwayDataR,
  SidEntry,
  SidEntryR,
  SidsDataR,
  StarPoint,
  StarEntry,
  StarEntryR,
  StarsDataR,
  AirwaysEntryR,
  FlightEntryR,
  VolumesDataR,
  VolumeEntry,
  VolumeEntryR,
  SectorDataR,
} from "@/utils/types";
import Projection, { translate, centerAndArea } from "@/utils/Projection";
//import { Geometry } from "@/utils/Geometry";

const isInvalidNumber = (v: unknown): boolean => typeof v !== "number" || isNaN(v);

// after reception of all data, we process it
// setProgress is used to update the loading status
export function processData(
  data: DataState,
  setProgress: React.Dispatch<React.SetStateAction<Record<DataKey, LoadStatus>>>
): DataStateR {
  let projection: Projection;
  const pc = data.exercise?.proj_center;
  if (pc) {
    const point = data.geo_pts?.nav[pc] || data.geo_pts?.outl[pc];
    if (point === undefined) {
      console.log(`setProgress geo_pts error parsing`);
      setProgress((prev) => ({ ...prev, geo_pts: "error parsing" }));
      throw new Error("Projection center not found");
    }
    projection = new Projection(point);
  } else {
    projection = new Projection();
  }
  const all_pts = [...Object.entries(data.geo_pts?.nav ?? {}), ...Object.entries(data.geo_pts?.outl ?? {})];
  const new_geo_pts: GeoPtsDataR = {
    nav: data.geo_pts!.nav,
    outl: data.geo_pts!.outl,
    proj: Object.fromEntries(all_pts.map(([k, v]) => [k, projection.geo2stereo(v)])),
  };
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
  const new_exercise: ExerciseDataR = {
    proj_center: data.exercise!.proj_center || "",
    proj: projection,
    bounds: bounds,
  };

  const new_flights: FlightEntryR[] = data.flights!.map((flight) => ({
    ...flight,
    points: {
      star: flight.points.star,
      sid: flight.points.sid,
      points: flight.points.points.filter((p) => p !== null),
    },
  }));

  const airportDataToR = ([k, v]: [string, [number, number]]) => {
    return [k, { ...v, proj: projection.geo2stereo(v) }];
  };
  const new_airports: Record<string, AirportDataR> = Object.fromEntries(
    Object.entries(data.airports!).map(airportDataToR)
  );

  const runwayDataToR = ([k, v]: [string, RunwayData]): [string, RunwayDataR] => {
    try {
      let latlong = new_geo_pts.nav[v.point];
      if (latlong === undefined) {
        throw new Error(`Missing runway threshold ${v.point}`);
      } else if (isInvalidNumber(v.length) || isInvalidNumber(v.heading)) {
        throw new Error(`Invalid length or heading ${v.length} ${v.heading}`);
      }
      latlong = translate(latlong, v.length / 1852, v.heading);
      const proj = new_geo_pts.proj[v.point];
      return [k, { ...v, proj: proj, proj1: projection.geo2stereo(latlong) }];
    } catch (error) {
      return [k, { ...v, error: (error as Error).message }];
    }
  };
  const new_runways: Record<string, RunwayDataR> = Object.fromEntries(Object.entries(data.runways!).map(runwayDataToR));

  const sidDataToR = ([k, v]: [string, SidEntry]): [string, SidEntryR] => {
    let error = "";
    const pts: string[] = [];
    for (const pt of v.points) {
      if (pt in new_geo_pts.proj) pts.push(pt);
      else error = error + `missing point ${pt} `;
    }
    return [k, { ...v, points: pts, tip: v.runway + " - " + v.points.join(" "), error: error || undefined }];
  };
  const new_sids: SidsDataR = Object.fromEntries(Object.entries(data.sids!).map(sidDataToR));

  const starDataToR = ([k, v]: [string, StarEntry]): [string, StarEntryR] => {
    let error = "";
    const pts: StarPoint[] = [];
    for (const pt of v.points) {
      if (pt.point_name in new_geo_pts.proj) pts.push(pt);
      else error = error + `missing point ${pt.point_name} `;
    }
    return [k, { ...v, points: pts, tip: v.points.map((e) => e.point_name).join(" ") + " - " + v.runway }];
  };
  const new_stars: StarsDataR = Object.fromEntries(Object.entries(data.stars!).map(starDataToR));

  const airwayDataToR = ([k, v]: [string, string[]]): [string, AirwaysEntryR] => {
    return [k, { points: v!, tip: v.join(" ") }];
  };
  const new_airways: Record<string, AirwaysEntryR> = Object.fromEntries(
    Object.entries(data.airways!).map(airwayDataToR)
  );

  const volumesDataToR = ([k, v]: [string, VolumeEntry]): [string, VolumeEntryR] => {
    let pts = v.points;
    const [c, a] = centerAndArea(pts.map((p) => new_geo_pts.proj[p]));
    if (a < 0) pts = pts.slice().reverse();
    return [
      k,
      {
        ...v,
        tip: v.lower_level + "-" + v.upper_level + ":" + pts.join(" "),
        center: c,
        area: Math.abs(a) * (v.upper_level - v.lower_level),
        points: pts,
      },
    ];
  };
  const new_volumes: VolumesDataR = Object.fromEntries(Object.entries(data.volumes!).map(volumesDataToR));

  interface Segments {
    [Key: string]: Set<string>;
  }
  const sectorDataToR = ([k, v]: [string, [string]]): [string, SectorDataR] => {
    const allSegments: Segments = {};
    let totalArea = 0,
      x = 0,
      y = 0;
    for (const name of v) {
      const volume = new_volumes[name];
      const n = volume.points.length;
      for (let i = 0; i < n; i++) {
        (allSegments[volume.points[i]] ??= new Set()).add(volume.points[(i + 1) % n]);
      }
      totalArea += volume.area;
      x += volume.center[0] * volume.area;
      y += volume.center[1] * volume.area;
    }
    const lines: Record<string, string[]> = {};
    for (const p1 in allSegments) {
      for (const p2 of allSegments[p1]) {
        if (!allSegments[p2]?.has(p1)) {
          lines[p1] = [p2, ...(lines[p2] ?? [])];
        }
      }
    }
    for (const k in lines) {
      const a = lines[k];
      let end = a[a.length - 1];
      while (end in lines) {
        a.push(...lines[end]);
        delete lines[end];
        end = a[a.length - 1];
      }
    }
    return [
      k,
      {
        volumes: v,
        center: [x / totalArea, y / totalArea],
        lines: Object.entries(lines).map(([p, v]) => [p, ...v]),
        tip: v.map((e) => e + ":" + new_volumes[e].lower_level + "-" + new_volumes[e].upper_level).join(" "),
      },
    ];
  };
  const new_sectors: Record<string, SectorDataR> = Object.fromEntries(Object.entries(data.sectors!).map(sectorDataToR));

  return {
    exercise: new_exercise,
    geo_pts: new_geo_pts,
    airports: new_airports,
    runways: new_runways,
    airways: new_airways,
    sids: new_sids,
    stars: new_stars,
    volumes: new_volumes,
    sectors: new_sectors,
    flights: new_flights,
  };
}

/**
 * ✅ Supprime les valeurs `null` des objets.
 */
// function removeNulls<T>(obj: Record<string, T | null>): Record<string, T> {
//   return Object.fromEntries(Object.entries(obj).filter((entry): entry is [string, T] => entry[1] !== null));
// }
