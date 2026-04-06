import { Routes, Route } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="heading-display text-5xl text-gold mb-4">IIFF</h1>
        <p className="text-lg text-gray-400">
          Incheon International Film Festival — NextWave
        </p>
        <p className="mt-8 text-sm text-gray-500">
          Platform is being set up...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
