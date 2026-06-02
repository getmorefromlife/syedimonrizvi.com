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
import WIPLimitPage from "./pages/WIPLimitPage";
import LeadTimeScatterPage from "./pages/LeadTimeScatterPage";
import ValueStreamPage from "./pages/ValueStreamPage";
import CycleVsLeadTimePage from "./pages/CycleVsLeadTimePage";
import BlockerLogPage from "./pages/BlockerLogPage";
import RACIChartPage from "./pages/RACIChartPage";
import DependenciesMatrixPage from "./pages/DependenciesMatrixPage";
import StakeholderSaliencePage from "./pages/StakeholderSaliencePage";
import TeamHealthCheckPage from "./pages/TeamHealthCheckPage";
import OKRTrackerPage from "./pages/OKRTrackerPage";
import DefinitionOfDonePage from "./pages/DefinitionOfDonePage";
import DecisionLogPage from "./pages/DecisionLogPage";
import LessonsLearnedPage from "./pages/LessonsLearnedPage";
import EscapedDefectsPage from "./pages/EscapedDefectsPage";
import SprintReviewCollectorPage from "./pages/SprintReviewCollectorPage";
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
          <Route path="/tools/wip-limit" element={<WIPLimitPage />} />
          <Route path="/tools/lead-time-scatter" element={<LeadTimeScatterPage />} />
          <Route path="/tools/value-stream" element={<ValueStreamPage />} />
          <Route path="/tools/cycle-vs-lead" element={<CycleVsLeadTimePage />} />
          <Route path="/tools/blocker-log" element={<BlockerLogPage />} />
          <Route path="/tools/raci" element={<RACIChartPage />} />
          <Route path="/tools/dependencies" element={<DependenciesMatrixPage />} />
          <Route path="/tools/stakeholder-salience" element={<StakeholderSaliencePage />} />
          <Route path="/tools/team-health" element={<TeamHealthCheckPage />} />
          <Route path="/tools/okr-tracker" element={<OKRTrackerPage />} />
          <Route path="/tools/definition-of-done" element={<DefinitionOfDonePage />} />
          <Route path="/tools/decision-log" element={<DecisionLogPage />} />
          <Route path="/tools/lessons-learned" element={<LessonsLearnedPage />} />
          <Route path="/tools/escaped-defects" element={<EscapedDefectsPage />} />
          <Route path="/tools/sprint-review-feedback" element={<SprintReviewCollectorPage />} />
          <Route path="*" element={<><Navbar /><NotFound /><Footer /></>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
