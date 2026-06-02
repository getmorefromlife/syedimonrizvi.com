import { motion } from "framer-motion";
import {
  TrendingUp, LineChart, Users, ClipboardList, BarChart3,
  GitBranch, Calendar, AlertTriangle, CheckSquare,
  Shirt, Timer, HeartPulse, Layers, MessageSquare, Gauge,
  ArrowRight, Clock, Target,
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
  { title: "WIP Limit Calculator", desc: "Calculate optimal WIP limits using Little's Law and flow efficiency.", icon: ClipboardList, href: "/tools/wip-limit", built: true },
  { title: "Lead Time Scatterplot", desc: "Plot lead times over time with percentile lines (P50, P85, P95) and export as PNG.", icon: BarChart3, href: "/tools/lead-time-scatter", built: true },
  { title: "Value Stream Mapping", desc: "Map end-to-end processes, measure process/wait time, and calculate flow efficiency.", icon: GitBranch, href: "/tools/value-stream", built: true },
  { title: "Cycle Time vs. Lead Time", desc: "Compare active working time against total delivery time to measure flow efficiency.", icon: Calendar, href: "/tools/cycle-vs-lead", built: true },
  { title: "Blockers & Impediments Log", desc: "Track, manage, and analyse blockers that slow down delivery.", icon: AlertTriangle, href: "/tools/blocker-log", built: true },
  { title: "RACI Chart Generator", desc: "Define roles and responsibilities with Responsible, Accountable, Consulted, Informed.", icon: CheckSquare, href: "/tools/raci", built: true },
  { title: "Dependencies Matrix", desc: "Map dependency relationships between work items — blocks, blocked-by, related.", icon: GitBranch, href: "/tools/dependencies", built: true },
  { title: "Stakeholder Salience Model", desc: "Classify stakeholders by Power, Legitimacy, and Urgency to tailor engagement.", icon: Users, href: "/tools/stakeholder-salience", built: true },
  { title: "Team Health Check", desc: "Run a radar health check across morale, workload, collaboration, and more.", icon: HeartPulse, href: "/tools/team-health", built: true },
  { title: "OKR Tracker", desc: "Set Objectives and Key Results and track progress toward quarterly goals.", icon: Target, href: "/tools/okr-tracker", built: true },
  { title: "MoSCoW Prioritiser", desc: "Categorise requirements into Must / Should / Could / Won't have.", icon: CheckSquare, href: "/tools/moscow", built: false },
  { title: "T-Shirt Sizer", desc: "Convert t-shirt sizes (XS–XL) into rough story-point ranges.", icon: Shirt, href: "/tools/tshirt-sizer", built: false },
  { title: "Daily Standup Timer", desc: "Keep standups tight with per-person timeboxing and rounds.", icon: Timer, href: "/tools/standup-timer", built: false },
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
