import ThemeSwitcher from "@/components/ThemeSwitcher";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SimulationList from "@/components/SimulationList";
import ExerciseList from "@/components/ExerciseList";
import ExerciseVisualization from "@/components/ExerciseVisualization";
import "./App.css";

function App() {
  return (
    <>
      <ThemeSwitcher />
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
