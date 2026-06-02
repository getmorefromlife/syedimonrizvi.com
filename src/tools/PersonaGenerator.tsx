import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, User } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Persona {
  id: number;
  name: string;
  role: string;
  age: string;
  background: string;
  goals: string;
  painPoints: string;
  quote: string;
}

let nextId = 4;

const PersonaGenerator = () => {
  const [personas, setPersonas] = useState<Persona[]>([
    { id: 1, name: "Alex", role: "Engineering Manager", age: "35", background: "Leads a team of 8 engineers. Previously a senior developer. Uses agile tools daily.", goals: "Improve team velocity, reduce blockers, get accurate forecasts for stakeholders.", painPoints: "Too many disparate tools, manual reporting, no way to forecast with confidence.", quote: "I need a single source of truth for my team's progress." },
    { id: 2, name: "Priya", role: "Product Owner", age: "28", background: "Owns the product backlog. Coordinates with stakeholders and developers.", goals: "Prioritise features that deliver real value, communicate roadmap clearly.", painPoints: "Stakeholders keep adding scope, hard to estimate delivery dates.", quote: "Help me say no to the right things." },
    { id: 3, name: "Jordan", role: "Scrum Master", age: "42", background: "Facilitates agile ceremonies. Coaches the team on agile practices.", goals: "Keep the team healthy and continuously improving.", painPoints: "Difficult to track improvement over time, retrospective actions get forgotten.", quote: "I want data to back up my coaching." },
  ]);

  const addPersona = () => {
    const id = nextId++;
    setPersonas((prev) => [...prev, { id, name: "", role: "", age: "", background: "", goals: "", painPoints: "", quote: "" }]);
  };

  const removePersona = (id: number) => {
    if (personas.length <= 1) return;
    setPersonas((prev) => prev.filter((p) => p.id !== id));
  };

  const update = (id: number, field: keyof Persona, value: string) => {
    setPersonas((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <ToolCard
      title="Persona Generator"
      subtitle="Create detailed user personas to build empathy and guide product decisions."
    >
      <ToolInfo
        what="A user persona is a fictional character representing a user segment, based on research and real data. Personas include demographics, goals, pain points, and behaviours — helping the team design for real people, not abstractions."
        why="Use them at the start of a project, during discovery, or before a major feature. Personas align the team around who you're building for, prevent 'designing for yourself', and make prioritisation decisions clearer."
        how="1. Identify a user segment with distinct needs. 2. Give them a name and role — make them feel real. 3. Describe their background and context. 4. Define their primary goals when using your product. 5. Capture their pain points — what frustrates them? 6. Add a quote that captures their mindset."
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {personas.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            className="glass-card-strong p-4 md:p-5 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center">
                  <User size={14} className="text-gold-dark" />
                </div>
                <div>
                  <input type="text" value={p.name} onChange={(e) => update(p.id, "name", e.target.value)}
                    className="bg-transparent text-sm font-semibold text-foreground font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors w-24" placeholder="Name" />
                  <div className="flex gap-1 text-sm text-foreground/70 font-sans">
                    <input type="text" value={p.role} onChange={(e) => update(p.id, "role", e.target.value)}
                      className="bg-transparent border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors max-w-[80px]" placeholder="Role" />
                    <span>,</span>
                    <input type="text" value={p.age} onChange={(e) => update(p.id, "age", e.target.value)}
                      className="bg-transparent border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors w-8" placeholder="Age" />
                  </div>
                </div>
              </div>
              <button onClick={() => removePersona(p.id)} className="text-foreground/40 hover:text-red-400 transition-colors" aria-label="Remove"><Trash2 size={12} /></button>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-foreground/70 font-sans">Background</span>
                <textarea value={p.background} onChange={(e) => update(p.id, "background", e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground/75 font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors resize-none h-12" placeholder="Describe their context..." />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-emerald-500/80 font-sans">Goals</span>
                <textarea value={p.goals} onChange={(e) => update(p.id, "goals", e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors resize-none h-12" placeholder="What do they want to achieve?" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-red-400/80 font-sans">Pain Points</span>
                <textarea value={p.painPoints} onChange={(e) => update(p.id, "painPoints", e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors resize-none h-12" placeholder="What frustrates them?" />
              </div>
              <div className="bg-gold/5 border border-gold/20 rounded-lg p-2">
                <span className="text-[9px] uppercase tracking-wider text-gold-dark font-sans">Quote</span>
                <input type="text" value={p.quote} onChange={(e) => update(p.id, "quote", e.target.value)}
                  className="w-full bg-transparent text-sm italic text-foreground font-sans mt-0.5 border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors" placeholder='"What would they say?"' />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add card */}
        <button onClick={addPersona}
          className="glass-card-strong p-4 md:p-5 border-2 border-dashed border-border/40 flex items-center justify-center min-h-[200px] hover:border-gold/30 hover:bg-gold/5 transition-all group">
          <div className="text-center">
            <Plus size={24} className="mx-auto text-foreground/60 group-hover:text-gold-dark transition-colors" />
            <p className="text-sm text-foreground/70 font-sans mt-2 group-hover:text-gold-dark transition-colors">Add Persona</p>
          </div>
        </button>
      </div>

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default PersonaGenerator;
