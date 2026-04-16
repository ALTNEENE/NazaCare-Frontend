import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ToastContainer } from "@/components/ui/toast";
import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";
import { DiagnosisPage } from "@/pages/Diagnosis";
import { HistoryPage } from "@/pages/History";
import { HealthProfilePage } from "@/pages/HealthProfile";
import Landing from '@/pages/Landing';
import { LandingLayout } from "./layouts/LandingLayout";

export default function App() {
  return (
    <BrowserRouter>
      {/* Global toast notifications */}
      <ToastContainer />

      <Routes>

        {/* Auth routes (login / register) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>


        {/* Protected dashboard routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/health-profile" element={<HealthProfilePage />} />
          <Route path="/diagnosis" element={<DiagnosisPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        <Route element={<LandingLayout />}>
          <Route path="/landing" element={<Landing />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
