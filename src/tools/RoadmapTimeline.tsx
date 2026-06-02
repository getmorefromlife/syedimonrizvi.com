import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, GripVertical } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Milestone {
  id: number;
  name: string;
  quarter: string;
  year: string;
  status: "planned" | "in-progress" | "completed" | "delayed";
  description: string;
}

let nextId = 7;

const QTRS = ["Q1", "Q2", "Q3", "Q4"];

const STATUS_STYLES: Record<string, string> = {
  "planned": "bg-sky-500/10 border-sky-400/30 text-sky-500",
  "in-progress": "bg-amber-500/10 border-amber-400/30 text-amber-500",
  "completed": "bg-emerald-500/10 border-emerald-400/30 text-emerald-500",
  "delayed": "bg-red-500/10 border-red-400/30 text-red-400",
};

const RoadmapTimeline = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: 1, name: "MVP Launch", quarter: "Q1", year: "2026", status: "completed", description: "Core portfolio site with hero, about, contact sections" },
    { id: 2, name: "Content Expansion", quarter: "Q2", year: "2026", status: "completed", description: "Books, Aligile, Studio pages with audio player" },
    { id: 3, name: "Agile Toolbox MVP", quarter: "Q2", year: "2026", status: "in-progress", description: "First 3 tools: velocity, burndown, capacity" },
    { id: 4, name: "Toolbox Expansion", quarter: "Q3", year: "2026", status: "planned", description: "Full suite of 25+ agile PM tools" },
    { id: 5, name: "Blog & Community", quarter: "Q3", year: "2026", status: "planned", description: "Blog with agile articles, community features" },
    { id: 6, name: "Mobile App", quarter: "Q4", year: "2026", status: "planned", description: "Native mobile version of the toolbox" },
  ]);

  const addMilestone = () => {
    const id = nextId++;
    setMilestones((prev) => [...prev, { id, name: "", quarter: "Q3", year: "2026", status: "planned", description: "" }]);
  };

  const removeMilestone = (id: number) => {
    if (milestones.length <= 1) return;
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const update = (id: number, field: keyof Milestone, value: string) => {
    setMilestones((prev) => prev.map((m) => m.id === id ? { ...m, [field]: value } : m));
  };

  const grouped = useMemo(() => {
    const g: Record<string, Milestone[]> = {};
    milestones.forEach((m) => {
      const key = `${m.year} ${m.quarter}`;
      if (!g[key]) g[key] = [];
      g[key].push(m);
    });
    // Sort by year then quarter
    const sorted = Object.entries(g).sort(([a], [b]) => {
      const [ay, aq] = a.split(" ");
      const [by, bq] = b.split(" ");
      if (ay !== by) return Number(ay) - Number(by);
      return QTRS.indexOf(aq) - QTRS.indexOf(bq);
    });
    return Object.fromEntries(sorted);
  }, [milestones]);

  return (
    <ToolCard
      title="Product Roadmap Timeline"
      subtitle="Plan and visualise features and milestones across quarters."
    >
      <ToolInfo
        what="A Product Roadmap is a strategic document that communicates the planned direction of a product over time. It shows what the team will work on, when, and why — typically organised by quarter."
        why="Use it for stakeholder alignment, investor communication, and internal planning. A good roadmap sets expectations, shows strategic thinking, and provides enough detail for teams to plan without overcommitting."
        how="1. Define milestones or themes for upcoming quarters. 2. Assign each to a quarter and year. 3. Set the status (planned, in-progress, completed, delayed). 4. Add a brief description. 5. Share with stakeholders and update as priorities shift."
      />

      {/* Controls */}
      <div className="glass-card p-4 md:p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-semibold text-foreground text-base">Milestones</h2>
          <button onClick={addMilestone} className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans">
            <Plus size={14} /> Add Milestone
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([period, items]) => (
          <div key={period}>
            <div className="glass-card-strong p-3 md:p-4">
              <h3 className="font-serif font-semibold text-foreground text-base mb-3">{period}</h3>
              <div className="space-y-2">
                {items.map((m, i) => (
                  <motion.div key={m.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 border border-border/40 rounded-lg p-3">
                    <div className="flex flex-col items-center gap-1 pt-0.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${m.status === "completed" ? "bg-emerald-500" : m.status === "in-progress" ? "bg-amber-500" : m.status === "delayed" ? "bg-red-400" : "bg-sky-500"}`} />
                      <div className="w-0.5 h-full min-h-[40px] bg-border/30" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <input type="text" value={m.name} onChange={(e) => update(m.id, "name", e.target.value)}
                          className="flex-1 bg-transparent text-sm font-semibold text-foreground font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors" placeholder="Milestone" />
                        <select value={m.quarter} onChange={(e) => update(m.id, "quarter", e.target.value)}
                          className="text-sm font-mono bg-transparent border border-border/30 rounded px-1.5 py-0.5 text-foreground/75">
                          {QTRS.map((q) => <option key={q} value={q}>{q}</option>)}
                        </select>
                        <select value={m.status} onChange={(e) => update(m.id, "status", e.target.value)}
                          className={`text-sm font-medium font-sans px-2 py-0.5 rounded-full border bg-transparent ${STATUS_STYLES[m.status] || ""}`}>
                          <option value="planned">planned</option>
                          <option value="in-progress">in-progress</option>
                          <option value="completed">completed</option>
                          <option value="delayed">delayed</option>
                        </select>
                        <button onClick={() => removeMilestone(m.id)} className="text-foreground/40 hover:text-red-400 transition-colors shrink-0" aria-label="Remove"><Trash2 size={11} /></button>
                      </div>
                      <input type="text" value={m.description} onChange={(e) => update(m.id, "description", e.target.value)}
                        className="w-full bg-transparent text-sm text-foreground/75 font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors" placeholder="Brief description" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default RoadmapTimeline;
