import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Stakeholder {
  id: number;
  name: string;
  power: number;
  legitimacy: number;
  urgency: number;
}

let nextId = 4;

const CLASS_COLORS: Record<string, string> = {
  "Definitive": "bg-red-500/10 border-red-400/30 text-red-400 font-bold",
  "Dominant": "bg-amber-500/10 border-amber-400/30 text-amber-500",
  "Dangerous": "bg-orange-500/10 border-orange-400/30 text-orange-500",
  "Dependent": "bg-violet-500/10 border-violet-400/30 text-violet-500",
  "Demanding": "bg-sky-500/10 border-sky-400/30 text-sky-500",
  "Discretionary": "bg-emerald-500/10 border-emerald-400/30 text-emerald-500",
  "Dormant": "bg-muted/20 border-border/40 text-foreground/75",
};

function classify(p: number, l: number, u: number): string {
  if (p && l && u) return "Definitive";
  if (p && l && !u) return "Dominant";
  if (p && !l && u) return "Dangerous";
  if (!p && l && u) return "Dependent";
  if (!p && !l && u) return "Demanding";
  if (!p && l && !u) return "Discretionary";
  if (p && !l && !u) return "Dormant";
  return "Latent";
}

const StakeholderSalience = () => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([
    { id: 1, name: "Executive Sponsor", power: 9, legitimacy: 8, urgency: 7 },
    { id: 2, name: "End Users", power: 3, legitimacy: 8, urgency: 5 },
    { id: 3, name: "Regulator", power: 8, legitimacy: 9, urgency: 3 },
  ]);

  const add = () => {
    const id = nextId++;
    setStakeholders((prev) => [...prev, { id, name: "", power: 5, legitimacy: 5, urgency: 5 }]);
  };

  const remove = (id: number) => {
    if (stakeholders.length <= 1) return;
    setStakeholders((prev) => prev.filter((s) => s.id !== id));
  };

  const update = (id: number, field: keyof Stakeholder, value: string | number) => {
    setStakeholders((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const scored = useMemo(
    () => stakeholders.map((s) => ({ ...s, klass: classify(s.power >= 5, s.legitimacy >= 5, s.urgency >= 5) })),
    [stakeholders]
  );

  return (
    <ToolCard
      title="Stakeholder Salience Model"
      subtitle="Classify stakeholders by Power, Legitimacy, and Urgency to tailor your engagement strategy."
    >
      <ToolInfo
        what="The Stakeholder Salience Model (Mitchell, Agle & Wood, 1997) classifies stakeholders based on three attributes: Power (ability to influence), Legitimacy (validity of their claim), and Urgency (time-sensitivity). The combination determines their salience — how much attention they require."
        why="Use it during stakeholder analysis at project initiation or when entering a new phase. Helps prioritise engagement effort: Definitive stakeholders need proactive management, while Latent ones need minimal attention."
        how="1. List stakeholders. 2. Rate their Power (1-10), Legitimacy (1-10), and Urgency (1-10). 3. Scores >= 5 mean the attribute is present. 4. The model classifies each stakeholder into one of seven classes, from Definitive (all three) to Dormant (Power only). 5. Tailor your engagement strategy to each class."
      />

      {/* Legend */}
      <div className="glass-card p-3 md:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(CLASS_COLORS).map(([key, cls]) => (
            <div key={key} className={`px-2.5 py-1.5 rounded-md text-sm font-medium font-sans border ${cls}`}>{key}</div>
          ))}
        </div>
      </div>

      {/* Stakeholder cards */}
      <div className="glass-card p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-semibold text-foreground text-base">Stakeholders</h2>
          <button onClick={add} className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans">
            <Plus size={14} /> Add
          </button>
        </div>

        {scored.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="border border-border/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-foreground/70 font-mono">{String(i + 1).padStart(2, "0")}</span>
                <input type="text" value={s.name} onChange={(e) => update(s.id, "name", e.target.value)}
                  className="flex-1 bg-transparent border-b border-border/60 py-0.5 text-sm font-semibold text-foreground font-sans placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors" placeholder="Name" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium font-sans px-2 py-0.5 rounded-full border ${CLASS_COLORS[s.klass] || "border-border/40 text-foreground/75"}`}>
                  {s.klass}
                </span>
                <button onClick={() => remove(s.id)} className="text-foreground/40 hover:text-red-400 transition-colors" aria-label="Remove"><Trash2 size={12} /></button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {(["power", "legitimacy", "urgency"] as const).map((attr) => (
                <div key={attr}>
                  <div className="flex justify-between text-sm font-sans mb-0.5">
                    <span className="text-foreground/80 capitalize">{attr}</span>
                    <span className={s[attr] >= 5 ? "gold-text font-medium" : "text-foreground/75"}>{s[attr]}</span>
                  </div>
                  <input type="range" value={s[attr]} onChange={(e) => update(s.id, attr, Number(e.target.value))} min="1" max="10" step="1" className="w-full accent-gold-dark" />
                </div>
              ))}
            </div>

            {/* Engagement tip */}
            <p className="text-sm italic text-foreground/70 font-sans">
              {s.klass === "Definitive" && "Proactively manage — high engagement, frequent updates, involve in decisions."}
              {s.klass === "Dominant" && "Keep satisfied — they have power and legitimacy, engage regularly."}
              {s.klass === "Dangerous" && "Monitor carefully — power and urgency without legitimacy can be coercive."}
              {s.klass === "Dependent" && "Keep informed — they have urgency and legitimacy but need advocates with power."}
              {s.klass === "Demanding" && "Monitor — urgency alone warrants attention but may not require action."}
              {s.klass === "Discretionary" && "Keep informed — legitimacy alone makes them willing recipients of information."}
              {s.klass === "Dormant" && "Minimal effort — they have power but no current claim or urgency."}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="glass-card-strong p-4 md:p-5">
        <h2 className="font-serif font-semibold text-foreground text-base mb-3">Class Distribution</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.keys(CLASS_COLORS).map((k) => {
            const count = scored.filter((s) => s.klass === k).length;
            return (
              <div key={k} className="text-center p-2 rounded-lg bg-background/50">
                <p className="text-lg font-serif font-bold text-foreground">{count}</p>
                <p className="text-sm text-foreground/70 font-sans">{k}</p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default StakeholderSalience;
