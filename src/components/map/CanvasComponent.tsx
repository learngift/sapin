import { useRef, useState, useEffect, RefObject } from "react";
import { DataStateR, VisibilityState } from "@/utils/types";
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
let refScale: number,
  refOffsetX: number,
  refOffsetY: number,
  scale: number,
  offsetX: number,
  offsetY: number;

function calculateScaleAndOffset(
  bounds: Bounds,
  canvasWidth: number,
  canvasHeight: number
): [number, number, number] {
  const dataWidth = bounds.xMax - bounds.xMin;
  const dataHeight = bounds.yMax - bounds.yMin;
  const ratioData = dataWidth / dataHeight;
  const ratioCanvas = canvasWidth / canvasHeight;

  if (ratioData > ratioCanvas) {
    const scale = canvasWidth / dataWidth;
    return [
      scale,
      -bounds.xMin * scale,
      (canvasHeight - dataHeight * scale) / 2 - bounds.yMin * scale,
    ];
  } else {
    const scale = canvasHeight / dataHeight;
    return [
      scale,
      (canvasWidth - dataWidth * scale) / 2 - bounds.xMin * scale,
      -bounds.yMin * scale,
    ];
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
  const airways = Object.keys(data.airways);
  console.log("airways", data.airways);
  const visibility = useRef<VisibilityState>({
    airways: Object.assign({}, ...airways.map((k) => ({ [k]: true }))),
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
      [refScale, refOffsetX, refOffsetY] = calculateScaleAndOffset(
        data.exercise.bounds,
        canvas.width,
        canvas.height
      );
      scale = refScale * zoomStep[zoomIndex];
      if (zoomIndex === 0) {
        offsetX = refOffsetX;
        offsetY = refOffsetY;
      }
      //draw(context);
    };

    const draw = (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (data.geo_pts.proj) {
        const triangleChar = "▲";
        ctx.fillStyle = "blue";
        ctx.font = `10px sans-serif`;
        const pts = data.geo_pts;
        for (const k in pts.nav) {
          const [x, y] = pts.proj[k];
          ctx.fillText(triangleChar, toX(x), toY(y));
        }
        for (const k in pts.nav) {
          const [x, y] = pts.proj[k];
          ctx.fillText(k, toX(x) + 8, toY(y) - 5);
        }
        ctx.fillStyle = "black";
        const latLong = data.exercise.proj.stereo2geo(pos.current);
        ctx.fillText(
          `${data.exercise.proj.formatLatLon(latLong)}   ${fps.current} fps`,
          10,
          ctx.canvas.height - 10
        );

        // console.log(`draw ${toX(x)} ${toY(y)}`);
        //ctx.beginPath();
        //ctx.arc(x, y, 5, 0, 2 * Math.PI);
        //ctx.fill();
        if (data.airways) {
          ctx.strokeStyle = "#F00";
          ctx.beginPath();
          let first_log = false;
          for (const k in data.airways) {
            if (visibility.current.airways[k] === false) continue;
            const airway = data.airways[k];
            for (let i = 0; i < airway.length; i++) {
              if (airway[i] in pts.proj) {
                const [x, y] = pts.proj[airway[i]];
                if (i == 0) {
                  ctx.moveTo(toX(x), toY(y));
                } else {
                  ctx.lineTo(toX(x), toY(y));
                }
              } else if (first_log) {
                first_log = false;
                console.log(airway);
                console.log(`point ${airway[i]} not found`);
              }
            }
          }
          ctx.stroke();
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

      const newZoom =
        event.deltaY < 0
          ? Math.min(zoomIndex + 1, zoomStep.length - 1)
          : Math.max(zoomIndex - 1, 0);

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

    const handleMouseMoveLatLong = (event: MouseEvent) =>
      (pos.current = [fromX(event.clientX), fromY(event.clientY)]);
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
    let nb = 0;
    const airways = newVisibility.airways;
    for (const airway in airways) {
      if (airways[airway]) nb++;
    }
    console.log(`count=${nb}`);
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
        className={`fixed top-16 left-0 w-48 h-[calc(100%-6.5rem)] bg-white dark:bg-gray-900 shadow-lg p-2 space-y-3 mt-8 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-40`}
      >
        <SideBar
          visibility={visibility.current}
          updateVisibility={updateVisibility}
        />
      </div>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full border-none m-0 p-0"
      />
    </>
  );
};

export default CanvasComponent;
