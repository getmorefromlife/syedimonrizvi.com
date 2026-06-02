import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, LineChart, Users, ClipboardList, BarChart3,
  GitBranch, Calendar, AlertTriangle, CheckSquare,
  HeartPulse, MessageSquare, Target,
  ArrowRight, Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Methodology = "agile" | "scrum" | "lean" | "pmp" | "devops";
type Phase = "initiation" | "planning" | "execution" | "monitoring" | "review-close";

interface ToolEntry {
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  built: boolean;
  methodology: Methodology[];
  phase: Phase[];
}

const METHODOLOGY_NAMES: Record<Methodology, string> = {
  agile: "Agile",
  scrum: "Scrum",
  lean: "Lean",
  pmp: "PMP",
  devops: "DevOps",
};

const PHASE_NAMES: Record<Phase, string> = {
  initiation: "Initiation",
  planning: "Planning",
  execution: "Execution",
  monitoring: "Monitoring",
  "review-close": "Review & Close",
};

const tools: ToolEntry[] = [
  { title: "Velocity Calculator", desc: "Track sprint velocity, compute averages, and forecast backlog completion.", icon: TrendingUp, href: "/tools/velocity", built: true, methodology: ["agile", "scrum"], phase: ["monitoring"] },
  { title: "Burndown Chart", desc: "Generate ideal vs. actual burndown charts and export as PNG for standups.", icon: LineChart, href: "/tools/burndown", built: true, methodology: ["agile", "scrum"], phase: ["execution", "monitoring"] },
  { title: "Sprint Capacity", desc: "Calculate team capacity with per-member PTO, meetings, and focus factor.", icon: Users, href: "/tools/capacity", built: true, methodology: ["agile", "scrum"], phase: ["planning"] },
  { title: "Planning Poker", desc: "Estimate collaboratively with Fibonacci cards, reveal results, and build consensus.", icon: ClipboardList, href: "/tools/planning-poker", built: true, methodology: ["agile", "scrum"], phase: ["planning"] },
  { title: "WSJF Calculator", desc: "Prioritise backlog items by economic value per unit of effort (SAFe WSJF).", icon: BarChart3, href: "/tools/wsjf", built: true, methodology: ["agile", "lean"], phase: ["planning"] },
  { title: "Cost of Delay Calculator", desc: "Quantify the economic impact of delaying features across three dimensions.", icon: Calendar, href: "/tools/cost-of-delay", built: true, methodology: ["agile", "lean"], phase: ["planning"] },
  { title: "Effort vs. Impact Matrix", desc: "Plot initiatives on a 2×2 grid to identify quick wins and avoid low-value work.", icon: AlertTriangle, href: "/tools/effort-impact", built: true, methodology: ["agile", "pmp"], phase: ["planning"] },
  { title: "User Story Map", desc: "Visualise the user journey across activities and organise stories by priority.", icon: GitBranch, href: "/tools/story-map", built: true, methodology: ["agile", "scrum"], phase: ["planning"] },
  { title: "WIP Limit Calculator", desc: "Calculate optimal WIP limits using Little's Law and flow efficiency.", icon: ClipboardList, href: "/tools/wip-limit", built: true, methodology: ["agile", "lean"], phase: ["execution", "monitoring"] },
  { title: "Lead Time Scatterplot", desc: "Plot lead times over time with percentile lines (P50, P85, P95) and export as PNG.", icon: BarChart3, href: "/tools/lead-time-scatter", built: true, methodology: ["agile", "lean"], phase: ["monitoring"] },
  { title: "Value Stream Mapping", desc: "Map end-to-end processes, measure process/wait time, and calculate flow efficiency.", icon: GitBranch, href: "/tools/value-stream", built: true, methodology: ["lean"], phase: ["planning", "monitoring"] },
  { title: "Cycle Time vs. Lead Time", desc: "Compare active working time against total delivery time to measure flow efficiency.", icon: Calendar, href: "/tools/cycle-vs-lead", built: true, methodology: ["agile", "lean"], phase: ["monitoring"] },
  { title: "Blockers & Impediments Log", desc: "Track, manage, and analyse blockers that slow down delivery.", icon: AlertTriangle, href: "/tools/blocker-log", built: true, methodology: ["agile", "scrum"], phase: ["execution", "monitoring"] },
  { title: "RACI Chart Generator", desc: "Define roles and responsibilities with Responsible, Accountable, Consulted, Informed.", icon: CheckSquare, href: "/tools/raci", built: true, methodology: ["pmp"], phase: ["planning"] },
  { title: "Dependencies Matrix", desc: "Map dependency relationships between work items — blocks, blocked-by, related.", icon: GitBranch, href: "/tools/dependencies", built: true, methodology: ["pmp"], phase: ["planning"] },
  { title: "Stakeholder Salience Model", desc: "Classify stakeholders by Power, Legitimacy, and Urgency to tailor engagement.", icon: Users, href: "/tools/stakeholder-salience", built: true, methodology: ["pmp"], phase: ["initiation", "planning"] },
  { title: "Team Health Check", desc: "Run a radar health check across morale, workload, collaboration, and more.", icon: HeartPulse, href: "/tools/team-health", built: true, methodology: ["agile", "scrum"], phase: ["monitoring", "review-close"] },
  { title: "OKR Tracker", desc: "Set Objectives and Key Results and track progress toward quarterly goals.", icon: Target, href: "/tools/okr-tracker", built: true, methodology: ["agile"], phase: ["planning", "monitoring"] },
  { title: "Impact Mapping", desc: "Map strategic goals to actors, impacts, and deliverables for outcome-driven delivery.", icon: Target, href: "/tools/impact-mapping", built: true, methodology: ["agile"], phase: ["initiation", "planning"] },
  { title: "Persona Generator", desc: "Create data-driven user personas based on role, goals, behaviours, and context.", icon: Users, href: "/tools/persona-generator", built: true, methodology: ["agile", "pmp"], phase: ["initiation"] },
  { title: "Product Roadmap Timeline", desc: "Visualise themes, epics, and releases on a monthly timeline with swimlanes.", icon: Calendar, href: "/tools/roadmap-timeline", built: true, methodology: ["agile", "pmp"], phase: ["planning"] },
  { title: "DORA Metrics Dashboard", desc: "Track Deployment Frequency, Lead Time, MTTR, and Change Failure Rate.", icon: BarChart3, href: "/tools/dora-metrics", built: true, methodology: ["agile", "devops"], phase: ["monitoring"] },
  { title: "Communication Plan", desc: "Define stakeholder audiences, channels, frequency, and owners for project comms.", icon: MessageSquare, href: "/tools/communication-plan", built: true, methodology: ["pmp"], phase: ["initiation", "planning"] },
  { title: "MoSCoW Prioritiser", desc: "Categorise requirements into Must / Should / Could / Won't have.", icon: CheckSquare, href: "/tools/moscow", built: false, methodology: ["pmp", "agile"], phase: ["planning"] },
];

const ALL_METHODOLOGIES: Methodology[] = ["agile", "scrum", "lean", "pmp", "devops"];
const ALL_PHASES: Phase[] = ["initiation", "planning", "execution", "monitoring", "review-close"];

const filterBtn = (
  active: boolean,
  label: string,
  onClick: () => void,
  isMethodology: boolean
) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-full text-sm font-medium font-sans transition-all duration-200 border whitespace-nowrap ${
      active
        ? "bg-gold-dark/10 border-gold-dark/30 text-gold-dark"
        : "bg-transparent border-border/40 text-foreground/60 hover:text-foreground/80 hover:border-foreground/30"
    }`}
  >
    {label}
  </button>
);

const phaseColor = (phase: Phase) => {
  const colors: Record<Phase, string> = {
    initiation: "bg-sky-500/10 border-sky-400/30 text-sky-600",
    planning: "bg-violet-500/10 border-violet-400/30 text-violet-600",
    execution: "bg-emerald-500/10 border-emerald-400/30 text-emerald-600",
    monitoring: "bg-amber-500/10 border-amber-400/30 text-amber-600",
    "review-close": "bg-rose-500/10 border-rose-400/30 text-rose-600",
  };
  return colors[phase];
};

const ToolsIndex = () => {
  const [methodFilter, setMethodFilter] = useState<Methodology | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<Phase | null>(null);

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      if (methodFilter && !t.methodology.includes(methodFilter)) return false;
      if (phaseFilter && !t.phase.includes(phaseFilter)) return false;
      return true;
    });
  }, [methodFilter, phaseFilter]);

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-foreground/60 font-sans mb-4">
              Free Project Management Tools
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Agile Toolbox
            </h1>
            <p className="text-foreground/75 font-sans text-base max-w-xl mx-auto leading-relaxed">
              Minimal, privacy-first tools for agile teams. No sign-ups, no tracking — just data.
            </p>
          </motion.div>

          {/* Methodology filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {filterBtn(methodFilter === null, "All", () => setMethodFilter(null), true)}
            {ALL_METHODOLOGIES.map((m) =>
              filterBtn(methodFilter === m, METHODOLOGY_NAMES[m], () =>
                setMethodFilter(methodFilter === m ? null : m), true
              )
            )}
          </div>

          {/* Phase filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filterBtn(phaseFilter === null, "All Phases", () => setPhaseFilter(null), false)}
            {ALL_PHASES.map((p) =>
              filterBtn(phaseFilter === p, PHASE_NAMES[p], () =>
                setPhaseFilter(phaseFilter === p ? null : p), false
              )
            )}
          </div>

          {/* Results count */}
          <p className="text-center text-sm text-foreground/60 font-sans mb-8">
            {filtered.length} {filtered.length === 1 ? "tool" : "tools"}
            {(methodFilter || phaseFilter) && (
              <button
                onClick={() => { setMethodFilter(null); setPhaseFilter(null); }}
                className="ml-3 text-gold-dark hover:text-gold transition-colors underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </p>

          <AnimatePresence mode="popLayout">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((t) => {
                const content = (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <t.icon size={28} className={t.built ? "text-gold-dark" : "text-foreground/50"} />
                      {!t.built && (
                        <span className="text-xs uppercase tracking-wider text-foreground/50 font-sans border border-border/40 rounded-full px-2.5 py-0.5">
                          Soon
                        </span>
                      )}
                    </div>
                    <h2 className={`font-serif font-semibold text-lg mb-1.5 transition-colors ${t.built ? "text-foreground group-hover:text-gold-dark" : "text-foreground/80"}`}>
                      {t.title}
                    </h2>
                    <p className="text-sm text-foreground/75 font-sans leading-relaxed mb-3 flex-1">
                      {t.desc}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {t.methodology.map((m) => (
                        <span key={m} className="text-[11px] uppercase tracking-wider text-gold-dark/80 font-sans border border-gold-dark/20 rounded-full px-2 py-0.5">
                          {METHODOLOGY_NAMES[m]}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {t.phase.map((p) => (
                        <span key={p} className={`text-[11px] font-sans px-2 py-0.5 rounded-full border ${phaseColor(p)}`}>
                          {PHASE_NAMES[p]}
                        </span>
                      ))}
                    </div>
                    {t.built && (
                      <div className="flex items-center gap-1 text-sm font-medium text-gold-dark font-sans mt-3">
                        Open Tool <ArrowRight size={13} />
                      </div>
                    )}
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
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
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
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-center text-foreground/60 font-sans py-16">
              No tools match the selected filters.
            </p>
          )}

          <p className="text-center text-xs uppercase tracking-[0.25em] text-foreground/50 font-sans mt-16">
            Built by Syed Imon Rizvi — Qalb Studios
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ToolsIndex;
