import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Scenario {
  id: number;
  name: string;
  valuePerWeek: string;
  delayWeeks: string;
  type: "ubv" | "tc" | "rroe";
}

let nextId = 1;

const TYPE_LABELS: Record<string, string> = {
  ubv: "User-Business Value",
  tc: "Time Criticality",
  rroe: "Risk Reduction / Opp. Enablement",
};

const TYPE_DESC: Record<string, string> = {
  ubv: "Revenue lost or value not delivered per week of delay. E.g., subscription revenue, ad impressions, user growth.",
  tc: "Cost of missing a market window or deadline. E.g., regulatory deadline, seasonal peak, contractual penalty.",
  rroe: "Value of risk avoided or opportunity enabled per week. E.g., avoiding security breach, enabling future features.",
};

const CostOfDelayCalculator = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: nextId++, name: "", valuePerWeek: "10000", delayWeeks: "4", type: "ubv" },
  ]);

  const addScenario = () =>
    setScenarios((prev) => [...prev, { id: nextId++, name: "", valuePerWeek: "", delayWeeks: "", type: "ubv" }]);

  const removeScenario = (id: number) => {
    if (scenarios.length <= 1) return;
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const update = (id: number, field: keyof Scenario, value: string | "ubv" | "tc" | "rroe") => {
    setScenarios((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const scored = useMemo(
    () =>
      scenarios.map((s) => {
        const vpw = Number(s.valuePerWeek) || 0;
        const dw = Number(s.delayWeeks) || 0;
        const total = vpw * dw;
        return { ...s, vpw, dw, total };
      }),
    [scenarios]
  );

  const grandTotal = useMemo(() => scored.reduce((sum, s) => sum + s.total, 0), [scored]);

  return (
    <ToolCard
      title="Cost of Delay Calculator"
      subtitle="Quantify the economic impact of delaying a feature or project across three value dimensions."
    >
      <ToolInfo
        what="Cost of Delay (CoD) quantifies the economic loss incurred by postponing a project or feature. It combines three dimensions: User-Business Value, Time Criticality, and Risk Reduction / Opportunity Enablement."
        why="Use it for prioritisation decisions — compare the cost of delaying different items, build a business case for urgent work, or calculate ROI of accelerated delivery."
        how="1. Identify the feature or project. 2. Estimate the value lost per week of delay in each relevant dimension (UBV, TC, RR/OE). 3. Estimate the delay duration in weeks. 4. CoD = sum of (value/week × weeks) across all dimensions. 5. Compare across items to prioritise."
      >
        <div className="border-t border-border/30 pt-3">
          <span className="text-sm uppercase tracking-wider text-gold-dark font-sans font-medium">
            Formula
          </span>
          <p className="text-sm text-foreground/75 font-sans leading-relaxed mt-1">
            Cost of Delay = (Value per Week × Weeks of Delay) per dimension
          </p>
        </div>
      </ToolInfo>

      {/* Description of types */}
      <div className="glass-card p-4 md:p-5">
        <h2 className="font-serif font-semibold text-foreground text-base mb-3">Three Dimensions of Cost of Delay</h2>
        <div className="space-y-3 text-base font-sans text-foreground/75 leading-relaxed">
          {Object.entries(TYPE_DESC).map(([key, desc]) => (
            <div key={key}>
              <span className="text-gold-dark font-medium">{TYPE_LABELS[key]}</span>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scenarios */}
      <div className="glass-card p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-semibold text-foreground text-base">Features / Projects</h2>
          <button
            onClick={addScenario}
            className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans"
          >
            <Plus size={14} /> Add
          </button>
        </div>

        {scored.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border/40 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-foreground/70 font-mono">{String(i + 1).padStart(2, "0")}</span>
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => update(s.id, "name", e.target.value)}
                  className="bg-transparent border-b border-border/60 py-0.5 text-sm text-foreground font-sans placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors flex-1"
                  placeholder="Feature name"
                />
              </div>
              <button
                onClick={() => removeScenario(s.id)}
                className="text-foreground/50 hover:text-red-400 transition-colors ml-2"
                aria-label="Remove"
              >
                <Trash2 size={13} />
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm uppercase tracking-wider text-foreground/70 font-sans mb-0.5">Cost Dimension</label>
                <select
                  value={s.type}
                  onChange={(e) => update(s.id, "type", e.target.value)}
                  className="w-full bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-sans focus:outline-none focus:border-gold/50 transition-colors"
                >
                  <option value="ubv">User-Business Value</option>
                  <option value="tc">Time Criticality</option>
                  <option value="rroe">Risk Red. / Opp. Enable.</option>
                </select>
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider text-foreground/70 font-sans mb-0.5">Value per Week ($)</label>
                <input
                  type="number"
                  value={s.vpw || ""}
                  onChange={(e) => update(s.id, "valuePerWeek", e.target.value)}
                  className="w-full bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider text-foreground/70 font-sans mb-0.5">Delay (Weeks)</label>
                <input
                  type="number"
                  value={s.dw || ""}
                  onChange={(e) => update(s.id, "delayWeeks", e.target.value)}
                  className="w-full bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            {s.total > 0 && (
              <div className="text-right">
                <span className="text-sm uppercase tracking-wider text-foreground/70 font-sans mr-2">
                  Cost of Delay
                </span>
                <span className="text-lg font-serif font-bold gold-text">
                  ${s.total.toLocaleString()}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Grand Total */}
      {grandTotal > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-strong p-6 md:p-8 text-center"
        >
          <p className="text-sm uppercase tracking-widest text-foreground/80 font-sans mb-1">
            Total Cost of Delay
          </p>
          <p className="text-4xl md:text-5xl font-serif font-bold gold-text">
            ${grandTotal.toLocaleString()}
          </p>
          <p className="text-sm text-foreground/70 font-sans mt-2">
            Combined across {scored.length} feature{scored.length !== 1 ? "s" : ""}
          </p>
        </motion.div>
      )}

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default CostOfDelayCalculator;
