import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import SimulationList from "@/components/SimulationList";
import ExerciseList from "@/components/ExerciseList";
import TopBar from "@/components/TopBar";
import ExerciseVisualization from "@/components/ExerciseVisualization";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import LoginForm from "@/components/LoginForm";

import "./App.css";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuth()!;
  const location = useLocation();
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <TopBar />
                <SimulationList />
              </PrivateRoute>
            }
          />
          <Route
            path="/simulation/:simulationId"
            element={
              <PrivateRoute>
                <TopBar />
                <ExerciseList />
              </PrivateRoute>
            }
          />
          <Route
            path="/exercise/:simulationId/:exerciseId"
            element={
              <PrivateRoute>
                <TopBar />
                <ExerciseVisualization />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
