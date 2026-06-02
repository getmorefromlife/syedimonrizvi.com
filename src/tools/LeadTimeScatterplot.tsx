import { useState, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Plus, Trash2 } from "lucide-react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea,
} from "recharts";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Point {
  id: number;
  leadTime: string;
}

let nextId = 3;

const LeadTimeScatterplot = () => {
  const [points, setPoints] = useState<Point[]>([
    { id: 1, leadTime: "5" },
    { id: 2, leadTime: "8" },
    { id: 3, leadTime: "3" },
    { id: 4, leadTime: "12" },
    { id: 5, leadTime: "6" },
    { id: 6, leadTime: "4" },
    { id: 7, leadTime: "15" },
    { id: 8, leadTime: "7" },
    { id: 9, leadTime: "9" },
    { id: 10, leadTime: "5" },
  ]);
  const chartRef = useRef<HTMLDivElement>(null);

  const addPoint = () => {
    const max = points.reduce((m, p) => Math.max(m, p.id), 0);
    setPoints((prev) => [...prev, { id: max + 1, leadTime: "" }]);
  };

  const removePoint = (id: number) => {
    if (points.length <= 3) return;
    setPoints((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePoint = (id: number, value: string) => {
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, leadTime: value } : p)));
  };

  const data = useMemo(
    () =>
      points
        .map((p, i) => ({ x: i + 1, y: Number(p.leadTime) }))
        .filter((d) => !isNaN(d.y) && d.y > 0),
    [points]
  );

  const stats = useMemo(() => {
    const vals = data.map((d) => d.y).sort((a, b) => a - b);
    if (vals.length === 0) return null;
    const n = vals.length;
    const sum = vals.reduce((a, b) => a + b, 0);
    const avg = sum / n;
    const median = n % 2 !== 0 ? vals[Math.floor(n / 2)] : (vals[n / 2 - 1] + vals[n / 2]) / 2;
    const p85 = vals[Math.ceil(n * 0.85) - 1] || vals[n - 1];
    const p95 = vals[Math.ceil(n * 0.95) - 1] || vals[n - 1];
    return { avg, median, p85, p95, min: vals[0], max: vals[n - 1], n };
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
        a.download = "lead-time-scatterplot.png";
        a.click();
      }, "image/png");
    };
    img.src = url;
  }, []);

  return (
    <ToolCard
      title="Lead Time Scatterplot"
      subtitle="Plot individual item lead times over time to visualise trends, outliers, and percentiles."
    >
      <ToolInfo
        what="A Lead Time Scatterplot displays each completed work item's lead time (from request to delivery) over time. It reveals trends, seasonality, outliers, and helps set service-level expectations using percentile lines (50th, 85th, 95th)."
        why="Use it to monitor delivery predictability, set realistic stakeholder expectations, detect process degradation early, and identify which items are taking unusually long."
        how="1. Enter lead times (in days) for each completed item, in chronological order. 2. The chart plots each item as a dot. 3. Percentile lines (50th/median, 85th, 95th) help set service-level agreements. 4. Outliers above the 95th percentile warrant investigation. 5. Export the chart for standup or reporting."
      />

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Chart */}
        <div className="glass-card-strong p-4 md:p-5" ref={chartRef}>
          <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,90%)" />
                <XAxis
                  dataKey="x"
                  stroke="hsl(220,10%,60%)"
                  tick={{ fontSize: 11, fontFamily: "monospace" }}
                  label={{ value: "Item (chronological)", position: "insideBottom", offset: -4, style: { fontSize: 10, fill: "hsl(220,10%,60%)", fontFamily: "sans-serif" } }}
                />
                <YAxis
                  stroke="hsl(220,10%,60%)"
                  tick={{ fontSize: 11, fontFamily: "monospace" }}
                  label={{ value: "Lead Time (days)", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "hsl(220,10%,60%)", fontFamily: "sans-serif" } }}
                />
                <ReTooltip
                  contentStyle={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", border: "1px solid hsl(210,20%,90%)", borderRadius: "12px", fontSize: "12px" }}
                  formatter={(value: number) => [`${value} days`, "Lead Time"]}
                  labelFormatter={(label) => `Item #${label}`}
                />
                <Scatter
                  data={data}
                  fill="hsl(42,78%,55%)"
                  stroke="hsl(42,78%,45%)"
                  strokeWidth={0.5}
                  shape="circle"
                />
                {stats && (
                  <>
                    <ReferenceLine y={stats.p95} stroke="hsl(0,70%,60%)" strokeDasharray="6 4" strokeWidth={1.5} />
                    <ReferenceLine y={stats.p85} stroke="hsl(35,80%,55%)" strokeDasharray="4 4" strokeWidth={1.5} />
                    <ReferenceLine y={stats.median} stroke="hsl(150,50%,50%)" strokeDasharray="4 4" strokeWidth={1.5} />
                  </>
                )}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-[10px] font-sans">
            {stats && (
              <>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 inline-block" /> Median ({stats.median}d)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500 inline-block" /> 85th ({stats.p85}d)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 inline-block" /> 95th ({stats.p95}d)</span>
              </>
            )}
          </div>
        </div>

        {/* Data entry */}
        <div className="glass-card p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-semibold text-foreground text-sm">Items</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={exportPNG}
                className="text-muted-foreground/40 hover:text-gold-dark transition-colors"
                aria-label="Export PNG"
              >
                <Download size={14} />
              </button>
              <button
                onClick={addPoint}
                className="flex items-center gap-1 text-xs font-medium text-gold-dark hover:text-gold transition-colors font-sans"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[320px] space-y-1.5 pr-1">
            {points.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground/40 font-mono w-6 shrink-0">
                  #{i + 1}
                </span>
                <input
                  type="number"
                  value={p.leadTime}
                  onChange={(e) => updatePoint(p.id, e.target.value)}
                  className="flex-1 bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="days"
                  min="0"
                  step="0.5"
                />
                <span className="text-[10px] text-muted-foreground/30 font-sans w-6">d</span>
                <button
                  onClick={() => removePoint(p.id)}
                  className="text-muted-foreground/20 hover:text-red-400 transition-colors"
                  aria-label="Remove"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-strong p-5 md:p-6"
        >
          <h2 className="font-serif font-semibold text-foreground text-sm mb-3">Service-Level Percentiles</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-[10px] text-muted-foreground/50 font-sans">Min</p>
              <p className="text-lg font-serif font-bold text-foreground">{stats.min}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-[10px] text-muted-foreground/50 font-sans">Median (P50)</p>
              <p className="text-lg font-serif font-bold text-emerald-500">{stats.median}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-[10px] text-muted-foreground/50 font-sans">Average</p>
              <p className="text-lg font-serif font-bold text-foreground">{stats.avg.toFixed(1)}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-[10px] text-muted-foreground/50 font-sans">P85</p>
              <p className="text-lg font-serif font-bold text-amber-500">{stats.p85}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-[10px] text-muted-foreground/50 font-sans">P95</p>
              <p className="text-lg font-serif font-bold text-red-500">{stats.p95}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-[10px] text-muted-foreground/50 font-sans">Max</p>
              <p className="text-lg font-serif font-bold text-foreground">{stats.max}</p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground/40 font-sans mt-3 text-center">
            {stats.n} items ·{" "}
            {stats.p95 <= stats.median * 3
              ? "Predictable process ✓"
              : "High variability — investigate outliers"}
          </p>
        </motion.div>
      )}

      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/30 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default LeadTimeScatterplot;
