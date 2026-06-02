import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import { Plus, Trash2 } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Item {
  id: number;
  name: string;
  cycleTime: string;
  leadTime: string;
}

let nextId = 5;

const CycleVsLeadTime = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Story A", cycleTime: "3", leadTime: "8" },
    { id: 2, name: "Story B", cycleTime: "5", leadTime: "12" },
    { id: 3, name: "Story C", cycleTime: "2", leadTime: "6" },
    { id: 4, name: "Story D", cycleTime: "8", leadTime: "20" },
    { id: 5, name: "Story E", cycleTime: "4", leadTime: "10" },
  ]);

  const addItem = () => {
    const max = items.reduce((m, i) => Math.max(m, i.id), 0);
    setItems((prev) => [...prev, { id: max + 1, name: "", cycleTime: "", leadTime: "" }]);
  };

  const removeItem = (id: number) => {
    if (items.length <= 2) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: number, field: keyof Item, value: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const chartData = useMemo(
    () =>
      items
        .map((i) => ({
          name: i.name || `Item ${i.id}`,
          cycleTime: Number(i.cycleTime) || 0,
          leadTime: Number(i.leadTime) || 0,
          waitTime: (Number(i.leadTime) || 0) - (Number(i.cycleTime) || 0),
        }))
        .filter((d) => d.cycleTime > 0 && d.leadTime > 0),
    [items]
  );

  const stats = useMemo(() => {
    if (chartData.length === 0) return null;
    const avgCycle = chartData.reduce((s, d) => s + d.cycleTime, 0) / chartData.length;
    const avgLead = chartData.reduce((s, d) => s + d.leadTime, 0) / chartData.length;
    const avgWait = chartData.reduce((s, d) => s + d.waitTime, 0) / chartData.length;
    const eff = avgLead > 0 ? (avgCycle / avgLead) * 100 : 0;
    return { avgCycle, avgLead, avgWait, efficiency: eff, n: chartData.length };
  }, [chartData]);

  return (
    <ToolCard
      title="Cycle Time vs. Lead Time"
      subtitle="Compare active working time against total delivery time to measure flow efficiency."
    >
      <ToolInfo
        what="Cycle Time is the time a work item is actively being worked on. Lead Time is the total time from request to delivery (including waiting). The gap between them represents waste — time spent waiting in queues. Flow Efficiency = Cycle Time ÷ Lead Time."
        why="Use it to diagnose process bottlenecks, measure the impact of WIP limits, and track improvements in flow efficiency over time. A widening gap signals growing queues."
        how="1. Enter items with their cycle time (active work) and lead time (total end-to-end). 2. The scatter plot shows each item — the closer to the diagonal line, the higher the flow efficiency. 3. Items far above the line have significant wait time. 4. Track flow efficiency over time to measure improvement."
      />

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Chart */}
        <div className="glass-card-strong p-4 md:p-5">
          <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,90%)" />
                <XAxis
                  dataKey="cycleTime"
                  stroke="hsl(220,10%,60%)"
                  tick={{ fontSize: 11, fontFamily: "monospace" }}
                  label={{ value: "Cycle Time (days)", position: "insideBottom", offset: -4, style: { fontSize: 10, fill: "hsl(220,10%,60%)", fontFamily: "sans-serif" } }}
                />
                <YAxis
                  stroke="hsl(220,10%,60%)"
                  tick={{ fontSize: 11, fontFamily: "monospace" }}
                  label={{ value: "Lead Time (days)", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "hsl(220,10%,60%)", fontFamily: "sans-serif" } }}
                />
                <ReTooltip
                  contentStyle={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", border: "1px solid hsl(210,20%,90%)", borderRadius: "12px", fontSize: "12px" }}
                  formatter={(value: number, name: string) => [`${value}d`, name === "cycleTime" ? "Cycle Time" : "Lead Time"]}
                />
                <ReferenceLine
                  y={0}
                  stroke="hsl(220,10%,70%)"
                  strokeWidth={0.5}
                />
                <ReferenceLine
                  x={0}
                  stroke="hsl(220,10%,70%)"
                  strokeWidth={0.5}
                />
                <Scatter
                  data={chartData}
                  fill="hsl(42,78%,55%)"
                  stroke="hsl(42,78%,45%)"
                  strokeWidth={0.5}
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data entry */}
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

          <div className="overflow-y-auto max-h-[400px] space-y-2 pr-1">
            {items.map((item, i) => (
              <div key={item.id} className="border border-border/40 rounded-lg p-2.5 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-foreground/60 font-mono">{String(i + 1).padStart(2, "0")}</span>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    className="flex-1 bg-transparent border-b border-border/60 py-0.5 text-sm text-foreground font-sans placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Name"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-foreground/40 hover:text-red-400 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] text-foreground/70 font-sans">Cycle (d)</label>
                    <input
                      type="number"
                      value={item.cycleTime}
                      onChange={(e) => updateItem(item.id, "cycleTime", e.target.value)}
                      className="w-full bg-transparent border-b border-border/60 py-0.5 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
                      placeholder="0"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-foreground/70 font-sans">Lead (d)</label>
                    <input
                      type="number"
                      value={item.leadTime}
                      onChange={(e) => updateItem(item.id, "leadTime", e.target.value)}
                      className="w-full bg-transparent border-b border-border/60 py-0.5 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
                      placeholder="0"
                      min="0"
                      step="0.5"
                    />
                  </div>
                </div>
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
          <h2 className="font-serif font-semibold text-foreground text-base mb-3">Flow Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-sm text-foreground/70 font-sans">Avg Cycle Time</p>
              <p className="text-lg font-serif font-bold text-emerald-500">{stats.avgCycle.toFixed(1)}d</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-sm text-foreground/70 font-sans">Avg Lead Time</p>
              <p className="text-lg font-serif font-bold text-foreground">{stats.avgLead.toFixed(1)}d</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-sm text-foreground/70 font-sans">Avg Wait Time</p>
              <p className="text-lg font-serif font-bold text-amber-500">{stats.avgWait.toFixed(1)}d</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-sm text-foreground/70 font-sans">Flow Efficiency</p>
              <p className={`text-lg font-serif font-bold ${stats.efficiency > 40 ? "text-emerald-500" : stats.efficiency > 20 ? "text-amber-500" : "text-red-400"}`}>
                {stats.efficiency.toFixed(1)}%
              </p>
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

export default CycleVsLeadTime;
