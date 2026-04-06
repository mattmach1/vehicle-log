import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard";
import VehicleDetail from "./pages/VehicleDetail"
import ProtectedRoute from "./components/ProtectedRoute"
import Register from "./pages/Register";
import { ThemeProvider } from "@/components/theme-provider";

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/register" element={<Register />} />
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
    </ThemeProvider>
  )
}

export default App
