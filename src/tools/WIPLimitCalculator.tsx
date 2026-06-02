import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

const WIPLimitCalculator = () => {
  const [teamSize, setTeamSize] = useState(5);
  const [flowEfficiency, setFlowEfficiency] = useState(0.3);
  const [targetCycleDays, setTargetCycleDays] = useState(5);
  const [avgDemandPerDay, setAvgDemandPerDay] = useState(1.5);

  const results = useMemo(() => {
    const arrivalRate = avgDemandPerDay;
    const serviceRate = teamSize / targetCycleDays;
    const utilization = arrivalRate / serviceRate;
    const littleLawWip = Math.round(arrivalRate * targetCycleDays);
    const effWip = Math.round(littleLawWip / flowEfficiency);
    const suggestedWip = Math.max(1, Math.round(effWip * (1 - utilization * 0.3)));
    return {
      littleLawWip,
      effWip,
      suggestedWip,
      utilization: Math.min(utilization, 1),
      arrivalRate,
      serviceRate: serviceRate.toFixed(2),
    };
  }, [teamSize, flowEfficiency, targetCycleDays, avgDemandPerDay]);

  return (
    <ToolCard
      title="WIP Limit Calculator"
      subtitle="Calculate optimal Work-in-Progress limits using Little's Law and flow efficiency."
    >
      <ToolInfo
        what="The WIP Limit Calculator uses Little's Law (L = λ × W) to determine the optimal number of work items in progress. It factors in team size, flow efficiency, target cycle time, and demand rate to suggest WIP limits that prevent overloading the team."
        why="Use it when setting up a Kanban board, calibrating sprint WIP limits, or diagnosing flow problems. The right WIP limit reduces context switching, improves throughput, and makes bottlenecks visible."
        how="1. Enter your team size (number of people). 2. Estimate flow efficiency — the % of time work is actively being worked on (typically 20-40%). 3. Set your target cycle time in days. 4. Enter average daily demand (items arriving per day). 5. The calculator suggests WIP limits using Little's Law adjusted for efficiency."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="glass-card p-5 md:p-6 space-y-5">
          <h2 className="font-serif font-semibold text-foreground text-sm">Parameters</h2>

          <div>
            <div className="flex justify-between text-xs font-sans mb-1">
              <span className="text-muted-foreground">Team Size</span>
              <span className="text-foreground font-medium">{teamSize}</span>
            </div>
            <input
              type="range"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              min="1" max="20" step="1"
              className="w-full accent-gold-dark"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-sans mb-1">
              <span className="text-muted-foreground">Flow Efficiency</span>
              <span className="text-foreground font-medium">{(flowEfficiency * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              value={flowEfficiency}
              onChange={(e) => setFlowEfficiency(Number(e.target.value))}
              min="0.05" max="0.8" step="0.05"
              className="w-full accent-gold-dark"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-sans mb-1">
              <span className="text-muted-foreground">Target Cycle Time (days)</span>
              <span className="text-foreground font-medium">{targetCycleDays}</span>
            </div>
            <input
              type="range"
              value={targetCycleDays}
              onChange={(e) => setTargetCycleDays(Number(e.target.value))}
              min="1" max="30" step="1"
              className="w-full accent-gold-dark"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-sans mb-1">
              <span className="text-muted-foreground">Avg Daily Demand</span>
              <span className="text-foreground font-medium">{avgDemandPerDay.toFixed(1)}</span>
            </div>
            <input
              type="range"
              value={avgDemandPerDay}
              onChange={(e) => setAvgDemandPerDay(Number(e.target.value))}
              min="0.1" max="10" step="0.1"
              className="w-full accent-gold-dark"
            />
          </div>
        </div>

        {/* Results */}
        <div className="glass-card-strong p-5 md:p-6 space-y-5">
          <h2 className="font-serif font-semibold text-foreground text-sm">Suggested Limits</h2>

          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-sans mb-1">
              Recommended WIP Limit
            </p>
            <p className="text-5xl md:text-6xl font-serif font-bold gold-text">
              {results.suggestedWip}
            </p>
            <p className="text-[10px] text-muted-foreground/50 font-sans mt-1">
              items per team
            </p>
          </div>

          <div className="border-t border-border/30 pt-4 space-y-2">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-muted-foreground">Little's Law WIP</span>
              <span className="text-foreground font-mono">{results.littleLawWip}</span>
            </div>
            <div className="flex justify-between text-xs font-sans">
              <span className="text-muted-foreground">Efficiency-Adjusted WIP</span>
              <span className="text-foreground font-mono">{results.effWip}</span>
            </div>
            <div className="flex justify-between text-xs font-sans">
              <span className="text-muted-foreground">Utilization</span>
              <span className="text-foreground font-mono">{(results.utilization * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs font-sans">
              <span className="text-muted-foreground">Arrival Rate (λ)</span>
              <span className="text-foreground font-mono">{results.arrivalRate.toFixed(1)}/day</span>
            </div>
            <div className="flex justify-between text-xs font-sans">
              <span className="text-muted-foreground">Service Rate (μ)</span>
              <span className="text-foreground font-mono">{results.serviceRate}/day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formula reference */}
      <div className="glass-card p-4 text-[11px] font-sans text-muted-foreground leading-relaxed">
        <span className="text-gold-dark font-medium text-[10px] uppercase tracking-wider">Formula: </span>
        Little's Law: <span className="font-mono text-foreground">WIP = λ × CT</span> where λ = arrival rate, CT = target cycle time. Adjusted for flow efficiency: <span className="font-mono text-foreground">Actual WIP = WIP ÷ Efficiency</span>.
      </div>

      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/30 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default WIPLimitCalculator;
