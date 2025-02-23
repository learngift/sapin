import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { makeServer } from "@/mirage-server";
import "./index.css";
import App from "./App.tsx";

makeServer({ environment: "development" });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
