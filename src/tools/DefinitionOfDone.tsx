import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface CheckItem {
  id: number;
  text: string;
  checked: boolean;
}

interface Checklist {
  id: number;
  name: string;
  items: CheckItem[];
}

let nextChecklistId = 2;
let nextItemId = 20;

const DEFAULT_ITEMS: CheckItem[] = [
  { id: 1, text: "Code reviewed by at least one peer", checked: false },
  { id: 2, text: "All automated tests pass", checked: false },
  { id: 3, text: "New code has unit/integration tests", checked: false },
  { id: 4, text: "No new linting warnings", checked: false },
  { id: 5, text: "Feature flagged or safely deployed", checked: false },
  { id: 6, text: "Acceptance criteria met", checked: false },
  { id: 7, text: "Documentation updated (if applicable)", checked: false },
  { id: 8, text: "Accessibility checked", checked: false },
  { id: 9, text: "Performance impact assessed", checked: false },
  { id: 10, text: "Product Owner reviewed", checked: false },
];

const DefinitionOfDone = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([
    { id: 1, name: "Default DoD", items: DEFAULT_ITEMS },
  ]);
  const [activeId, setActiveId] = useState(1);

  const active = checklists.find((c) => c.id === activeId) || checklists[0];

  const addChecklist = () => {
    const id = nextChecklistId++;
    setChecklists((prev) => [...prev, { id, name: `Checklist ${id}`, items: [] }]);
    setActiveId(id);
  };

  const removeChecklist = (id: number) => {
    if (checklists.length <= 1) return;
    setChecklists((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(checklists[0].id === id ? checklists[1]?.id : checklists[0].id);
  };

  const addItem = () => {
    const id = nextItemId++;
    setChecklists((prev) => prev.map((c) => c.id === activeId ? { ...c, items: [...c.items, { id, text: "", checked: false }] } : c));
  };

  const toggleItem = (itemId: number) => {
    setChecklists((prev) => prev.map((c) => c.id === activeId ? { ...c, items: c.items.map((i) => i.id === itemId ? { ...i, checked: !i.checked } : i) } : c));
  };

  const updateItem = (itemId: number, text: string) => {
    setChecklists((prev) => prev.map((c) => c.id === activeId ? { ...c, items: c.items.map((i) => i.id === itemId ? { ...i, text } : i) } : c));
  };

  const removeItem = (itemId: number) => {
    setChecklists((prev) => prev.map((c) => c.id === activeId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c));
  };

  const checkedCount = active.items.filter((i) => i.checked).length;
  const progress = active.items.length > 0 ? Math.round((checkedCount / active.items.length) * 100) : 0;

  return (
    <ToolCard
      title="Definition of Done Checklist"
      subtitle="Create and manage shared Definition of Done checklists for stories, bugs, and releases."
    >
      <ToolInfo
        what="The Definition of Done (DoD) is a shared understanding of what it means for work to be considered complete. It's a checklist of criteria every work item must meet before it can be shipped — ensuring quality and consistency across the team."
        why="Use it in Sprint Planning and during code review. A clear DoD prevents half-finished work from being counted as done, reduces escaped defects, and ensures everyone holds the same quality standard. Review and evolve it in retrospectives."
        how="1. Create checklists for different item types (stories, bugs, hotfixes, releases). 2. Add criteria specific to your team's quality standards. 3. During development, check items off as they're completed. 4. An item is only 'Done' when all checklist items are satisfied. 5. Review and update the list in retrospectives."
      />

      {/* Checklist tabs */}
      <div className="glass-card p-4 md:p-5">
        <div className="flex items-center gap-2 flex-wrap">
          {checklists.map((cl) => (
            <button
              key={cl.id}
              onClick={() => setActiveId(cl.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium font-sans border transition-colors ${
                activeId === cl.id
                  ? "bg-gold/15 border-gold/30 text-gold-dark"
                  : "border-border/40 text-foreground/75 hover:border-muted-foreground/40"
              }`}
            >
              {cl.name}
            </button>
          ))}
          <button onClick={addChecklist} className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans px-2">
            <Plus size={14} /> New
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="glass-card-strong p-4 md:p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-semibold text-foreground text-base">{active.name}</h2>
            <span className="text-sm text-foreground/80 font-sans">{checkedCount}/{active.items.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={addItem} className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans">
              <Plus size={14} /> Add Item
            </button>
            <button onClick={() => removeChecklist(activeId)} className="text-foreground/40 hover:text-red-400 transition-colors" aria-label="Remove checklist">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
        <div className="w-full bg-border/40 rounded-full h-2">
          <div className="bg-gold rounded-full h-2 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Checklist items */}
      <div className="glass-card p-4 md:p-5 space-y-1">
        {active.items.length === 0 && (
          <p className="text-sm text-foreground/60 font-sans text-center py-8">No items yet. Add criteria to your checklist.</p>
        )}
        {active.items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
              item.checked ? "bg-emerald-500/5" : "hover:bg-muted/10"
            }`}
          >
            <button onClick={() => toggleItem(item.id)} className="shrink-0 transition-colors">
              {item.checked ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : (
                <Circle size={18} className="text-foreground/60 hover:text-foreground/80" />
              )}
            </button>
            <span className="text-sm text-foreground/50 font-mono shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItem(item.id, e.target.value)}
              className={`flex-1 bg-transparent border-b border-transparent py-0.5 text-sm font-sans focus:outline-none focus:border-gold/50 transition-colors ${
                item.checked ? "text-foreground/80 line-through" : "text-foreground"
              }`}
              placeholder="Add criterion..."
            />
            <button onClick={() => removeItem(item.id)} className="text-foreground/40 hover:text-red-400 transition-colors" aria-label="Remove">
              <Trash2 size={11} />
            </button>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default DefinitionOfDone;
