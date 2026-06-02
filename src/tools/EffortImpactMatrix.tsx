import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Item {
  id: number;
  name: string;
  effort: number;
  impact: number;
}

let nextItemId = 1;

const QUADRANTS = [
  { label: "Quick Wins", desc: "High impact, low effort — do these first", x: 0, y: 0, color: "text-emerald-500" },
  { label: "Major Projects", desc: "High impact, high effort — plan strategically", x: 1, y: 0, color: "text-amber-500" },
  { label: "Fill-Ins", desc: "Low impact, low effort — do when time permits", x: 0, y: 1, color: "text-sky-500" },
  { label: "Avoid", desc: "Low impact, high effort — deprioritise or drop", x: 1, y: 1, color: "text-red-400" },
];

function getQuadrant(effort: number, impact: number) {
  if (impact >= 5 && effort < 5) return QUADRANTS[0]; // Quick Wins
  if (impact >= 5 && effort >= 5) return QUADRANTS[1]; // Major Projects
  if (impact < 5 && effort < 5) return QUADRANTS[2];   // Fill-Ins
  return QUADRANTS[3]; // Avoid
}

const EffortImpactMatrix = () => {
  const [items, setItems] = useState<Item[]>([
    { id: nextItemId++, name: "", effort: 5, impact: 5 },
  ]);

  const addItem = () => setItems((prev) => [...prev, { id: nextItemId++, name: "", effort: 5, impact: 5 }]);
  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };
  const update = (id: number, field: "name" | "effort" | "impact", value: string | number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const positioned = useMemo(
    () =>
      items.map((i) => ({
        ...i,
        quadrant: getQuadrant(i.effort, i.impact),
        x: (i.effort / 10) * 100,
        y: 100 - (i.impact / 10) * 100,
      })),
    [items]
  );

  const grouped = useMemo(() => {
    const g: Record<string, Item[]> = {};
    QUADRANTS.forEach((q) => (g[q.label] = []));
    items.forEach((i) => {
      if (i.name.trim()) {
        const q = getQuadrant(i.effort, i.impact);
        g[q.label].push(i);
      }
    });
    return g;
  }, [items]);

  return (
    <ToolCard
      title="Effort vs. Impact Matrix"
      subtitle="Plot initiatives on a 2×2 grid to identify quick wins and avoid low-value work."
    >
      <ToolInfo
        what="The Effort vs. Impact Matrix (also called the Impact-Effort Matrix or Value-Complexity Matrix) is a decision-making tool that plots initiatives on a 2×2 grid based on the effort required and the impact delivered."
        why="Use it for backlog prioritisation, feature triage, or any time you need to decide what to build next. It helps teams focus on Quick Wins (high impact, low effort) and avoid the Avoid quadrant (low impact, high effort)."
        how="1. List each initiative or feature. 2. Rate effort on a scale of 1-10 (1 = trivial, 10 = enormous). 3. Rate impact on a scale of 1-10 (1 = negligible, 10 = transformative). 4. The tool places your item on the grid. 5. Prioritise from Quick Wins → Major Projects → Fill-Ins, and drop items in Avoid."
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Matrix */}
        <div className="glass-card p-4 md:p-5">
          <div className="relative w-full aspect-square max-w-md mx-auto">
            {/* Grid background */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              {QUADRANTS.map((q) => {
                const bgColors: Record<string, string> = {
                  "Quick Wins": "bg-emerald-500/5",
                  "Major Projects": "bg-amber-500/5",
                  "Fill-Ins": "bg-sky-500/5",
                  "Avoid": "bg-red-500/5",
                };
                return (
                  <div
                    key={q.label}
                    className={`${bgColors[q.label]} border border-border/20 flex flex-col items-center justify-center p-2`}
                  >
                    <span className={`text-sm font-bold ${q.color} font-sans text-center leading-tight`}>
                      {q.label}
                    </span>
                    <span className="text-[8px] text-foreground/70 font-sans text-center mt-0.5 hidden sm:block">
                      {q.desc}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Axes labels */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 text-sm uppercase tracking-wider text-foreground/70 font-sans">
              Impact →
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm uppercase tracking-wider text-foreground/70 font-sans">
              Effort →
            </div>

            {/* Dots */}
            {positioned
              .filter((i) => i.name.trim())
              .map((item) => (
                <div
                  key={item.id}
                  className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-gold border-2 border-background shadow-md flex items-center justify-center cursor-default group z-10"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  title={item.name}
                >
                  <span className="text-[9px] font-bold text-background font-sans">
                    {item.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-foreground text-background text-sm font-sans px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                    {item.name}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Form */}
        <div className="glass-card p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-semibold text-foreground text-base">Items</h2>
            <button
              onClick={addItem}
              className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border/40 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground/70 font-mono">{String(i + 1).padStart(2, "0")}</span>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => update(item.id, "name", e.target.value)}
                  className="flex-1 bg-transparent border-b border-border/60 py-0.5 text-sm text-foreground font-sans placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="Item name"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-foreground/50 hover:text-red-400 transition-colors"
                  aria-label="Remove"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm uppercase tracking-wider text-foreground/70 font-sans mb-0.5">
                    Effort: {item.effort}
                  </label>
                  <input
                    type="range"
                    value={item.effort}
                    onChange={(e) => update(item.id, "effort", Number(e.target.value))}
                    min="1" max="10"
                    className="w-full accent-gold-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-wider text-foreground/70 font-sans mb-0.5">
                    Impact: {item.impact}
                  </label>
                  <input
                    type="range"
                    value={item.impact}
                    onChange={(e) => update(item.id, "impact", Number(e.target.value))}
                    min="1" max="10"
                    className="w-full accent-gold-dark"
                  />
                </div>
              </div>
              {item.name.trim() && (
                <p className={`text-sm font-medium font-sans ${getQuadrant(item.effort, item.impact).color}`}>
                  → {getQuadrant(item.effort, item.impact).label}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary */}
      {Object.values(grouped).some((g) => g.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-strong p-5 md:p-6"
        >
          <h2 className="font-serif font-semibold text-foreground text-base mb-3">Distribution</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUADRANTS.map((q) => {
              const count = grouped[q.label].length;
              return (
                <div key={q.label} className="text-center p-3 rounded-lg bg-background/50">
                  <p className={`text-sm font-bold ${q.color} font-sans`}>{q.label}</p>
                  <p className="text-2xl font-serif font-bold text-foreground mt-1">{count}</p>
                  <p className="text-sm text-foreground/70 font-sans">items</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default EffortImpactMatrix;
