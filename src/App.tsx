import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import HomePage from "./pages/HomePage";
import AudioNarrativesPage from "./pages/AudioNarrativesPage";
import ArchivePage from "./pages/ArchivePage";
import SurvivalPage from "./pages/SurvivalPage";
import EpiloguePage from "./pages/EpiloguePage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
		<Navbar />
        <Routes>

          {/* TEMP: keep your current working page */}
          <Route path="/" element={<HomePage />} />

          {/* NEW ROUTES */}
          <Route path="/audio" element={<AudioNarrativesPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/survival" element={<SurvivalPage />} />
          <Route path="/epilogue" element={<EpiloguePage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


