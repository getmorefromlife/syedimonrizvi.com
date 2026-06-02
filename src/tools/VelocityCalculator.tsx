import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import ToolCard from "./ToolCard";

interface SprintRow {
  id: number;
  name: string;
  points: string;
}

let nextId = 1;

function stats(points: number[]) {
  const n = points.length;
  if (n === 0) return null;
  const sum = points.reduce((a, b) => a + b, 0);
  const avg = sum / n;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const variance = points.reduce((acc, p) => acc + (p - avg) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);
  const trend =
    n >= 3
      ? points[n - 1] > points[0]
        ? "up"
        : points[n - 1] < points[0]
          ? "down"
          : "flat"
      : null;
  return { avg, min, max, stdDev, trend, n };
}

const VelocityCalculator = () => {
  const [rows, setRows] = useState<SprintRow[]>([{ id: nextId++, name: "Sprint 1", points: "" }]);
  const [backlog, setBacklog] = useState("");

  const points = useMemo(
    () => rows.map((r) => Number(r.points)).filter((v) => !isNaN(v) && v > 0),
    [rows]
  );
  const s = useMemo(() => stats(points), [points]);

  const addRow = () => {
    const num = rows.length + 1;
    setRows((prev) => [...prev, { id: nextId++, name: `Sprint ${num}`, points: "" }]);
  };

  const removeRow = (id: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: number, field: "name" | "points", value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const backlogNum = Number(backlog);
  const predictedSprints =
    s && backlogNum > 0 ? Math.ceil(backlogNum / s.avg) : null;

  const TrendIcon = s?.trend === "up" ? TrendingUp : s?.trend === "down" ? TrendingDown : Minus;

  return (
    <ToolCard
      title="Velocity Calculator"
      subtitle="Track your team's velocity across sprints and forecast backlog completion."
    >
      {/* Results */}
      <AnimatePresence>
        {s && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-strong p-8 md:p-10 text-center mb-8"
          >
            <p className="text-sm uppercase tracking-widest text-foreground/80 font-sans mb-1">
              Average Velocity
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-6xl md:text-7xl font-serif font-bold gold-text">
                {s.avg.toFixed(1)}
            </span>
              {s.trend && (
                <TrendIcon
                  size={28}
                  className={s.trend === "up" ? "text-emerald-500" : s.trend === "down" ? "text-red-400" : "text-foreground/75"}
                />
              )}
            </div>
            <div className="flex justify-center gap-8 mt-5 text-sm font-sans">
              <div>
                <span className="text-foreground/75">Min </span>
                <span className="text-foreground font-medium">{s.min}</span>
              </div>
              <div>
                <span className="text-foreground/75">Max </span>
                <span className="text-foreground font-medium">{s.max}</span>
              </div>
              <div>
                <span className="text-foreground/75">σ </span>
                <span className="text-foreground font-medium">{s.stdDev.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-foreground/75">Sprints </span>
                <span className="text-foreground font-medium">{s.n}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sprint rows */}
      <div className="glass-card p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif font-semibold text-foreground text-lg">Sprint History</h2>
          <button
            onClick={addRow}
            className="flex items-center gap-1.5 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans"
          >
            <Plus size={14} /> Add Sprint
          </button>
        </div>

        {rows.map((row, i) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3"
          >
            <span className="text-sm text-foreground/70 font-mono w-5 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <input
              type="text"
              value={row.name}
              onChange={(e) => updateRow(row.id, "name", e.target.value)}
              className="flex-1 min-w-0 bg-transparent border-b border-border/60 py-2 text-sm text-foreground font-sans placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="Sprint name"
            />
            <input
              type="number"
              value={row.points}
              onChange={(e) => updateRow(row.id, "points", e.target.value)}
              className="w-20 text-right bg-transparent border-b border-border/60 py-2 text-sm text-foreground font-mono placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="0"
              min="0"
              step="0.5"
            />
            <button
              onClick={() => removeRow(row.id)}
              className="p-1.5 text-foreground/60 hover:text-red-400 transition-colors"
              aria-label="Remove sprint"
            >
              <Trash2 size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Backlog prediction */}
      <div className="glass-card p-6 md:p-8">
        <h2 className="font-serif font-semibold text-foreground text-lg mb-4">
          Backlog Forecast
        </h2>
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm uppercase tracking-wider text-foreground/80 font-sans mb-1.5">
              Remaining Story Points
            </label>
            <input
              type="number"
              value={backlog}
              onChange={(e) => setBacklog(e.target.value)}
              className="w-full bg-transparent border-b border-border/60 py-2 text-lg text-foreground font-mono placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="0"
              min="0"
            />
          </div>
          <div className="text-center shrink-0 pb-2">
            {predictedSprints !== null ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold font-serif gold-text">
                  {predictedSprints}
                </span>
                <span className="text-sm text-foreground/75 font-sans">
                  sprints needed
                </span>
              </div>
            ) : (
              <p className="text-sm text-foreground/70 font-sans">
                Enter points to forecast
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Zen footer */}
      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default VelocityCalculator;
