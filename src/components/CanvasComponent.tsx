import React, { useRef, useState, useEffect } from "react";
import Sidebar from "./Sidebar";

interface Bounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}
const zoomStep = [1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32];
let zoomIndex = 0;
let refScale: number,
  refOffsetX,
  refOffsetY,
  scale: number,
  offsetX: number,
  offsetY: number;

function calculateScaleAndOffset(
  bounds: Bounds,
  canvasWidth: number,
  canvasHeight: number
) {
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
function toX(xNm: number) {
  return xNm * scale + offsetX;
}
function fromX(x: number) {
  return (x - offsetX) / scale;
}
function toY(yNm: number) {
  return yNm * scale + offsetY;
}
function fromY(y: number) {
  return (y - offsetY) / scale;
}

const CanvasComponent = ({ data }) => {
  //const [fps, setFps] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const airways = Object.keys(data.airways);
  console.log("airways");
  console.log(data.airways);
  const visibility = useRef({
    airways: Object.assign({}, ...airways.map((k) => ({ [k]: true }))),
  });
  const pos = useRef([0, 0]);
  const fps = useRef(0);
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

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

    const draw = (ctx) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (data?.geo_pts?.proj) {
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
    const render = (time) => {
      const delta = time - lastTime;
      lastTime = time;
      // setFps(2+Math.round(1000 / delta));
      fps.current = Math.round(10000 / delta) / 10;
      draw(context);
      requestAnimationFrame(render);
    };
    const handleZoom = (event) => {
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
    const handleMouseDown = (e) => {
      if (e.button !== 1) return; // Vérifie que le bouton du milieu est enfoncé

      let startX = e.clientX;
      let startY = e.clientY;

      const handleMouseMove = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        // Mise à jour des offsets
        offsetX += dx;
        offsetY += dy;
        const bounds = data.exercise.bounds;
        const maxOffsetX = canvasRef.current.width / 2 - bounds.xMin * scale;
        offsetX = Math.min(offsetX, maxOffsetX);
        const minOffsetX = canvasRef.current.width / 2 - bounds.xMax * scale;
        offsetX = Math.max(offsetX, minOffsetX);
        const maxOffsetY = canvasRef.current.height / 2 - bounds.yMin * scale;
        offsetY = Math.min(offsetY, maxOffsetY);
        const minOffsetY = canvasRef.current.height / 2 - bounds.yMax * scale;
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

    const handleMouseMoveLatLong = (event) =>
      (pos.current = [fromX(event.clientX), fromY(event.clientY)]);
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    canvasRef.current.addEventListener("wheel", handleZoom);
    canvasRef.current.addEventListener("mousedown", handleMouseDown);
    canvasRef.current.addEventListener("mousemove", handleMouseMoveLatLong);
    console.log("requestAnimationFrame");
    requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("wheel", handleZoom);
        canvasRef.current.removeEventListener("mousedown", handleMouseDown);
        canvasRef.current.removeEventListener(
          "mousemove",
          handleMouseMoveLatLong
        );
      }
    };
  }, [data]); // Re-rend uniquement lorsque `data` change

  const updateVisibility = (newVisibility) => {
    Object.assign(visibility.current, newVisibility);
    let nb = 0;
    const airways = newVisibility.airways;
    for (const airway in airways) {
      if (airways[airway]) nb++;
    }
    console.log(`count=${nb}`);
  };

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "none",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        ☰
      </button>
      {isSidebarOpen && (
        <Sidebar
          visibility={visibility.current}
          updateVisibility={updateVisibility}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          margin: 0,
          padding: 0,
        }}
      />
    </>
  );
};

export default CanvasComponent;
