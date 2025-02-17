import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SimulationList from "@/components/SimulationList";
import ExerciseList from "@/components/ExerciseList";
import ExerciseVisualization from "@/components/ExerciseVisualization";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SimulationList />} />
          <Route path="/simulation/:simulationId" element={<ExerciseList />} />
          <Route
            path="/exercise/:simulationId/:exerciseId"
            element={<ExerciseVisualization />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
