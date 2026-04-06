import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/Home/HomePage";
import PresentationPage from "@/pages/Presentation/PresentationPage";
import DocsPage from "@/pages/Docs/DocsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/presentation" element={<PresentationPage />} />
        <Route path="/docs" element={<DocsPage />} />
      </Route>
    </Routes>
  );
}
