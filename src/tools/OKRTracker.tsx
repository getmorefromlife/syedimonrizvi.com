import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Target } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface KR {
  id: number;
  name: string;
  current: string;
  target: string;
}

interface Objective {
  id: number;
  name: string;
  keyResults: KR[];
}

let nextObjId = 3;
let nextKRId = 5;

const OKRTracker = () => {
  const [objectives, setObjectives] = useState<Objective[]>([
    {
      id: 1, name: "Improve Delivery Speed",
      keyResults: [
        { id: 1, name: "Reduce lead time to 5 days", current: "12", target: "5" },
        { id: 2, name: "Increase deployment frequency to 3/week", current: "1", target: "3" },
      ],
    },
    {
      id: 2, name: "Boost Team Health",
      keyResults: [
        { id: 3, name: "Health check avg score > 7", current: "6.2", target: "7.5" },
        { id: 4, name: "Reduce voluntary attrition to 0%", current: "5", target: "0" },
      ],
    },
  ]);
  const [quarter, setQuarter] = useState("Q2 2026");

  const addObjective = () => {
    const id = nextObjId++;
    setObjectives((prev) => [...prev, { id, name: "", keyResults: [] }]);
  };

  const removeObjective = (id: number) => {
    if (objectives.length <= 1) return;
    setObjectives((prev) => prev.filter((o) => o.id !== id));
  };

  const updateObjective = (id: number, name: string) => {
    setObjectives((prev) => prev.map((o) => (o.id === id ? { ...o, name } : o)));
  };

  const addKR = (objId: number) => {
    const id = nextKRId++;
    setObjectives((prev) => prev.map((o) => o.id === objId ? { ...o, keyResults: [...o.keyResults, { id, name: "", current: "0", target: "10" }] } : o));
  };

  const removeKR = (objId: number, krId: number) => {
    setObjectives((prev) => prev.map((o) => o.id === objId ? { ...o, keyResults: o.keyResults.filter((kr) => kr.id !== krId) } : o));
  };

  const updateKR = (objId: number, krId: number, field: keyof KR, value: string) => {
    setObjectives((prev) => prev.map((o) => o.id === objId ? { ...o, keyResults: o.keyResults.map((kr) => kr.id === krId ? { ...kr, [field]: value } : kr) } : o));
  };

  const progress = useMemo(() => {
    let totalPct = 0;
    let count = 0;
    const objProgress = objectives.map((o) => {
      const krs = o.keyResults.filter((kr) => kr.name.trim());
      if (krs.length === 0) return { ...o, progress: null, avg: 0 };
      const sum = krs.reduce((s, kr) => {
        const cur = Number(kr.current) || 0;
        const tgt = Number(kr.target) || 1;
        return s + Math.min(100, Math.round((cur / tgt) * 100));
      }, 0);
      const avg = Math.round(sum / krs.length);
      totalPct += avg;
      count++;
      return { ...o, progress: avg, krCount: krs.length };
    });
    return { objectives: objProgress, overall: count > 0 ? Math.round(totalPct / count) : 0 };
  }, [objectives]);

  return (
    <ToolCard
      title="OKR Tracker"
      subtitle="Set Objectives and Key Results — track progress toward ambitious goals each quarter."
    >
      <ToolInfo
        what="OKRs (Objectives and Key Results) is a goal-setting framework popularised by Intel and Google. Objectives are ambitious and qualitative. Key Results are measurable outcomes that indicate progress toward the objective."
        why="Use it for quarterly planning to align the team around measurable outcomes. OKRs create focus, transparency, and a shared definition of success. They should be ambitious (70% completion is often a good result)."
        how="1. Set 1-3 Objectives for the quarter. 2. For each objective, define 2-4 Key Results with measurable targets. 3. Update current values regularly. 4. Track progress as a percentage. 5. At quarter end, review — 60-70% is healthy, 100% may mean goals were too easy."
      />

      {/* Quarter header + Overall */}
      <div className="glass-card-strong p-5 md:p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Target size={24} className="text-gold-dark" />
            <div>
              <input type="text" value={quarter} onChange={(e) => setQuarter(e.target.value)}
                className="bg-transparent text-lg font-serif font-bold text-foreground border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors" />
              <p className="text-sm text-foreground/70 font-sans">Quarter</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-serif font-bold gold-text">{progress.overall}%</p>
            <p className="text-sm text-foreground/70 font-sans">Overall Progress</p>
          </div>
        </div>
        <div className="mt-3 w-full bg-border/40 rounded-full h-2">
          <div className="bg-gold rounded-full h-2 transition-all duration-500" style={{ width: `${progress.overall}%` }} />
        </div>
      </div>

      {/* Objectives */}
      <div className="glass-card p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-semibold text-foreground text-base">Objectives</h2>
          <button onClick={addObjective} className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans">
            <Plus size={14} /> Add Objective
          </button>
        </div>

        {progress.objectives.map((obj, oi) => (
          <motion.div key={obj.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="border border-border/40 rounded-xl p-4 space-y-4">
            {/* Objective row */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground/70 font-mono shrink-0">O{String(oi + 1).padStart(2, "0")}</span>
              <input type="text" value={obj.name} onChange={(e) => updateObjective(obj.id, e.target.value)}
                className="flex-1 bg-transparent border-b border-border/60 py-0.5 text-sm font-semibold text-foreground font-sans placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors" placeholder="Objective" />
              {obj.progress !== null && (
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-20 bg-border/40 rounded-full h-1.5">
                    <div className="bg-gold rounded-full h-1.5 transition-all" style={{ width: `${obj.progress}%` }} />
                  </div>
                  <span className="text-sm font-mono font-bold gold-text">{obj.progress}%</span>
                </div>
              )}
              <button onClick={() => removeObjective(obj.id)} className="text-foreground/40 hover:text-red-400 transition-colors shrink-0" aria-label="Remove"><Trash2 size={12} /></button>
            </div>

            {/* Key Results */}
            <div className="ml-6 space-y-2">
              {obj.keyResults.length > 0 && (
                <div className="hidden sm:grid sm:grid-cols-[1fr_80px_80px_30px] gap-2 text-sm uppercase tracking-wider text-foreground/60 font-sans pb-1 border-b border-border/20">
                  <span>Key Result</span>
                  <span className="text-center">Current</span>
                  <span className="text-center">Target</span>
                  <span />
                </div>
              )}

              {obj.keyResults.map((kr, ki) => {
                const cur = Number(kr.current) || 0;
                const tgt = Number(kr.target) || 1;
                const pct = Math.min(100, Math.round((cur / tgt) * 100));
                return (
                  <div key={kr.id} className="grid sm:grid-cols-[1fr_80px_80px_30px] gap-2 items-center border border-border/30 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-foreground/50 font-mono shrink-0">KR{ki + 1}</span>
                      <input type="text" value={kr.name} onChange={(e) => updateKR(obj.id, kr.id, "name", e.target.value)}
                        className="flex-1 bg-transparent text-sm text-foreground font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors placeholder:text-foreground/60" placeholder="Key result" />
                      <span className={`text-sm font-mono font-bold ${pct >= 80 ? "text-emerald-500" : pct >= 50 ? "text-amber-500" : "text-red-400"}`}>{pct}%</span>
                    </div>
                    <input type="number" value={kr.current} onChange={(e) => updateKR(obj.id, kr.id, "current", e.target.value)}
                      className="w-full text-center bg-transparent border-b border-border/60 py-0.5 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors" min="0" step="0.1" />
                    <input type="number" value={kr.target} onChange={(e) => updateKR(obj.id, kr.id, "target", e.target.value)}
                      className="w-full text-center bg-transparent border-b border-border/60 py-0.5 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors" min="0" step="0.1" />
                    <button onClick={() => removeKR(obj.id, kr.id)} className="text-foreground/40 hover:text-red-400 transition-colors justify-self-center" aria-label="Remove"><Trash2 size={10} /></button>
                  </div>
                );
              })}

              <button onClick={() => addKR(obj.id)} className="flex items-center gap-1 text-sm text-foreground/70 hover:text-gold-dark transition-colors font-sans ml-1">
                <Plus size={10} /> Add Key Result
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default OKRTracker;
