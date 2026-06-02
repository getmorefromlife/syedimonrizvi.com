import { motion } from "framer-motion";
import {
  TrendingUp, LineChart, Users, ClipboardList, BarChart3,
  GitBranch, Calendar, AlertTriangle, CheckSquare,
  Shirt, Timer, HeartPulse, Layers, MessageSquare, Gauge,
  ArrowRight, Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ToolEntry {
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  built: boolean;
}

const tools: ToolEntry[] = [
  { title: "Velocity Calculator", desc: "Track sprint velocity, compute averages, and forecast backlog completion.", icon: TrendingUp, href: "/tools/velocity", built: true },
  { title: "Burndown Chart", desc: "Generate ideal vs. actual burndown charts and export as PNG for standups.", icon: LineChart, href: "/tools/burndown", built: true },
  { title: "Sprint Capacity", desc: "Calculate team capacity with per-member PTO, meetings, and focus factor.", icon: Users, href: "/tools/capacity", built: true },
  { title: "Planning Poker", desc: "Estimate collaboratively with Fibonacci cards, reveal results, and build consensus.", icon: ClipboardList, href: "/tools/planning-poker", built: true },
  { title: "WSJF Calculator", desc: "Prioritise backlog items by economic value per unit of effort (SAFe WSJF).", icon: BarChart3, href: "/tools/wsjf", built: true },
  { title: "Cost of Delay Calculator", desc: "Quantify the economic impact of delaying features across three dimensions.", icon: Calendar, href: "/tools/cost-of-delay", built: true },
  { title: "Effort vs. Impact Matrix", desc: "Plot initiatives on a 2×2 grid to identify quick wins and avoid low-value work.", icon: AlertTriangle, href: "/tools/effort-impact", built: true },
  { title: "User Story Map", desc: "Visualise the user journey across activities and organise stories by priority.", icon: GitBranch, href: "/tools/story-map", built: true },
  { title: "Sprint Planner", desc: "Drag-and-drop organise backlog items into sprint iterations.", icon: ClipboardList, href: "/tools/sprint-planner", built: false },
  { title: "Cycle Time Histogram", desc: "Analyse the distribution of cycle times across completed work items.", icon: BarChart3, href: "/tools/cycle-time", built: false },
  { title: "Cumulative Flow Diagram", desc: "Visualise WIP across workflow stages to spot bottlenecks.", icon: GitBranch, href: "/tools/cumulative-flow", built: false },
  { title: "Release Planner", desc: "Map epics and features to releases across multiple sprints.", icon: Calendar, href: "/tools/release-planner", built: false },
  { title: "Risk Matrix", desc: "Plot risks by probability and impact to prioritise mitigation.", icon: AlertTriangle, href: "/tools/risk-matrix", built: false },
  { title: "MoSCoW Prioritiser", desc: "Categorise requirements into Must / Should / Could / Won't have.", icon: CheckSquare, href: "/tools/moscow", built: false },
  { title: "T-Shirt Sizer", desc: "Convert t-shirt sizes (XS–XL) into rough story-point ranges.", icon: Shirt, href: "/tools/tshirt-sizer", built: false },
  { title: "Daily Standup Timer", desc: "Keep standups tight with per-person timeboxing and rounds.", icon: Timer, href: "/tools/standup-timer", built: false },
  { title: "Team Health Check", desc: "Run a quick morale and health radar with your team.", icon: HeartPulse, href: "/tools/team-health", built: false },
  { title: "Epic Estimator", desc: "Break down epics into stories with bottom-up effort estimates.", icon: Layers, href: "/tools/epic-estimator", built: false },
  { title: "Retro Board", desc: "Structured retrospectives: what went well, what to improve, action items.", icon: MessageSquare, href: "/tools/retro-board", built: false },
  { title: "Throughput Run Chart", desc: "Track completed items per sprint to see delivery trends over time.", icon: Gauge, href: "/tools/throughput", built: false },
];

const ToolsIndex = () => (
  <>
    <Navbar />
    <section className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/40 font-sans mb-4">
            Free Project Management Tools
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Agile Toolbox
          </h1>
          <p className="text-muted-foreground font-sans text-sm max-w-lg mx-auto leading-relaxed">
            Minimal, privacy-first tools for agile teams. No sign-ups, no tracking — just data.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((t, i) => {
            const content = (
              <>
                <div className="flex items-start justify-between mb-4">
                  <t.icon size={28} className={t.built ? "text-gold-dark" : "text-muted-foreground/40"} />
                  {!t.built && (
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/30 font-sans border border-border/30 rounded-full px-2.5 py-0.5">
                      Soon
                    </span>
                  )}
                </div>
                <h2 className={`font-serif font-semibold text-lg mb-1.5 transition-colors ${t.built ? "text-foreground group-hover:text-gold-dark" : "text-muted-foreground/60"}`}>
                  {t.title}
                </h2>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-4 flex-1">
                  {t.desc}
                </p>
                <div className={`flex items-center gap-1 text-xs font-medium font-sans ${t.built ? "text-gold-dark" : "text-muted-foreground/40"}`}>
                  {t.built ? (
                    <>Open Tool <ArrowRight size={12} /></>
                  ) : (
                    <><Clock size={12} /> Coming soon</>
                  )}
                </div>
              </>
            );

            const cls = `glass-card-strong block h-full p-6 flex flex-col transition-all duration-300 ${
              t.built
                ? "hover:-translate-y-1 cursor-pointer"
                : "opacity-60 cursor-default"
            }`;

            return (
              <motion.div
                key={t.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 * (i + 1) }}
              >
                {t.built ? (
                  <Link to={t.href} className={cls}>
                    {content}
                  </Link>
                ) : (
                  <div className={cls}>
                    {content}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/30 font-sans mt-16">
          Built by Syed Imon Rizvi — Qalb Studios
        </p>
      </div>
    </section>
    <Footer />
  </>
);

export default ToolsIndex;
