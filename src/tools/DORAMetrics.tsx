import { useState, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from "recharts";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Period {
  id: number;
  label: string;
  deployFreq: string;
  leadTime: string;
  mttr: string;
  changeFailRate: string;
}

let nextId = 5;

const COLORS = {
  deployFreq: "hsl(42,78%,55%)",
  leadTime: "hsl(190,70%,55%)",
  mttr: "hsl(330,70%,60%)",
  changeFailRate: "hsl(0,70%,60%)",
};

const DORAMetrics = () => {
  const [periods, setPeriods] = useState<Period[]>([
    { id: 1, label: "Sprint 5", deployFreq: "8", leadTime: "4", mttr: "3", changeFailRate: "15" },
    { id: 2, label: "Sprint 6", deployFreq: "10", leadTime: "3.5", mttr: "2.5", changeFailRate: "12" },
    { id: 3, label: "Sprint 7", deployFreq: "12", leadTime: "3", mttr: "2", changeFailRate: "10" },
    { id: 4, label: "Sprint 8", deployFreq: "15", leadTime: "2.5", mttr: "1.5", changeFailRate: "8" },
  ]);
  const chartRef = useRef<HTMLDivElement>(null);

  const addPeriod = () => {
    const id = nextId++;
    const num = periods.length + 1;
    setPeriods((prev) => [...prev, { id, label: `Sprint ${num}`, deployFreq: "", leadTime: "", mttr: "", changeFailRate: "" }]);
  };
  const updatePeriod = (id: number, field: keyof Period, value: string) => {
    setPeriods((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };

  const data = useMemo(() => periods.map((p) => ({
    label: p.label,
    deployFreq: Number(p.deployFreq) || 0,
    leadTime: Number(p.leadTime) || 0,
    mttr: Number(p.mttr) || 0,
    changeFailRate: Number(p.changeFailRate) || 0,
  })), [periods]);

  const latest = data[data.length - 1];
  const prev = data.length >= 2 ? data[data.length - 2] : null;

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
        a.download = "dora-metrics.png";
        a.click();
      }, "image/png");
    };
    img.src = url;
  }, []);

  const classify = (metric: string, val: number) => {
    if (metric === "deployFreq") return val >= 10 ? "Elite" : val >= 6 ? "High" : val >= 1 ? "Medium" : "Low";
    if (metric === "leadTime") return val <= 1 ? "Elite" : val <= 7 ? "High" : val <= 30 ? "Medium" : "Low";
    if (metric === "mttr") return val <= 1 ? "Elite" : val <= 8 ? "High" : val <= 24 ? "Medium" : "Low";
    if (metric === "changeFailRate") return val <= 5 ? "Elite" : val <= 15 ? "High" : val <= 30 ? "Medium" : "Low";
    return "";
  };

  return (
    <ToolCard
      title="DORA Metrics Dashboard"
      subtitle="Track the four key DevOps Research & Assessment metrics: deploy frequency, lead time, MTTR, and change fail rate."
    >
      <ToolInfo
        what="The DORA metrics are four standardised measures of DevOps and delivery performance: 1) Deployment Frequency — how often you deploy to production, 2) Lead Time for Changes — time from commit to production, 3) Mean Time to Recover (MTTR) — time to restore service, 4) Change Failure Rate — % of changes causing failure."
        why="Use them to benchmark your team's delivery performance against industry standards (Elite, High, Medium, Low). Track trends sprint-over-sprint to see if process improvements are working."
        how="1. Record each metric per sprint or month. 2. Deploy Frequency = # of production deployments. 3. Lead Time = average hours/days from commit to production. 4. MTTR = average hours to recover from incidents. 5. Change Failure Rate = % of deployments causing incidents. 6. Compare to DORA benchmarks."
      />

      {/* Current metrics */}
      {latest && (
        <div className="glass-card-strong p-4 md:p-5">
          <h2 className="font-serif font-semibold text-foreground text-base mb-3">Latest ({latest.label})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              { key: "deployFreq", label: "Deploy Frequency", unit: "/week", good: "up" },
              { key: "leadTime", label: "Lead Time", unit: "days", good: "down" },
              { key: "mttr", label: "MTTR", unit: "hours", good: "down" },
              { key: "changeFailRate", label: "Change Fail Rate", unit: "%", good: "down" },
            ] as const).map((m) => {
              const val = latest[m.key as keyof typeof latest] as number;
              const cls = classify(m.key, val);
              const prevVal = prev ? (prev[m.key as keyof typeof prev] as number) : null;
              const trend = prevVal !== null ? val - prevVal : 0;
              const isGood = m.good === "up" ? trend >= 0 : trend <= 0;
              return (
                <div key={m.key} className="text-center p-3 rounded-lg bg-background/50">
                  <p className="text-sm text-foreground/70 font-sans">{m.label}</p>
                  <p className="text-xl md:text-2xl font-serif font-bold text-foreground mt-0.5">
                    {val} <span className="text-sm font-sans text-foreground/75">{m.unit}</span>
                  </p>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className={`text-sm font-medium font-sans px-1.5 py-0.5 rounded-full border ${
                      cls === "Elite" ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-500" :
                      cls === "High" ? "bg-sky-500/10 border-sky-400/30 text-sky-500" :
                      cls === "Medium" ? "bg-amber-500/10 border-amber-400/30 text-amber-500" :
                      "bg-red-500/10 border-red-400/30 text-red-400"
                    }`}>{cls}</span>
                    {prevVal !== null && trend !== 0 && (
                      <span className={`text-sm flex items-center gap-0.5 font-sans ${isGood ? "text-emerald-500" : "text-red-400"}`}>
                        {m.good === "up" ? (trend > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />) : (trend < 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />)}
                        {Math.abs(trend).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="glass-card-strong p-4 md:p-5" ref={chartRef}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif font-semibold text-foreground text-base">Trend</h2>
          <button onClick={exportPNG} className="flex items-center gap-1 text-sm text-foreground/70 hover:text-gold-dark transition-colors font-sans">
            <Download size={12} /> Export PNG
          </button>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,90%)" />
              <XAxis dataKey="label" stroke="hsl(220,10%,60%)" tick={{ fontSize: 11, fontFamily: "monospace" }} />
              <YAxis stroke="hsl(220,10%,60%)" tick={{ fontSize: 11, fontFamily: "monospace" }} />
              <ReTooltip contentStyle={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", border: "1px solid hsl(210,20%,90%)", borderRadius: "12px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "sans-serif" }} />
              <Line type="monotone" dataKey="deployFreq" stroke={COLORS.deployFreq} strokeWidth={2} dot={{ r: 3 }} name="Deploy Freq" />
              <Line type="monotone" dataKey="leadTime" stroke={COLORS.leadTime} strokeWidth={2} dot={{ r: 3 }} name="Lead Time" />
              <Line type="monotone" dataKey="mttr" stroke={COLORS.mttr} strokeWidth={2} dot={{ r: 3 }} name="MTTR" />
              <Line type="monotone" dataKey="changeFailRate" stroke={COLORS.changeFailRate} strokeWidth={2} dot={{ r: 3 }} name="Change Fail %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data */}
      <div className="glass-card p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif font-semibold text-foreground text-base">Periods</h2>
          <button onClick={addPeriod} className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans">
            <Plus size={14} /> Add Period
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left py-1.5 pr-3 text-sm text-foreground/70 font-medium">Period</th>
                <th className="text-center py-1.5 px-2 text-sm text-foreground/70 font-medium">Deploy/wk</th>
                <th className="text-center py-1.5 px-2 text-sm text-foreground/70 font-medium">Lead (d)</th>
                <th className="text-center py-1.5 px-2 text-sm text-foreground/70 font-medium">MTTR (h)</th>
                <th className="text-center py-1.5 px-2 text-sm text-foreground/70 font-medium">Fail %</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => (
                <tr key={p.id} className="border-b border-border/10">
                  <td className="py-1.5 pr-3">
                    <input type="text" value={p.label} onChange={(e) => updatePeriod(p.id, "label", e.target.value)}
                      className="bg-transparent text-sm text-foreground font-sans border-b border-transparent focus:border-gold/50 focus:outline-none w-16" />
                  </td>
                  {(["deployFreq", "leadTime", "mttr", "changeFailRate"] as const).map((field) => (
                    <td key={field} className="py-1 px-1">
                      <input type="number" value={p[field]} onChange={(e) => updatePeriod(p.id, field, e.target.value)}
                        className="w-full text-center bg-transparent text-sm text-foreground font-mono border-b border-transparent focus:border-gold/50 focus:outline-none" min="0" step="0.1" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default DORAMetrics;
