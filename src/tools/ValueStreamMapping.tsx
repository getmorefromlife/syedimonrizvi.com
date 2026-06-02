import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, GripVertical } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Step {
  id: number;
  name: string;
  cycleTime: string;
  waitTime: string;
  pca: string;
}

let nextStepId = 4;

const VALUE_STREAM_EXAMPLE: Step[] = [
  { id: 1, name: "Request Received", cycleTime: "0.5", waitTime: "2", pca: "90" },
  { id: 2, name: "Analysis & Design", cycleTime: "3", waitTime: "5", pca: "80" },
  { id: 3, name: "Development", cycleTime: "8", waitTime: "10", pca: "70" },
  { id: 4, name: "Testing", cycleTime: "4", waitTime: "3", pca: "85" },
  { id: 5, name: "Deployment", cycleTime: "0.5", waitTime: "1", pca: "95" },
];

const ValueStreamMapping = () => {
  const [steps, setSteps] = useState<Step[]>(VALUE_STREAM_EXAMPLE);

  const addStep = () => {
    const num = steps.length + 1;
    setSteps((prev) => [...prev, { id: nextStepId++, name: `Step ${num}`, cycleTime: "", waitTime: "", pca: "" }]);
  };

  const removeStep = (id: number) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStep = (id: number, field: keyof Step, value: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const metrics = useMemo(() => {
    const valid = steps.filter((s) => Number(s.cycleTime) > 0 || Number(s.waitTime) > 0);
    if (valid.length === 0) return null;

    const totalProcessTime = valid.reduce((sum, s) => sum + (Number(s.cycleTime) || 0), 0);
    const totalWaitTime = valid.reduce((sum, s) => sum + (Number(s.waitTime) || 0), 0);
    const totalLeadTime = totalProcessTime + totalWaitTime;
    const avgPca = valid.reduce((sum, s) => sum + (Number(s.pca) || 100), 0) / valid.length;
    const totalRework = valid.reduce((sum, s) => sum + (100 - (Number(s.pca) || 100)), 0) / valid.length;
    const efficiency = totalLeadTime > 0 ? (totalProcessTime / totalLeadTime) * 100 : 0;

    return { totalProcessTime, totalWaitTime, totalLeadTime, avgPca, totalRework, efficiency, stepCount: valid.length };
  }, [steps]);

  return (
    <ToolCard
      title="Value Stream Mapping"
      subtitle="Map your process end-to-end: measure process time, wait time, and flow efficiency."
    >
      <ToolInfo
        what="Value Stream Mapping (VSM) is a lean-management tool that visualises every step required to deliver a product or service. It distinguishes value-adding (process time) from non-value-adding (wait time) activities and calculates flow efficiency."
        why="Use it to identify waste (muda), reduce lead time, improve flow efficiency, and target process improvements. Essential for Lean, Kanban, and continuous improvement initiatives."
        how="1. List each step in your end-to-end process (from request to delivery). 2. Enter the cycle/process time — the actual working time. 3. Enter the wait time — how long work sits between steps. 4. Enter %Complete & Accurate (%C&A) — the % of items that pass through without rework. 5. The tool calculates total lead time, process time, and flow efficiency. 6. Lower efficiency = more waste to eliminate."
      />

      {/* Legend */}
      <div className="glass-card p-3 flex flex-wrap gap-4 text-sm font-sans text-foreground/75">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/40" /> Process Time</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/40" /> Wait Time</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gold/40" /> %C&amp;A</span>
      </div>

      {/* Flow visualization */}
      <div className="glass-card p-4 md:p-5 overflow-x-auto">
        <div className="flex gap-3 min-w-max pb-2">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className="flex flex-col items-center min-w-[120px] max-w-[140px]">
                <div className="bg-gold/10 border border-gold/30 rounded-lg px-3 py-2 w-full text-center">
                  <p className="text-sm font-semibold text-foreground font-sans truncate">{step.name || "—"}</p>
                  <div className="flex justify-center gap-2 mt-1 text-[9px] font-mono">
                    <span className="text-emerald-600">{step.cycleTime || "—"}d</span>
                    <span className="text-amber-600">{step.waitTime || "—"}d</span>
                  </div>
                  {step.pca && <span className="text-[9px] text-gold-dark font-mono">{step.pca}%</span>}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="text-foreground/50 text-sm shrink-0">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Data table */}
      <div className="glass-card p-5 md:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-semibold text-foreground text-base">Process Steps</h2>
          <button
            onClick={addStep}
            className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans"
          >
            <Plus size={14} /> Add Step
          </button>
        </div>

        {/* Header */}
        <div className="hidden md:grid md:grid-cols-[1fr_90px_90px_90px_30px] gap-3 text-sm uppercase tracking-wider text-foreground/70 font-sans pb-1 border-b border-border/30">
          <span>Step</span>
          <span className="text-center">Process Time (d)</span>
          <span className="text-center">Wait Time (d)</span>
          <span className="text-center">%C&amp;A</span>
          <span />
        </div>

        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-[1fr_90px_90px_90px_30px] gap-2 items-center border border-border/40 rounded-xl p-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground/70 font-mono shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <input
                type="text"
                value={step.name}
                onChange={(e) => updateStep(step.id, "name", e.target.value)}
                className="flex-1 bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-sans placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Step name"
              />
            </div>
            <input
              type="number"
              value={step.cycleTime}
              onChange={(e) => updateStep(step.id, "cycleTime", e.target.value)}
              className="w-full text-center bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="0"
              min="0"
              step="0.5"
            />
            <input
              type="number"
              value={step.waitTime}
              onChange={(e) => updateStep(step.id, "waitTime", e.target.value)}
              className="w-full text-center bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="0"
              min="0"
              step="0.5"
            />
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={step.pca}
                onChange={(e) => updateStep(step.id, "pca", e.target.value)}
                className="w-full text-center bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="100"
                min="0"
                max="100"
              />
              <span className="text-sm text-foreground/50 font-sans">%</span>
            </div>
            <button
              onClick={() => removeStep(step.id)}
              className="text-foreground/50 hover:text-red-400 transition-colors justify-self-center"
              aria-label="Remove step"
            >
              <Trash2 size={13} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      {metrics && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-strong p-5 md:p-6"
        >
          <h2 className="font-serif font-semibold text-foreground text-base mb-3">Flow Metrics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-sm text-foreground/70 font-sans">Total Lead Time</p>
              <p className="text-xl md:text-2xl font-serif font-bold text-foreground">
                {metrics.totalLeadTime.toFixed(1)} <span className="text-sm font-sans text-foreground/75">d</span>
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-sm text-foreground/70 font-sans">Process Time</p>
              <p className="text-xl md:text-2xl font-serif font-bold text-emerald-600">
                {metrics.totalProcessTime.toFixed(1)} <span className="text-sm font-sans text-foreground/75">d</span>
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-sm text-foreground/70 font-sans">Wait Time</p>
              <p className="text-xl md:text-2xl font-serif font-bold text-amber-600">
                {metrics.totalWaitTime.toFixed(1)} <span className="text-sm font-sans text-foreground/75">d</span>
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-sm text-foreground/70 font-sans">Flow Efficiency</p>
              <p className={`text-xl md:text-2xl font-serif font-bold ${metrics.efficiency > 30 ? "text-emerald-500" : metrics.efficiency > 15 ? "text-amber-500" : "text-red-400"}`}>
                {metrics.efficiency.toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-sm text-foreground/70 font-sans">Avg %C&amp;A</p>
              <p className="text-xl md:text-2xl font-serif font-bold text-gold-dark">
                {metrics.avgPca.toFixed(0)}%
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-sm text-foreground/70 font-sans">Steps</p>
              <p className="text-xl md:text-2xl font-serif font-bold text-foreground">
                {metrics.stepCount}
              </p>
            </div>
          </div>
          <p className="text-sm text-foreground/60 font-sans mt-3 text-center">
            {metrics.efficiency < 20
              ? "Your process has significant waste — focus on reducing wait time between steps."
              : metrics.efficiency < 40
                ? "Moderate efficiency. Look for bottleneck steps with high wait/process time ratios."
                : "Good flow efficiency. Continue monitoring for degradation."}
          </p>
        </motion.div>
      )}

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default ValueStreamMapping;
