import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard";
import VehicleDetail from "./pages/VehicleDetail"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>} />
      <Route path="/vehicles/:id" element={
        <ProtectedRoute>
          <VehicleDetail />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
