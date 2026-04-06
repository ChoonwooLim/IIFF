import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/Home/HomePage";
import PresentationPage from "@/pages/Presentation/PresentationPage";
import DocsPage from "@/pages/Docs/DocsPage";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import PendingPage from "@/pages/Auth/PendingPage";
import ProfileCompletePage from "@/pages/Auth/ProfileCompletePage";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/pending" element={<PendingPage />} />
      <Route path="/complete-profile" element={<ProfileCompletePage />} />

      {/* Main site routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/presentation" element={<PresentationPage />} />
        <Route path="/docs" element={<DocsPage />} />
      </Route>
    </Routes>
  );
}
