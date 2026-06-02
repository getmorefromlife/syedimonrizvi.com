import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AligilePage from "./pages/AligilePage";
import BooksPage from "./pages/BooksPage";
import PortfolioPage from "./pages/PortfolioPage";
import StudioPage from "./pages/StudioPage";
import ContactPage from "./pages/ContactPage";
import ToolsIndex from "./pages/ToolsIndex";
import VelocityPage from "./pages/VelocityPage";
import BurndownPage from "./pages/BurndownPage";
import CapacityPage from "./pages/CapacityPage";
import PlanningPokerPage from "./pages/PlanningPokerPage";
import WSJFPage from "./pages/WSJFPage";
import CostOfDelayPage from "./pages/CostOfDelayPage";
import EffortImpactPage from "./pages/EffortImpactPage";
import UserStoryMapPage from "./pages/UserStoryMapPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
          <Route path="/aligile" element={<><Navbar /><AligilePage /><Footer /></>} />
          <Route path="/books" element={<><Navbar /><BooksPage /><Footer /></>} />
          <Route path="/portfolio" element={<><Navbar /><PortfolioPage /><Footer /></>} />
          <Route path="/studio" element={<><Navbar /><StudioPage /><Footer /></>} />
          <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /></>} />
          <Route path="/tools" element={<ToolsIndex />} />
          <Route path="/tools/velocity" element={<VelocityPage />} />
          <Route path="/tools/burndown" element={<BurndownPage />} />
          <Route path="/tools/capacity" element={<CapacityPage />} />
          <Route path="/tools/planning-poker" element={<PlanningPokerPage />} />
          <Route path="/tools/wsjf" element={<WSJFPage />} />
          <Route path="/tools/cost-of-delay" element={<CostOfDelayPage />} />
          <Route path="/tools/effort-impact" element={<EffortImpactPage />} />
          <Route path="/tools/story-map" element={<UserStoryMapPage />} />
          <Route path="*" element={<><Navbar /><NotFound /><Footer /></>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
