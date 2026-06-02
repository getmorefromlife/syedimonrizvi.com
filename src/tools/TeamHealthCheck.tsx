import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Metric {
  id: number;
  name: string;
  score: number;
}

const DEFAULT_METRICS: Metric[] = [
  { id: 1, name: "Morale", score: 7 },
  { id: 2, name: "Workload", score: 6 },
  { id: 3, name: "Collaboration", score: 8 },
  { id: 4, name: "Clarity", score: 5 },
  { id: 5, name: "Growth", score: 6 },
  { id: 6, name: "Psychological Safety", score: 7 },
];

let nextMetricId = 7;

const TeamHealthCheck = () => {
  const [metrics, setMetrics] = useState<Metric[]>(DEFAULT_METRICS);
  const [teamName, setTeamName] = useState("");

  const addMetric = () => {
    const id = nextMetricId++;
    setMetrics((prev) => [...prev, { id, name: "", score: 5 }]);
  };

  const removeMetric = (id: number) => {
    if (metrics.length <= 2) return;
    setMetrics((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMetric = (id: number, field: "name" | "score", value: string | number) => {
    setMetrics((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const stats = useMemo(() => {
    const scores = metrics.filter((m) => m.name.trim()).map((m) => m.score);
    if (scores.length === 0) return null;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const lowCount = scores.filter((s) => s < 5).length;
    const goodCount = scores.filter((s) => s >= 7).length;
    return { avg, min, max, lowCount, goodCount, n: scores.length };
  }, [metrics]);

  // Compute radar points
  const radarPoints = useMemo(() => {
    const valid = metrics.filter((m) => m.name.trim());
    const n = valid.length;
    if (n < 3) return null;
    const cx = 150, cy = 150, r = 120;
    const points = valid.map((m, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const value = m.score / 10;
      return { x: cx + r * value * Math.cos(angle), y: cy + r * value * Math.sin(angle) };
    });
    const labels = valid.map((m, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      return { x: cx + (r + 20) * Math.cos(angle), y: cy + (r + 20) * Math.sin(angle), name: m.name };
    });
    return { points, labels, cx, cy, r };
  }, [metrics]);

  return (
    <ToolCard
      title="Team Health Check"
      subtitle="Run a quick team health radar across key dimensions — morale, workload, collaboration, and more."
    >
      <ToolInfo
        what="The Team Health Check (popularised by Spotify) is a lightweight pulse survey where team members rate the team across multiple dimensions. The radar chart visualises strengths and areas for improvement at a glance."
        why="Run it every 2-4 weeks in retrospectives to track team health trends. Early warning signals (scores below 5) help address issues before they escalate. Teams that measure health regularly improve faster."
        how="1. Agree on dimensions to measure (defaults: Morale, Workload, Collaboration, Clarity, Growth, Safety). 2. Each team member rates each dimension 1-10. 3. Average the scores and plot on the radar. 4. Discuss scores below 5 — identify root causes and action items. 5. Track trends over time."
      />

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Radar chart */}
        <div className="glass-card-strong p-4 md:p-5 flex items-center justify-center">
          {radarPoints ? (
            <svg viewBox="0 0 320 320" className="w-full max-w-[320px] h-auto">
              {/* Grid */}
              {[0.2, 0.4, 0.6, 0.8, 1].map((pct) => (
                <polygon key={pct} points={radarPoints.points.map((p, i) => {
                  const angle = (Math.PI * 2 * i) / radarPoints.points.length - Math.PI / 2;
                  return `${radarPoints.cx + radarPoints.r * pct * Math.cos(angle)},${radarPoints.cy + radarPoints.r * pct * Math.sin(angle)}`;
                }).join(" ")} fill="none" stroke="hsl(210,20%,90%)" strokeWidth="1" />
              ))}
              {/* Axes */}
              {radarPoints.points.map((_, i) => {
                const angle = (Math.PI * 2 * i) / radarPoints.points.length - Math.PI / 2;
                return <line key={i} x1={radarPoints.cx} y1={radarPoints.cy} x2={radarPoints.cx + radarPoints.r * Math.cos(angle)} y2={radarPoints.cy + radarPoints.r * Math.sin(angle)} stroke="hsl(210,20%,90%)" strokeWidth="1" />;
              })}
              {/* Data area */}
              <polygon points={radarPoints.points.map((p) => `${p.x},${p.y}`).join(" ")} fill="hsl(42,78%,55%,0.2)" stroke="hsl(42,78%,55%)" strokeWidth="2" />
              {/* Data points */}
              {radarPoints.points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="hsl(42,78%,55%)" />)}
              {/* Labels */}
              {radarPoints.labels.map((l, i) => (
                <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle" fill="hsl(220,10%,60%)" fontSize="11" fontFamily="sans-serif">
                  {l.name}
                </text>
              ))}
            </svg>
          ) : (
            <p className="text-sm text-muted-foreground/40 font-sans py-16">Add at least 3 metrics to see the radar</p>
          )}
        </div>

        {/* Metrics */}
        <div className="glass-card p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-semibold text-foreground text-sm">Dimensions</h2>
            <button onClick={addMetric} className="flex items-center gap-1 text-xs font-medium text-gold-dark hover:text-gold transition-colors font-sans">
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {metrics.map((m, i) => (
              <div key={m.id} className="border border-border/40 rounded-lg p-2.5 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground/40 font-mono shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <input type="text" value={m.name} onChange={(e) => updateMetric(m.id, "name", e.target.value)}
                    className="flex-1 bg-transparent border-b border-border/60 py-0.5 text-xs text-foreground font-sans placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/50 transition-colors" placeholder="Dimension" />
                  <span className={`text-xs font-mono font-bold ${m.score < 5 ? "text-red-400" : m.score >= 7 ? "text-emerald-500" : "text-amber-500"}`}>{m.score}</span>
                  <button onClick={() => removeMetric(m.id)} className="text-muted-foreground/20 hover:text-red-400 transition-colors" aria-label="Remove"><Trash2 size={10} /></button>
                </div>
                <input type="range" value={m.score} onChange={(e) => updateMetric(m.id, "score", Number(e.target.value))} min="1" max="10" step="1" className="w-full accent-gold-dark" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card-strong p-4 md:p-5">
          <h2 className="font-serif font-semibold text-foreground text-sm mb-3">Health Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-2xl font-serif font-bold gold-text">{stats.avg.toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground/50 font-sans">Average</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-2xl font-serif font-bold text-foreground">{stats.n}</p>
              <p className="text-[10px] text-muted-foreground/50 font-sans">Dimensions</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-2xl font-serif font-bold text-emerald-500">{stats.goodCount}</p>
              <p className="text-[10px] text-muted-foreground/50 font-sans">Healthy (&#8805;7)</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-2xl font-serif font-bold text-red-400">{stats.lowCount}</p>
              <p className="text-[10px] text-muted-foreground/50 font-sans">At Risk (&lt;5)</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-lg font-serif font-bold text-foreground">{stats.min} — {stats.max}</p>
              <p className="text-[10px] text-muted-foreground/50 font-sans">Range</p>
            </div>
          </div>
        </motion.div>
      )}

      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/30 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default TeamHealthCheck;
