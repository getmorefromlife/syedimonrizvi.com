import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

type Role = "R" | "A" | "C" | "I" | "";

const ROLE_STYLES: Record<string, string> = {
  R: "bg-emerald-500/20 text-emerald-600 border-emerald-500/40",
  A: "bg-gold/20 text-gold-dark border-gold/40",
  C: "bg-sky-500/20 text-sky-600 border-sky-500/40",
  I: "bg-violet-500/20 text-violet-600 border-violet-500/40",
};

const ROLE_DESC: Record<string, string> = {
  R: "Responsible — does the work",
  A: "Accountable — signs off (only one per task)",
  C: "Consulted — provides input",
  I: "Informed — kept up to date",
};

const ROLE_NEXT: Record<string, Role> = { "": "R", R: "A", A: "C", C: "I", I: "" };

interface Person { id: number; name: string }
interface Task { id: number; name: string; assignments: Record<number, Role> }

let nextPersonId = 3;
let nextTaskId = 3;

const RACIChart = () => {
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: "PM" }, { id: 2, name: "Dev Lead" },
  ]);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "Requirements", assignments: { 1: "A", 2: "R" } },
    { id: 2, name: "Development", assignments: { 1: "I", 2: "A" } },
  ]);

  const addPerson = () => {
    const id = nextPersonId++;
    setPeople((prev) => [...prev, { id, name: `Person ${people.length + 1}` }]);
    setTasks((prev) => prev.map((t) => ({ ...t, assignments: { ...t.assignments, [id]: "" } })));
  };

  const removePerson = (id: number) => {
    if (people.length <= 1) return;
    setPeople((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.map((t) => {
      const { [id]: _, ...rest } = t.assignments;
      return { ...t, assignments: rest };
    }));
  };

  const addTask = () => {
    const id = nextTaskId++;
    const assignments: Record<number, Role> = {};
    people.forEach((p) => (assignments[p.id] = ""));
    setTasks((prev) => [...prev, { id, name: `Task ${tasks.length + 1}`, assignments }]);
  };

  const removeTask = (id: number) => {
    if (tasks.length <= 1) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const cycleRole = (taskId: number, personId: number) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== taskId) return t;
      const current = t.assignments[personId] || "";
      const next = ROLE_NEXT[current] || "R";
      let newAssignments = { ...t.assignments, [personId]: next };
      if (next === "A") {
        Object.keys(newAssignments).forEach((k) => {
          if (Number(k) !== personId && newAssignments[Number(k)] === "A")
            newAssignments[Number(k)] = "";
        });
      }
      return { ...t, assignments: newAssignments };
    }));
  };

  const issues = useMemo(() => {
    const result: string[] = [];
    tasks.forEach((t) => {
      const vals = Object.values(t.assignments);
      if (!vals.includes("A")) result.push(`"${t.name || "Untitled"}" has no Accountable (A)`);
      if (vals.filter((r) => r === "A").length > 1)
        result.push(`"${t.name || "Untitled"}" has multiple Accountable (A)`);
    });
    return result;
  }, [tasks]);

  return (
    <ToolCard
      title="RACI Chart Generator"
      subtitle="Define roles and responsibilities for tasks with Responsible, Accountable, Consulted, Informed."
    >
      <ToolInfo
        what="RACI (Responsible, Accountable, Consulted, Informed) is a responsibility assignment matrix. R = does the work, A = ultimately answerable (only one per task), C = provides input before decision, I = receives updates after."
        why="Use it during project kickoffs, onboarding, or whenever roles are unclear. Eliminates confusion about who does what, prevents work from falling through cracks, and ensures every task has a single accountable owner."
        how="1. List the people/roles involved. 2. List tasks or deliverables. 3. Click each cell to cycle through R/A/C/I. 4. Ensure each task has exactly one A (Accountable). 5. Review for gaps — if a person has too many Rs, they may be overburdened."
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(ROLE_DESC).map(([key, desc]) => (
          <div key={key} className={`px-2.5 py-1 rounded-md text-sm font-medium font-sans border ${ROLE_STYLES[key]}`}>
            {key} — {desc}
          </div>
        ))}
      </div>

      {/* People row */}
      <div className="glass-card p-4 md:p-5 space-y-3 overflow-x-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-semibold text-foreground text-base">People / Roles</h2>
          <button onClick={addPerson} className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans">
            <Plus size={14} /> Add Person
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {people.map((p, i) => (
            <div key={p.id} className="flex items-center gap-1.5 border border-border/40 rounded-lg px-3 py-1.5">
              <span className="text-sm text-foreground/60 font-mono">{String(i + 1)}</span>
              <input type="text" value={p.name} onChange={(e) => setPeople((prev) => prev.map((x) => x.id === p.id ? { ...x, name: e.target.value } : x))}
                className="w-20 bg-transparent text-sm text-foreground font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors" />
              <button onClick={() => removePerson(p.id)} className="text-foreground/40 hover:text-red-400 transition-colors" aria-label="Remove person">
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RACI Matrix */}
      <div className="glass-card p-4 md:p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif font-semibold text-foreground text-base">Matrix</h2>
          <button onClick={addTask} className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans">
            <Plus size={14} /> Add Task
          </button>
        </div>

        {issues.length > 0 && (
          <div className="mb-3 p-2 bg-red-500/5 border border-red-400/30 rounded-lg text-sm text-red-400 font-sans space-y-0.5">
            {issues.map((msg, i) => <p key={i}>{msg}</p>)}
          </div>
        )}

        <table className="w-full text-sm font-sans border-collapse">
          <thead>
            <tr>
              <th className="text-left text-sm text-foreground/70 font-medium py-1.5 pr-3 sticky left-0 bg-background">Task</th>
              {people.map((p) => (
                <th key={p.id} className="text-center text-sm text-foreground/70 font-medium py-1.5 px-2 min-w-[48px]">{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-t border-border/20">
                <td className="py-1.5 pr-3 sticky left-0 bg-background">
                  <input type="text" value={t.name} onChange={(e) => setTasks((prev) => prev.map((x) => x.id === t.id ? { ...x, name: e.target.value } : x))}
                    className="w-full bg-transparent text-sm text-foreground font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors" />
                  <button onClick={() => removeTask(t.id)} className="text-foreground/40 hover:text-red-400 transition-colors ml-1" aria-label="Remove task">
                    <Trash2 size={9} />
                  </button>
                </td>
                {people.map((p) => {
                  const role = t.assignments[p.id] || "";
                  return (
                    <td key={p.id} className="text-center py-1 px-1">
                      <button onClick={() => cycleRole(t.id, p.id)}
                        className={`w-7 h-7 rounded-md text-sm font-bold font-mono border transition-all ${
                          role ? ROLE_STYLES[role] : "border-border/30 text-foreground/50 hover:border-muted-foreground/40"
                        }`}>
                        {role || "—"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="glass-card-strong p-4 md:p-5">
        <h2 className="font-serif font-semibold text-foreground text-base mb-3">Assignment Summary</h2>
        <div className="grid grid-cols-4 gap-3">
          {(["R", "A", "C", "I"] as const).map((role) => {
            const count = tasks.reduce((sum, t) =>
              sum + Object.values(t.assignments).filter((r) => r === role).length, 0);
            return (
              <div key={role} className="text-center p-2 rounded-lg bg-background/50">
                <p className={`text-lg font-serif font-bold ${role === "R" ? "text-emerald-500" : role === "A" ? "gold-text" : role === "C" ? "text-sky-500" : "text-violet-500"}`}>{count}</p>
                <p className="text-sm text-foreground/70 font-sans">{role} assignments</p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default RACIChart;
