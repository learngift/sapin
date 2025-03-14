import { useRef, useState, useEffect, RefObject } from "react";
import { DataStateR, SectorDataR, VisibilityState } from "@/utils/types";
import { Button } from "@/components/ui/button";
import SideBar from "./SideBar";

interface Bounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}
const zoomStep = [1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32];
let zoomIndex = 0;
let refScale: number, refOffsetX: number, refOffsetY: number, scale: number, offsetX: number, offsetY: number;

const hasNoErrorOrWarning = (obj?: { error?: string; warning?: string }) => !obj?.error && !obj?.warning;

function calculateScaleAndOffset(bounds: Bounds, canvasWidth: number, canvasHeight: number): [number, number, number] {
  const dataWidth = bounds.xMax - bounds.xMin;
  const dataHeight = bounds.yMax - bounds.yMin;
  const ratioData = dataWidth / dataHeight;
  const ratioCanvas = canvasWidth / canvasHeight;

  if (ratioData > ratioCanvas) {
    const scale = canvasWidth / dataWidth;
    return [scale, -bounds.xMin * scale, (canvasHeight - dataHeight * scale) / 2 - bounds.yMin * scale];
  } else {
    const scale = canvasHeight / dataHeight;
    return [scale, (canvasWidth - dataWidth * scale) / 2 - bounds.xMin * scale, -bounds.yMin * scale];
  }
}
function toX(xNm: number): number {
  return xNm * scale + offsetX;
}
function fromX(x: number): number {
  return (x - offsetX) / scale;
}
function toY(yNm: number): number {
  return yNm * scale + offsetY;
}
function fromY(y: number): number {
  return (y - offsetY) / scale;
}

interface CanvasComponentProps {
  data: DataStateR;
}

const CanvasComponent = ({ data }: CanvasComponentProps) => {
  //const [fps, setFps] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const toRecordStringBoolean = (o: object, b: boolean) =>
    Object.assign({}, ...Object.keys(o).map((k) => ({ [k]: b })));
  const visibility = useRef<VisibilityState>({
    navpts: { showLabels: false, items: toRecordStringBoolean(data.geo_pts.nav, true) },
    outls: { showLabels: false, items: toRecordStringBoolean(data.geo_pts.outl, false) },
    airports: { showLabels: false, items: toRecordStringBoolean(data.airports, false) },
    runways: { showLabels: false, showPoints: false, items: toRecordStringBoolean(data.runways, true) },
    sids: { showLabels: false, showPoints: false, items: toRecordStringBoolean(data.sids, false) },
    stars: { showLabels: false, showPoints: false, items: toRecordStringBoolean(data.stars, false) },
    airways: { showLabels: false, showPoints: false, items: toRecordStringBoolean(data.airways, false) },
    volumes: { showLabels: false, showPoints: false, items: toRecordStringBoolean(data.volumes, false) },
    sectors: { showLabels: false, items: toRecordStringBoolean(data.sectors, false) },
    flights: {
      showLabels: false,
      showPoints: false,
      items: Object.assign({}, ...data.flights.map((k) => ({ [k.callsign]: false }))),
    },
  });
  const pos = useRef<[number, number]>([0, 0]);
  const fps = useRef<number>(0);
  const canvasRef: RefObject<HTMLCanvasElement | null> = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      [refScale, refOffsetX, refOffsetY] = calculateScaleAndOffset(data.exercise.bounds, canvas.width, canvas.height);
      scale = refScale * zoomStep[zoomIndex];
      if (zoomIndex === 0) {
        offsetX = refOffsetX;
        offsetY = refOffsetY;
      }
      //draw(context);
    };

    const draw = (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dm = document.documentElement.classList.contains("dark");
      const cp = [
        "#5C5757", // 0
        "#767879",
        "#767879",
        "#6B6B6B",
        "#767879", // 4
        "#63575C",
        "#7A7376",
        "#7A7376",
        "#BFBFBF", // 8
        "#7A7376",
        "#BFBFBF",
        "#7AC372",
        "#2020C2", // 12
        "#63575C",
        "#000000",
        "#FFFF0",
        "#FFFFFF", // 16
      ];
      const fpsColor = dm ? cp[16] : cp[14];
      const geoPtsSymbolColor = dm ? cp[7] : cp[0];
      const airwayColor = dm ? cp[6] : cp[5];
      const sidColor = dm ? cp[11] : cp[5];
      const starColor = dm ? cp[12] : cp[5];
      const runwayColor = dm ? cp[16] : cp[14];
      const volumeColor = dm ? cp[13] : cp[5];
      const volumeFillColor = dm ? "#222" : "#ccc";
      const flightColor = dm ? cp[16] : cp[14];
      const triangleChar = "▲";

      const pts = data.geo_pts;
      // console.log(`draw ${toX(x)} ${toY(y)}`);
      //ctx.beginPath();
      //ctx.arc(x, y, 5, 0, 2 * Math.PI);
      //ctx.fill();
      const drawLineOfPoints = (way: string[]) => {
        for (let i = 0; i < way.length; i++) {
          if (way[i] in pts.proj) {
            const [x, y] = pts.proj[way[i]];
            if (i == 0) {
              ctx.moveTo(toX(x), toY(y));
            } else {
              ctx.lineTo(toX(x), toY(y));
            }
          }
        }
      };
      const forcedPtsSet = new Set<string>();
      if (visibility.current.airways.showPoints)
        for (const k in data.airways)
          if (visibility.current.airways.items[k]) for (const p of data.airways[k].points) forcedPtsSet.add(p);
      if (visibility.current.sids.showPoints)
        for (const k in data.sids)
          if (visibility.current.sids.items[k]) for (const p of data.sids[k].points) forcedPtsSet.add(p);
      if (visibility.current.stars.showPoints)
        for (const k in data.stars)
          if (visibility.current.stars.items[k]) for (const p of data.stars[k].points) forcedPtsSet.add(p.point_name);
      if (visibility.current.flights.showPoints)
        for (const f of data.flights)
          if (visibility.current.flights.items[f.callsign]) for (const p of f.points.points) forcedPtsSet.add(p);

      // Sectors
      const forcedVolumeSet = new Set<string>();
      for (const k in data.sectors) {
        if (visibility.current.sectors.items[k]) {
          const sector: SectorDataR = data.sectors[k];
          for (const v of sector.volumes) {
            forcedVolumeSet.add(v);
          }
          if (visibility.current.volumes.showPoints) {
            for (const l of sector.lines) {
              for (const p of l) {
                forcedPtsSet.add(p);
              }
            }
          }
        }
      }
      // Volumes
      ctx.fillStyle = volumeFillColor;
      for (const k in data.volumes) {
        if (visibility.current.volumes.items[k] || forcedVolumeSet.has(k)) {
          ctx.beginPath();
          drawLineOfPoints(data.volumes[k].points);
          ctx.closePath();
          ctx.fill();
        }
        if (visibility.current.volumes.showPoints && visibility.current.volumes.items[k]) {
          for (const p of data.volumes[k].points) forcedPtsSet.add(p);
        }
      }
      ctx.strokeStyle = volumeColor;
      for (const k in data.volumes) {
        if (visibility.current.volumes.items[k]) {
          ctx.beginPath();
          drawLineOfPoints(data.volumes[k].points);
          ctx.closePath();
          ctx.stroke();
        }
      }
      // Sector
      ctx.beginPath();
      for (const k in data.sectors) {
        if (visibility.current.sectors.items[k]) {
          const sector: SectorDataR = data.sectors[k];
          for (const l of sector.lines) {
            drawLineOfPoints(l);
          }
        }
      }
      ctx.stroke();
      //
      ctx.fillStyle = geoPtsSymbolColor;
      ctx.font = `11px sans-serif`;
      for (const k in data.volumes) {
        if (visibility.current.volumes.items[k]) {
          const [x, y] = data.volumes[k].center;
          ctx.fillText(k, toX(x) - 3, toY(y) + 1);
        }
      }
      for (const k in data.sectors) {
        if (visibility.current.sectors.items[k]) {
          const [x, y] = data.sectors[k].center;
          ctx.fillText(k, toX(x) - 3, toY(y) + 1);
        }
      }
      // outls
      ctx.fillStyle = volumeColor;
      ctx.font = `7px sans-serif`;
      for (const k in pts.outl) {
        if (visibility.current.outls.items[k] || forcedPtsSet.has(k)) {
          const [x, y] = pts.proj[k];
          ctx.fillText(triangleChar, toX(x) - 3, toY(y) + 1);
        }
      }
      if (visibility.current.outls.showLabels) {
        ctx.font = `10px sans-serif`;
        for (const k in pts.outl) {
          if (visibility.current.outls.items[k] || forcedPtsSet.has(k)) {
            const [x, y] = pts.proj[k];
            ctx.fillText(k, toX(x) + 8, toY(y) - 5);
          }
        }
      }

      // Nav points
      ctx.fillStyle = geoPtsSymbolColor;
      ctx.font = `10px sans-serif`;
      for (const k in pts.nav) {
        if (visibility.current.navpts.items[k] || forcedPtsSet.has(k)) {
          const [x, y] = pts.proj[k];
          ctx.fillText(triangleChar, toX(x) - 4, toY(y) + 2);
        }
      }
      if (visibility.current.navpts.showLabels)
        for (const k in pts.nav) {
          if (visibility.current.navpts.items[k] || forcedPtsSet.has(k)) {
            const [x, y] = pts.proj[k];
            ctx.fillText(k, toX(x) + 8, toY(y) - 5);
          }
        }
      // Airports
      ctx.fillStyle = geoPtsSymbolColor;
      ctx.font = `10px sans-serif`;
      for (const k in data.airports) {
        if (visibility.current.airports.items[k]) {
          const [x, y] = data.airports[k].proj;
          ctx.fillText("⊗", toX(x) - 4, toY(y) + 2);
        }
      }
      if (visibility.current.airports.showLabels)
        for (const k in data.airports) {
          if (visibility.current.airports.items[k]) {
            const [x, y] = data.airports[k].proj;
            ctx.fillText(k, toX(x) + 8, toY(y) - 5);
          }
        }

      // lat long
      ctx.fillStyle = fpsColor;
      const latLong = data.exercise.proj.stereo2geo(pos.current);
      ctx.fillText(`${data.exercise.proj.formatLatLon(latLong)}   ${fps.current} fps`, 10, ctx.canvas.height - 2);

      // Airways
      ctx.strokeStyle = airwayColor;
      ctx.beginPath();
      for (const k in data.airways) {
        if (visibility.current.airways.items[k]) drawLineOfPoints(data.airways[k].points);
      }
      ctx.stroke();
      if (visibility.current.airways.showLabels) {
        ctx.fillStyle = airwayColor;
        for (const k in data.airways) {
          if (visibility.current.airways.items[k]) {
            const ps = data.airways[k].points;
            const [x, y] = pts.proj[ps[ps.length - 1]];
            const [xx, yy] = pts.proj[ps[0]];
            // display the name near the first point and near last point
            ctx.fillText(k, toX(x) + 8, toY(y) - 10);
            ctx.fillText(k, toX(xx) + 8, toY(yy) - 10);
          }
        }
      }
      // SIDs
      ctx.strokeStyle = sidColor;
      ctx.beginPath();
      for (const k in data.sids) {
        if (visibility.current.sids.items[k]) drawLineOfPoints(data.sids[k].points);
      }
      ctx.stroke();
      if (visibility.current.sids.showLabels) {
        ctx.fillStyle = sidColor;
        for (const k in data.sids) {
          if (visibility.current.sids.items[k]) {
            const ps = data.sids[k].points;
            const [x, y] = pts.proj[ps[ps.length - 1]];
            ctx.fillText(k, toX(x) + 8, toY(y) - 10);
          }
        }
      }
      // STARs
      ctx.strokeStyle = starColor;
      ctx.beginPath();
      for (const k in data.stars) {
        if (visibility.current.stars.items[k]) drawLineOfPoints(data.stars[k].points.map((p) => p.point_name));
      }
      ctx.stroke();
      if (visibility.current.stars.showLabels) {
        ctx.fillStyle = starColor;
        for (const k in data.stars) {
          if (visibility.current.stars.items[k]) {
            const [x, y] = pts.proj[data.stars[k].points[0].point_name];
            ctx.fillText(k, toX(x) + 8, toY(y) - 10);
          }
        }
      }
      // runways
      ctx.strokeStyle = runwayColor;
      ctx.beginPath();
      for (const k in data.runways) {
        if (visibility.current.runways.items[k]) {
          const r = data.runways[k];
          if (hasNoErrorOrWarning(r)) {
            ctx.moveTo(toX(r.proj![0]), toY(r.proj![1]));
            ctx.lineTo(toX(r.proj1![0]), toY(r.proj1![1]));
          }
        }
      }
      ctx.stroke();
      if (visibility.current.runways.showLabels) {
        ctx.fillStyle = runwayColor;
        for (const k in data.runways) {
          if (visibility.current.runways.items[k]) {
            const r: [number, number] = data.runways[k].proj!;
            ctx.fillText(k, toX(r[0]) + 8, toY(r[1]) - 10);
          }
        }
      }
      // flights
      ctx.strokeStyle = flightColor;
      ctx.beginPath();
      for (const f of data.flights) {
        if (visibility.current.flights.items[f.callsign]) {
          drawLineOfPoints(f.points.points);
        }
      }
      ctx.stroke();
      if (visibility.current.flights.showLabels) {
        ctx.font = `12px sans-serif`;
        ctx.fillStyle = flightColor;
        for (const f of data.flights) {
          if (visibility.current.flights.items[f.callsign]) {
            const [x, y] = pts.proj[f.points.points[0]];
            ctx.fillText(f.callsign, toX(x) + 8, toY(y) - 10);
          }
        }
      }
    };
    let lastTime = 0;
    const render = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      // setFps(2+Math.round(1000 / delta));
      fps.current = Math.round(10000 / delta) / 10;
      draw(context);
      requestAnimationFrame(render);
    };
    const handleZoom = (event: WheelEvent) => {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;

      const newZoom = event.deltaY < 0 ? Math.min(zoomIndex + 1, zoomStep.length - 1) : Math.max(zoomIndex - 1, 0);

      if (newZoom === zoomIndex) return;
      zoomIndex = newZoom;
      if (zoomIndex === 0) {
        resizeCanvas();
        return;
      }

      const xGraph = fromX(mouseX);
      const yGraph = fromY(mouseY);
      scale = refScale * zoomStep[zoomIndex];
      offsetX += mouseX - toX(xGraph);
      offsetY += mouseY - toY(yGraph);
      const startTime = performance.now();
      // draw(context);
      console.log(`Redraw duration : ${performance.now() - startTime} ms`);
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 1) return; // Vérifie que le bouton du milieu est enfoncé

      let startX = e.clientX;
      let startY = e.clientY;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        // Mise à jour des offsets
        offsetX += dx;
        offsetY += dy;
        const bounds = data.exercise.bounds;
        const maxOffsetX = canvasRef.current!.width / 2 - bounds.xMin * scale;
        offsetX = Math.min(offsetX, maxOffsetX);
        const minOffsetX = canvasRef.current!.width / 2 - bounds.xMax * scale;
        offsetX = Math.max(offsetX, minOffsetX);
        const maxOffsetY = canvasRef.current!.height / 2 - bounds.yMin * scale;
        offsetY = Math.min(offsetY, maxOffsetY);
        const minOffsetY = canvasRef.current!.height / 2 - bounds.yMax * scale;
        offsetY = Math.max(offsetY, minOffsetY);
        // draw(context);

        // Mise à jour des coordonnées de départ
        startX = moveEvent.clientX;
        startY = moveEvent.clientY;
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMoveLatLong = (event: MouseEvent) => (pos.current = [fromX(event.clientX), fromY(event.clientY)]);
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("wheel", handleZoom);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMoveLatLong);
    console.log("requestAnimationFrame");
    requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (canvas) {
        canvas.removeEventListener("wheel", handleZoom);
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMoveLatLong);
      }
    };
  }, [data]); // Re-rend uniquement lorsque `data` change

  const updateVisibility = (newVisibility: VisibilityState) => {
    Object.assign(visibility.current, newVisibility);
  };

  //const sty = { height: "calc(100vh - 6.5rem)" };
  //style={sty}
  return (
    <>
      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        variant="ghost"
        size="icon"
        className="fixed top-16 left-4 z-50 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-md"
      >
        ☰
      </Button>
      <div
        className={`fixed top-16 left-0 w-48 h-[calc(100%-6.9rem)] bg-white dark:bg-gray-900 shadow-lg p-2 space-y-3 mt-8 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-40`}
      >
        <SideBar visibility={visibility.current} updateVisibility={updateVisibility} dataR={data} />
      </div>
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full border-none m-0 p-0" />
    </>
  );
};

export default CanvasComponent;
