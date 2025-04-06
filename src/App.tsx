import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import AppNavbar from "./components/mui-component/AppNavbar";
import SideMenu from "./components/mui-component/SideMenu";
import AppTheme from "./components/shared-theme/AppTheme";
import Dashboard from "./pages/Dashboard";
import EducationExpenditure from "./pages/EducationExpenditure";
import GdpGrowth from "./pages/GdpGrowth";
import PopulationGrowth from "./pages/PopulationGrowth";
import Inflation from "./pages/Inflation";
import LaborForce from "./pages/LaborForce";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout component for authenticated routes
const AuthenticatedLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <SideMenu />
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <AppNavbar />
        <Box component="main" sx={{ p: 3, mt: 8, ml: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/education-expenditure"
              element={<EducationExpenditure />}
            />
            <Route path="/gdp-growth" element={<GdpGrowth />} />
            <Route path="/population-growth" element={<PopulationGrowth />} />
            <Route path="/inflation" element={<Inflation />} />
            <Route path="/labor-force" element={<LaborForce />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

// Main app with routing logic
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<AuthenticatedLayout />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <AppRoutes />
        </AppTheme>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
