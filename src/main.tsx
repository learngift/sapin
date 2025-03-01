import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

if (import.meta.env.MODE === "development") {
  const { makeServer } = await import("@/mirage-server");
  makeServer({ environment: "development" });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
