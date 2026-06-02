import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowUpDown } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Item {
  id: number;
  name: string;
  ubv: string;
  tc: string;
  rroe: string;
  size: string;
}

let nextId = 1;

const WSJFCalculator = () => {
  const [items, setItems] = useState<Item[]>([
    { id: nextId++, name: "", ubv: "5", tc: "5", rroe: "5", size: "13" },
  ]);

  const addItem = () => setItems((prev) => [...prev, { id: nextId++, name: "", ubv: "5", tc: "5", rroe: "5", size: "13" }]);
  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };
  const update = (id: number, field: keyof Item, value: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const scored = useMemo(() => {
    return items
      .map((i) => {
        const ubv = Number(i.ubv) || 0;
        const tc = Number(i.tc) || 0;
        const rroe = Number(i.rroe) || 0;
        const size = Number(i.size) || 1;
        const cod = ubv + tc + rroe;
        const wsjf = cod / size;
        return { ...i, ubv, tc, rroe, cod, size, wsjf };
      })
      .sort((a, b) => b.wsjf - a.wsjf);
  }, [items]);

  return (
    <ToolCard
      title="WSJF Calculator"
      subtitle="Weighted Shortest Job First — prioritise backlog items by economic value per unit of effort."
    >
      <ToolInfo
        what="WSJF (Weighted Shortest Job First) is a prioritisation model from SAFe (Scaled Agile Framework). It calculates the Cost of Delay divided by Job Size to rank work items by economic return per unit of time."
        why="Use it during PI Planning, quarterly prioritisation, or any time you need to decide which features to build next based on value delivery speed."
        how="1. List backlog items. 2. Score each on User-Business Value (1-10), Time Criticality (1-10), and Risk Reduction / Opportunity Enablement (1-10). 3. Estimate Job Size (story points or ideal days). 4. The tool calculates Cost of Delay (UBV + TC + RR/OE) and WSJF (CoD ÷ Size). 5. Higher WSJF = higher priority."
      />

      {/* Score guide */}
      <div className="glass-card p-4 md:p-5">
        <h2 className="font-serif font-semibold text-foreground text-base mb-3">Score Guide</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-base font-sans text-foreground/75 leading-relaxed">
          <div>
            <span className="text-gold-dark font-medium block mb-0.5">User-Business Value</span>
            1 = minimal value, 10 = critical revenue / user impact
          </div>
          <div>
            <span className="text-gold-dark font-medium block mb-0.5">Time Criticality</span>
            1 = no deadline pressure, 10 = hard deadline, huge penalty if late
          </div>
          <div>
            <span className="text-gold-dark font-medium block mb-0.5">Risk Red. / Opp. Enable</span>
            1 = no risk reduction, 10 = removes major risk or unlocks significant opportunity
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="glass-card p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-semibold text-foreground text-base">Backlog Items</h2>
          <button
            onClick={addItem}
            className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>

        {/* Header */}
        <div className="hidden md:grid md:grid-cols-[1fr_70px_70px_70px_70px_70px_60px_30px] gap-3 text-sm uppercase tracking-wider text-foreground/70 font-sans pb-1 border-b border-border/30">
          <span>Name</span>
          <span className="text-center">UBV</span>
          <span className="text-center">TC</span>
          <span className="text-center">RR/OE</span>
          <span className="text-center">CoD</span>
          <span className="text-center">Size</span>
          <span className="text-center">WSJF</span>
          <span />
        </div>

        {scored.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-[1fr_70px_70px_70px_70px_70px_60px_30px] gap-2 md:gap-3 items-center border border-border/40 rounded-xl p-3 md:p-3"
          >
            <input
              type="text"
              value={item.name}
              onChange={(e) => update(item.id, "name", e.target.value)}
              className="bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-sans placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="Item name"
            />
            <input
              type="number"
              value={item.ubv}
              onChange={(e) => update(item.id, "ubv", e.target.value)}
              className="w-full text-center bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
              min="1" max="10"
            />
            <input
              type="number"
              value={item.tc}
              onChange={(e) => update(item.id, "tc", e.target.value)}
              className="w-full text-center bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
              min="1" max="10"
            />
            <input
              type="number"
              value={item.rroe}
              onChange={(e) => update(item.id, "rroe", e.target.value)}
              className="w-full text-center bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
              min="1" max="10"
            />
            <div className="text-center text-sm font-mono text-foreground/75">
              {item.cod}
            </div>
            <input
              type="number"
              value={item.size}
              onChange={(e) => update(item.id, "size", e.target.value)}
              className="w-full text-center bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
              min="1"
            />
            <div className={`text-center text-sm font-mono font-bold ${item.wsjf > 0 ? "gold-text" : "text-foreground/75"}`}>
              {item.wsjf > 0 ? item.wsjf.toFixed(1) : "—"}
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-foreground/50 hover:text-red-400 transition-colors justify-self-center"
              aria-label="Remove item"
            >
              <Trash2 size={13} />
            </button>
          </motion.div>
        ))}

        {/* Mobile score labels */}
        <div className="grid grid-cols-2 gap-2 text-sm text-foreground/60 font-sans md:hidden">
          <span>UBV = User-Business Value</span>
          <span>TC = Time Criticality</span>
          <span>RR/OE = Risk Red. / Opp. Enable</span>
          <span>CoD = Cost of Delay</span>
        </div>
      </div>

      {/* Ranking */}
      {scored.length > 0 && scored.some((i) => i.name.trim()) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-strong p-5 md:p-6"
        >
          <h2 className="font-serif font-semibold text-foreground text-base mb-4">Priority Rank</h2>
          <div className="space-y-2">
            {scored
              .filter((i) => i.name.trim())
              .map((item, i) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-background/50"
                >
                  <span className={`text-sm font-mono font-bold ${i === 0 ? "gold-text" : "text-foreground/80"}`}>
                    #{i + 1}
                  </span>
                  <ArrowUpDown size={12} className="text-foreground/50 shrink-0" />
                  <span className="flex-1 text-sm text-foreground font-sans truncate">{item.name}</span>
                  <span className="text-sm font-mono gold-text font-bold">{item.wsjf.toFixed(1)}</span>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default WSJFCalculator;
