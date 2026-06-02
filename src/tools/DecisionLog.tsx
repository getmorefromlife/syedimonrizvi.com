import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Search } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

type DecisionStatus = "proposed" | "accepted" | "deprecated" | "superseded";

interface Decision {
  id: number;
  title: string;
  context: string;
  decision: string;
  alternatives: string;
  date: string;
  status: DecisionStatus;
  owner: string;
}

let nextId = 5;

const STATUS_STYLES: Record<DecisionStatus, string> = {
  proposed: "bg-sky-500/10 border-sky-400/30 text-sky-500",
  accepted: "bg-emerald-500/10 border-emerald-400/30 text-emerald-500",
  deprecated: "bg-amber-500/10 border-amber-400/30 text-amber-500",
  superseded: "bg-red-500/10 border-red-400/30 text-red-400",
};

const DecisionLog = () => {
  const [decisions, setDecisions] = useState<Decision[]>([
    { id: 1, title: "Use React Router for SPA routing", context: "Need client-side routing for multi-page portfolio with SEO prerendering", decision: "Adopt React Router v6 with BrowserRouter. Prerender static HTML via Puppeteer at build time.", alternatives: "Next.js (too heavy for portfolio), HashRouter (worse SEO)", date: "2026-05-15", status: "accepted", owner: "Syed" },
    { id: 2, title: "Host on Netlify with auto-deploy from GitHub", context: "Need CI/CD that triggers on git push to main", decision: "Netlify auto-deploys from GitHub main branch. Build command installs Chrome for prerender.", alternatives: "Vercel, AWS S3+CloudFront, GitHub Pages", date: "2026-05-16", status: "accepted", owner: "Syed" },
    { id: 3, title: "Use recharts for charting", context: "Burndown charts and scatterplots required for agile toolbox", decision: "Use recharts (already in dependencies) for all chart types.", alternatives: "D3.js (too low-level), Chart.js (would add dependency)", date: "2026-05-20", status: "accepted", owner: "Syed" },
    { id: 4, title: "Gold/orange colour palette", context: "Professional portfolio with warm accent", decision: "Use CSS variable --gold: 42 78% 55% as primary accent across all components.", alternatives: "Blue (too corporate), Green (not aligned with brand)", date: "2026-05-10", status: "accepted", owner: "Syed" },
  ]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DecisionStatus | "all">("all");

  const addDecision = () => {
    const id = nextId++;
    setDecisions((prev) => [...prev, { id, title: "", context: "", decision: "", alternatives: "", date: new Date().toISOString().split("T")[0], status: "proposed", owner: "" }]);
  };

  const removeDecision = (id: number) => {
    if (decisions.length <= 1) return;
    setDecisions((prev) => prev.filter((d) => d.id !== id));
  };

  const update = (id: number, field: keyof Decision, value: string) => {
    setDecisions((prev) => prev.map((d) => d.id === id ? { ...d, [field]: value } : d));
  };

  const filtered = useMemo(() => {
    return decisions.filter((d) => {
      if (filter !== "all" && d.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return d.title.toLowerCase().includes(q) || d.context.toLowerCase().includes(q) || d.decision.toLowerCase().includes(q);
      }
      return true;
    });
  }, [decisions, search, filter]);

  const stats = useMemo(() => {
    return {
      total: decisions.length,
      accepted: decisions.filter((d) => d.status === "accepted").length,
      proposed: decisions.filter((d) => d.status === "proposed").length,
      deprecated: decisions.filter((d) => d.status === "deprecated" || d.status === "superseded").length,
    };
  }, [decisions]);

  return (
    <ToolCard
      title="Decision Log (ADR Tracker)"
      subtitle="Record architectural and project decisions with context, alternatives, and outcomes."
    >
      <ToolInfo
        what="An Architecture Decision Record (ADR) captures a significant decision, its context, the alternatives considered, and the outcome. The Decision Log is the collection of all ADRs, providing a historical record of why the project evolved the way it did."
        why="Use it whenever you make a significant technical or process decision. ADRs prevent repeated debates, help onboard new team members, and provide justification when decisions are later questioned. Status tracking (proposed → accepted → deprecated/superseded) captures the decision lifecycle."
        how="1. When a significant decision is made, create an ADR. 2. Describe the context (what problem were you solving?). 3. State the decision clearly. 4. List alternatives considered and why they were rejected. 5. Set the status: proposed, accepted, deprecated, or superseded. 6. Review periodically to identify outdated decisions."
      />

      {/* Stats */}
      <div className="glass-card-strong p-4 md:p-5">
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xl font-serif font-bold text-foreground">{stats.total}</p>
            <p className="text-[10px] text-muted-foreground/50 font-sans">Total</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xl font-serif font-bold text-emerald-500">{stats.accepted}</p>
            <p className="text-[10px] text-muted-foreground/50 font-sans">Accepted</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xl font-serif font-bold text-sky-500">{stats.proposed}</p>
            <p className="text-[10px] text-muted-foreground/50 font-sans">Proposed</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xl font-serif font-bold text-red-400">{stats.deprecated}</p>
            <p className="text-[10px] text-muted-foreground/50 font-sans">Deprecated/Superseded</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="glass-card p-4 md:p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-1 min-w-[160px]">
            <Search size={14} className="text-muted-foreground/40 shrink-0" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-sans placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/50 transition-colors" placeholder="Search decisions..." />
          </div>
          <div className="flex items-center gap-1 text-xs font-sans">
            {(["all", "proposed", "accepted", "deprecated", "superseded"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${filter === f ? "bg-gold/15 text-gold-dark border border-gold/30" : "text-muted-foreground/50 hover:text-foreground"}`}>{f}</button>
            ))}
          </div>
          <button onClick={addDecision} className="flex items-center gap-1 text-xs font-medium text-gold-dark hover:text-gold transition-colors font-sans shrink-0">
            <Plus size={14} /> Add Decision
          </button>
        </div>
      </div>

      {/* Decision cards */}
      <div className="glass-card p-4 md:p-5 space-y-3">
        {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground/50 font-sans py-8">No matching decisions.</p>}
        {filtered.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="border border-border/40 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs text-muted-foreground/50 font-mono shrink-0">ADR-{String(d.id).padStart(3, "0")}</span>
                <input type="text" value={d.title} onChange={(e) => update(d.id, "title", e.target.value)}
                  className="flex-1 bg-transparent border-b border-border/60 py-0.5 text-sm font-semibold text-foreground font-sans placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/50 transition-colors" placeholder="Decision title" />
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <select value={d.status} onChange={(e) => update(d.id, "status", e.target.value)}
                  className={`text-[10px] font-medium font-sans px-2 py-0.5 rounded-full border bg-transparent ${STATUS_STYLES[d.status] || ""}`}>
                  <option value="proposed">proposed</option>
                  <option value="accepted">accepted</option>
                  <option value="deprecated">deprecated</option>
                  <option value="superseded">superseded</option>
                </select>
                <button onClick={() => removeDecision(d.id)} className="text-muted-foreground/20 hover:text-red-400 transition-colors" aria-label="Remove"><Trash2 size={12} /></button>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold-dark font-sans">Context</span>
                <textarea value={d.context} onChange={(e) => update(d.id, "context", e.target.value)}
                  className="w-full bg-transparent text-xs text-muted-foreground font-sans mt-0.5 border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors resize-none h-12" placeholder="What problem were you solving?" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold-dark font-sans">Decision</span>
                <textarea value={d.decision} onChange={(e) => update(d.id, "decision", e.target.value)}
                  className="w-full bg-transparent text-xs text-muted-foreground font-sans mt-0.5 border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors resize-none h-12" placeholder="What was decided?" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-sans">Alternatives</span>
                  <textarea value={d.alternatives} onChange={(e) => update(d.id, "alternatives", e.target.value)}
                    className="w-full bg-transparent text-xs text-muted-foreground/70 font-sans mt-0.5 border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors resize-none h-10" placeholder="Alternatives considered" />
                </div>
                <div className="flex gap-3 items-start">
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-sans">Date</span>
                    <input type="date" value={d.date} onChange={(e) => update(d.id, "date", e.target.value)}
                      className="w-full bg-transparent text-xs text-foreground font-mono mt-0.5 border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-sans">Owner</span>
                    <input type="text" value={d.owner} onChange={(e) => update(d.id, "owner", e.target.value)}
                      className="w-full bg-transparent text-xs text-foreground font-sans mt-0.5 border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors" placeholder="Name" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/30 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default DecisionLog;
