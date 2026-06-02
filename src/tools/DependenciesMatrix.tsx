import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

type DepType = "blocks" | "depends-on" | "related";

interface Item {
  id: number;
  name: string;
  phase: string;
}

interface Dependency {
  id: number;
  fromId: number;
  toId: number;
  type: DepType;
}

let nextItemId = 4;
let nextDepId = 3;

const DEP_COLORS: Record<DepType, string> = {
  "blocks": "bg-red-500/10 border-red-400/30 text-red-400",
  "depends-on": "bg-amber-500/10 border-amber-400/30 text-amber-400",
  "related": "bg-sky-500/10 border-sky-400/30 text-sky-400",
};

const DependenciesMatrix = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Auth Module", phase: "Backend" },
    { id: 2, name: "Login UI", phase: "Frontend" },
    { id: 3, name: "API Gateway", phase: "Infra" },
  ]);
  const [deps, setDeps] = useState<Dependency[]>([
    { id: 1, fromId: 1, toId: 2, type: "blocks" },
    { id: 2, fromId: 3, toId: 1, type: "depends-on" },
  ]);

  const addItem = () => {
    const id = nextItemId++;
    setItems((prev) => [...prev, { id, name: "", phase: "" }]);
  };

  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeps((prev) => prev.filter((d) => d.fromId !== id && d.toId !== id));
  };

  const addDep = () => {
    if (items.length < 2) return;
    const id = nextDepId++;
    setDeps((prev) => [...prev, { id, fromId: items[0].id, toId: items[1].id, type: "depends-on" }]);
  };

  const removeDep = (id: number) => setDeps((prev) => prev.filter((d) => d.id !== id));

  const phases = useMemo(() => {
    const p = new Set(items.map((i) => i.phase).filter(Boolean));
    return Array.from(p);
  }, [items]);

  const depsByItem = useMemo(() => {
    const out: Record<number, { blocking: string[]; blockedBy: string[] }> = {};
    items.forEach((i) => { out[i.id] = { blocking: [], blockedBy: [] }; });
    deps.forEach((d) => {
      const from = items.find((i) => i.id === d.fromId);
      const to = items.find((i) => i.id === d.toId);
      if (from && to) {
        if (d.type === "blocks") { out[from.id].blocking.push(to.name); out[to.id].blockedBy.push(from.name); }
        else if (d.type === "depends-on") { out[to.id].blockedBy.push(from.name); }
        else { out[from.id].blocking.push(to.name); out[to.id].blockedBy.push(from.name); }
      }
    });
    return out;
  }, [items, deps]);

  return (
    <ToolCard
      title="Dependencies Matrix"
      subtitle="Map dependencies between work items — identify blockers, blocked-by, and related relationships."
    >
      <ToolInfo
        what="A Dependencies Matrix visualises relationships between deliverables, teams, or work items. Each dependency is classified as blocks, depends-on, or related — making it clear what must finish before something else can start."
        why="Use it during release planning, PI Planning, or any multi-team coordination. Prevents integration surprises, helps sequence work, and identifies critical path items that could delay the entire project."
        how="1. List all work items, deliverables, or teams. 2. Optionally assign phases. 3. Create dependency links: blocks (prevents completion), depends-on (needs completion), or related (loosely connected). 4. Review the matrix to find items with many incoming dependencies (potential bottlenecks)."
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(DEP_COLORS).map(([key, cls]) => (
          <div key={key} className={`px-2.5 py-1 rounded-md text-[11px] font-medium font-sans border ${cls}`}>
            {key.replace("-", " ")}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Items */}
        <div className="glass-card p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-semibold text-foreground text-sm">Items</h2>
            <button onClick={addItem} className="flex items-center gap-1 text-xs font-medium text-gold-dark hover:text-gold transition-colors font-sans">
              <Plus size={14} /> Add Item
            </button>
          </div>

          {items.map((item, i) => (
            <div key={item.id} className="flex items-center gap-2 border border-border/40 rounded-lg p-2.5">
              <span className="text-[10px] text-muted-foreground/40 font-mono shrink-0">{String(i + 1)}</span>
              <input type="text" value={item.name} onChange={(e) => setItems((prev) => prev.map((x) => x.id === item.id ? { ...x, name: e.target.value } : x))}
                className="flex-1 bg-transparent border-b border-border/60 py-0.5 text-sm text-foreground font-sans placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/50 transition-colors" placeholder="Item name" />
              <input type="text" value={item.phase} onChange={(e) => setItems((prev) => prev.map((x) => x.id === item.id ? { ...x, phase: e.target.value } : x))}
                className="w-24 bg-transparent border-b border-border/60 py-0.5 text-[11px] text-muted-foreground font-sans placeholder:text-muted-foreground/30 focus:outline-none focus:border-gold/50 transition-colors text-right" placeholder="Phase" />
              <button onClick={() => removeItem(item.id)} className="text-muted-foreground/20 hover:text-red-400 transition-colors" aria-label="Remove"><Trash2 size={11} /></button>
            </div>
          ))}
        </div>

        {/* Dependencies */}
        <div className="glass-card p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-semibold text-foreground text-sm">Links</h2>
            <button onClick={addDep} className="flex items-center gap-1 text-xs font-medium text-gold-dark hover:text-gold transition-colors font-sans">
              <Plus size={14} /> Add Link
            </button>
          </div>

          {deps.length === 0 && <p className="text-xs text-muted-foreground/40 font-sans text-center py-4">No dependencies yet</p>}

          {deps.length > 0 && deps.map((d, i) => {
            const from = items.find((x) => x.id === d.fromId);
            const to = items.find((x) => x.id === d.toId);
            return (
              <div key={d.id} className="flex items-center gap-1.5 border border-border/40 rounded-lg p-2 text-xs font-sans">
                <span className="text-[10px] text-muted-foreground/30 font-mono shrink-0">{i + 1}</span>
                <span className="flex-1 truncate text-foreground font-medium">{from?.name || "?"}</span>
                <ArrowRight size={11} className="text-muted-foreground/40 shrink-0" />
                <span className="flex-1 truncate text-foreground">{to?.name || "?"}</span>
                <select value={d.type} onChange={(e) => setDeps((prev) => prev.map((x) => x.id === d.id ? { ...x, type: e.target.value as DepType } : x))}
                  className="bg-transparent text-[10px] text-muted-foreground font-sans focus:outline-none">
                  <option value="blocks">blocks</option>
                  <option value="depends-on">depends-on</option>
                  <option value="related">related</option>
                </select>
                <button onClick={() => removeDep(d.id)} className="text-muted-foreground/20 hover:text-red-400 transition-colors" aria-label="Remove"><Trash2 size={10} /></button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dependency view per item */}
      {items.filter((i) => i.name.trim()).length > 0 && (
        <div className="glass-card-strong p-4 md:p-5">
          <h2 className="font-serif font-semibold text-foreground text-sm mb-3">Dependency View</h2>
          <div className="space-y-2">
            {items.filter((i) => i.name.trim()).map((item) => {
              const d = depsByItem[item.id];
              if (!d) return null;
              return (
                <div key={item.id} className="border border-border/30 rounded-lg p-3">
                  <p className="text-xs font-semibold text-foreground font-sans mb-1.5">{item.name}</p>
                  <div className="flex gap-4 text-[11px] font-sans">
                    {d.blocking.length > 0 && <div><span className="text-red-400 font-medium">Blocks:</span> <span className="text-muted-foreground">{d.blocking.join(", ")}</span></div>}
                    {d.blockedBy.length > 0 && <div><span className="text-amber-400 font-medium">Blocked by:</span> <span className="text-muted-foreground">{d.blockedBy.join(", ")}</span></div>}
                    {d.blocking.length === 0 && d.blockedBy.length === 0 && <span className="text-muted-foreground/40">No dependencies</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/30 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default DependenciesMatrix;
