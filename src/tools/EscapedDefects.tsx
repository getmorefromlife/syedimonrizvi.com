import { useState, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Plus, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Cell } from "recharts";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Period {
  id: number;
  label: string;
  count: string;
}

let nextId = 9;

const EscapedDefects = () => {
  const [periods, setPeriods] = useState<Period[]>([
    { id: 1, label: "Sprint 1", count: "3" },
    { id: 2, label: "Sprint 2", count: "5" },
    { id: 3, label: "Sprint 3", count: "2" },
    { id: 4, label: "Sprint 4", count: "4" },
    { id: 5, label: "Sprint 5", count: "1" },
    { id: 6, label: "Sprint 6", count: "3" },
    { id: 7, label: "Sprint 7", count: "2" },
    { id: 8, label: "Sprint 8", count: "1" },
  ]);
  const chartRef = useRef<HTMLDivElement>(null);

  const addPeriod = () => {
    const id = nextId++;
    const num = periods.length + 1;
    setPeriods((prev) => [...prev, { id, label: `Sprint ${num}`, count: "" }]);
  };

  const removePeriod = (id: number) => {
    if (periods.length <= 2) return;
    setPeriods((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePeriod = (id: number, field: "label" | "count", value: string) => {
    setPeriods((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };

  const data = useMemo(() => periods.map((p) => ({ label: p.label, count: Number(p.count) || 0 })), [periods]);

  const stats = useMemo(() => {
    const vals = data.map((d) => d.count);
    if (vals.length === 0) return null;
    const total = vals.reduce((a, b) => a + b, 0);
    const avg = total / vals.length;
    const recent3 = vals.slice(-3);
    const trend = recent3.length >= 2 ? (recent3[recent3.length - 1] - recent3[0]) : 0;
    return { total, avg: avg.toFixed(1), max: Math.max(...vals), trend };
  }, [data]);

  const exportPNG = useCallback(async () => {
    if (!chartRef.current) return;
    const svg = chartRef.current.querySelector("svg");
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const blob = new Blob([clone.outerHTML], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = svg.clientWidth * 2;
      canvas.height = svg.clientHeight * 2;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(2, 2);
      ctx.fillStyle = "#faf9f7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((b) => {
        if (!b) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = "escaped-defects.png";
        a.click();
      }, "image/png");
    };
    img.src = url;
  }, []);

  return (
    <ToolCard
      title="Escaped Defects Trend"
      subtitle="Track defects that escape to production over time and spot quality trends."
    >
      <ToolInfo
        what="Escaped defects are bugs found by users after a release — they 'escaped' your testing process. Tracking them over time reveals whether quality is improving or degrading and helps justify investment in testing automation or process changes."
        why="Use it per sprint or release to monitor quality trends. A rising trend signals testing gaps — consider adding test cases, improving staging environments, or increasing code review rigour. A falling trend shows your quality investments are paying off."
        how="1. Record the number of production defects found per sprint/release. 2. The bar chart visualises the trend. 3. Look for patterns (e.g., spikes after large releases). 4. Set a target (e.g., zero high-severity escaped defects). 5. Investigate and act on upward trends."
      />

      <div className="grid lg:grid-cols-[1fr_260px] gap-6">
        {/* Chart */}
        <div className="glass-card-strong p-4 md:p-5" ref={chartRef}>
          <div className="h-56 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,90%)" />
                <XAxis dataKey="label" stroke="hsl(220,10%,60%)" tick={{ fontSize: 11, fontFamily: "monospace" }} />
                <YAxis stroke="hsl(220,10%,60%)" tick={{ fontSize: 11, fontFamily: "monospace" }} allowDecimals={false} />
                <ReTooltip contentStyle={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", border: "1px solid hsl(210,20%,90%)", borderRadius: "12px", fontSize: "12px" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.count >= (stats?.avg ? Number(stats.avg) : 0) ? "hsl(42,78%,55%)" : "hsl(42,78%,70%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-2 mt-2">
            <button onClick={exportPNG} className="flex items-center gap-1 text-sm text-foreground/70 hover:text-gold-dark transition-colors font-sans">
              <Download size={12} /> Export PNG
            </button>
          </div>
        </div>

        {/* Data */}
        <div className="glass-card p-4 md:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-semibold text-foreground text-base">Sprints</h2>
            <button onClick={addPeriod} className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans">
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="overflow-y-auto max-h-[300px] space-y-1.5 pr-1">
            {periods.map((p, i) => (
              <div key={p.id} className="flex items-center gap-1.5">
                <input type="text" value={p.label} onChange={(e) => updatePeriod(p.id, "label", e.target.value)}
                  className="w-16 bg-transparent text-sm text-foreground font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors" />
                <input type="number" value={p.count} onChange={(e) => updatePeriod(p.id, "count", e.target.value)}
                  className="w-12 text-center bg-transparent border-b border-border/60 py-0.5 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors" min="0" />
                <span className="text-sm text-foreground/50 font-sans">defects</span>
                <button onClick={() => removePeriod(p.id)} className="text-foreground/40 hover:text-red-400 transition-colors ml-auto" aria-label="Remove"><Trash2 size={10} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card-strong p-4 md:p-5">
          <h2 className="font-serif font-semibold text-foreground text-base mb-3">Quality Metrics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-xl font-serif font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-foreground/70 font-sans">Total Escaped</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-xl font-serif font-bold text-foreground">{stats.avg}</p>
              <p className="text-sm text-foreground/70 font-sans">Avg per Sprint</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-xl font-serif font-bold text-amber-500">{stats.max}</p>
              <p className="text-sm text-foreground/70 font-sans">Worst Sprint</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className={`text-xl font-serif font-bold ${stats.trend <= 0 ? "text-emerald-500" : "text-red-400"}`}>
                {stats.trend > 0 ? `+${stats.trend}` : stats.trend}
              </p>
              <p className="text-sm text-foreground/70 font-sans">Recent Trend</p>
            </div>
          </div>
        </motion.div>
      )}

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default EscapedDefects;
