import { useState, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Legend } from "recharts";
import ToolCard from "./ToolCard";

function generateIdeal(days: number, total: number) {
  return Array.from({ length: days + 1 }, (_, i) => ({
    day: i,
    ideal: Math.round((total * (1 - i / days)) * 10) / 10,
  }));
}

const BurndownChart = () => {
  const [days, setDays] = useState(10);
  const [totalPoints, setTotalPoints] = useState(40);
  const [remaining, setRemaining] = useState<Record<number, string>>({});
  const chartRef = useRef<HTMLDivElement>(null);

  const updateRemaining = (day: number, value: string) => {
    setRemaining((prev) => ({ ...prev, [day]: value }));
  };

  const ideal = useMemo(() => generateIdeal(days, totalPoints), [days, totalPoints]);

  const chartData = useMemo(() => {
    const actualMap = { ...remaining };
    // Day 0 is always totalPoints
    if (!actualMap[0]) actualMap[0] = String(totalPoints);
    return ideal.map((d) => ({
      day: d.day,
      ideal: d.ideal,
      actual: Number(actualMap[d.day]) ?? null,
    }));
  }, [ideal, remaining, totalPoints]);

  const reset = () => {
    setRemaining({});
  };

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
        a.download = "burndown-chart.png";
        a.click();
      }, "image/png");
    };
    img.src = url;
  }, []);

  return (
    <ToolCard
      title="Burndown Chart Generator"
      subtitle="Visualise sprint progress with ideal vs. actual burndown. Export as PNG for your standup."
    >
      {/* Settings */}
      <div className="glass-card p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs uppercase tracking-wider text-muted-foreground/60 font-sans mb-1.5">
              Sprint Days
            </label>
            <input
              type="number"
              value={days}
              onChange={(e) => {
                const v = Math.max(1, Math.min(60, Number(e.target.value)));
                setDays(v);
              }}
              className="w-full bg-transparent border-b border-border/60 py-2 text-lg text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
              min="1"
              max="60"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs uppercase tracking-wider text-muted-foreground/60 font-sans mb-1.5">
              Total Story Points
            </label>
            <input
              type="number"
              value={totalPoints}
              onChange={(e) => {
                const v = Math.max(1, Number(e.target.value));
                setTotalPoints(v);
              }}
              className="w-full bg-transparent border-b border-border/60 py-2 text-lg text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
              min="1"
            />
          </div>
          <div className="flex items-end pb-2">
            <button
              onClick={reset}
              className="text-xs text-muted-foreground/50 hover:text-gold-dark transition-colors font-sans"
            >
              Reset data
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card-strong p-6 md:p-8" ref={chartRef}>
        <div className="h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,90%)" />
              <XAxis
                dataKey="day"
                stroke="hsl(220,10%,60%)"
                tick={{ fontSize: 12, fontFamily: "monospace" }}
                label={{ value: "Day", position: "insideBottom", offset: -4, style: { fontSize: 11, fill: "hsl(220,10%,60%)", fontFamily: "sans-serif" } }}
              />
              <YAxis
                stroke="hsl(220,10%,60%)"
                tick={{ fontSize: 12, fontFamily: "monospace" }}
                label={{ value: "Points", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "hsl(220,10%,60%)", fontFamily: "sans-serif" } }}
              />
              <ReTooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid hsl(210,20%,90%)",
                  borderRadius: "12px",
                  fontSize: "13px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", fontFamily: "sans-serif" }}
              />
              <Line
                type="monotone"
                dataKey="ideal"
                stroke="hsl(220,10%,70%)"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                name="Ideal"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(42,78%,55%)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "hsl(42,78%,55%)", strokeWidth: 0 }}
                name="Actual"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily data entry */}
      <div className="glass-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-semibold text-foreground text-lg">
            Daily Remaining Points
          </h2>
          <button
            onClick={exportPNG}
            className="flex items-center gap-1.5 text-xs font-medium text-gold-dark hover:text-gold transition-colors font-sans"
          >
            <Download size={14} /> Export PNG
          </button>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: days + 1 }, (_, i) => (
            <div key={i} className="text-center">
              <span className="text-[10px] text-muted-foreground/50 font-mono block mb-1">
                D{i}
              </span>
              <input
                type="number"
                value={remaining[i] ?? ""}
                onChange={(e) => updateRemaining(i, e.target.value)}
                className="w-full text-center bg-transparent border border-border/40 rounded-lg py-1.5 text-sm text-foreground font-mono placeholder:text-muted-foreground/30 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder={i === 0 ? String(totalPoints) : ""}
                min="0"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/30 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default BurndownChart;
