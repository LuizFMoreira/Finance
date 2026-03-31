import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Goals from "@/pages/Goals";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page (tema escuro) */}
        <Route path="/" element={<LandingPage />} />

        {/* App logado (tema claro) */}
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="goals" element={<Goals />} />
          <Route path="app" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
