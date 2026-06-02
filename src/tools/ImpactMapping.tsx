import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Target } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Actor {
  id: number; name: string; impacts: Impact[];
}
interface Impact {
  id: number; name: string; deliverables: Deliverable[];
}
interface Deliverable {
  id: number; name: string;
}

let nextActorId = 2;
let nextImpactId = 3;
let nextDelId = 5;

const ImpactMapping = () => {
  const [goal, setGoal] = useState("Increase user engagement by 30% in Q3");
  const [actors, setActors] = useState<Actor[]>([
    {
      id: 1, name: "End Users",
      impacts: [
        { id: 1, name: "Find content more easily", deliverables: [{ id: 1, name: "Improved search" }, { id: 2, name: "Category filters" }] },
        { id: 2, name: "Stay engaged longer", deliverables: [{ id: 3, name: "Personalised recommendations" }, { id: 4, name: "Reading progress tracking" }] },
      ],
    },
  ]);

  const addActor = () => {
    const id = nextActorId++;
    setActors((prev) => [...prev, { id, name: "", impacts: [] }]);
  };
  const removeActor = (id: number) => {
    if (actors.length <= 1) return;
    setActors((prev) => prev.filter((a) => a.id !== id));
  };
  const addImpact = (actorId: number) => {
    const id = nextImpactId++;
    setActors((prev) => prev.map((a) => a.id === actorId ? { ...a, impacts: [...a.impacts, { id, name: "", deliverables: [] }] } : a));
  };
  const addDeliverable = (actorId: number, impactId: number) => {
    const id = nextDelId++;
    setActors((prev) => prev.map((a) => a.id === actorId ? { ...a, impacts: a.impacts.map((im) => im.id === impactId ? { ...im, deliverables: [...im.deliverables, { id, name: "" }] } : im) } : a));
  };

  const update = (type: "goal" | "actor" | "impact" | "deliverable", value: string, ...ids: number[]) => {
    if (type === "goal") { setGoal(value); return; }
    setActors((prev) => prev.map((a) => {
      if (type === "actor" && a.id === ids[0]) return { ...a, name: value };
      return {
        ...a, impacts: a.impacts.map((im) => {
          if (type === "impact" && a.id === ids[0] && im.id === ids[1]) return { ...im, name: value };
          return { ...im, deliverables: im.deliverables.map((d) => type === "deliverable" && a.id === ids[0] && im.id === ids[1] && d.id === ids[2] ? { ...d, name: value } : d) };
        }),
      };
    }));
  };

  return (
    <ToolCard
      title="Impact Mapping"
      subtitle="Align strategy with delivery: map goals to actors, impacts, and concrete deliverables."
    >
      <ToolInfo
        what="Impact Mapping (Gojko Adzic, 2012) is a strategic planning technique that starts with a business goal, identifies actors who can influence it, defines the impacts needed to change their behaviour, and specifies deliverables that enable those impacts."
        why="Use it before starting a new initiative, release, or quarter. It prevents building features that don't connect to business outcomes, reveals assumptions, and aligns the team around WHY before discussing WHAT."
        how="1. Start with a clear business goal (top). 2. Identify actors who can help or hinder the goal. 3. Define the behavioural impacts needed from each actor. 4. Brainstorm deliverables that enable those impacts. 5. Prioritise: focus on deliverables that drive the most important impacts."
      />

      {/* Goal */}
      <div className="glass-card-strong p-4 md:p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Target size={16} className="text-gold-dark" />
          <span className="text-sm uppercase tracking-wider text-foreground/70 font-sans">Business Goal</span>
        </div>
        <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)}
          className="w-full max-w-xl text-center bg-transparent text-lg font-serif font-bold text-foreground border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors" />
      </div>

      {/* Impact map */}
      <div className="glass-card p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-semibold text-foreground text-base">Actors → Impacts → Deliverables</h2>
          <button onClick={addActor} className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans">
            <Plus size={14} /> Add Actor
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {actors.map((actor) => (
            <motion.div key={actor.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="border border-border/40 rounded-xl p-4 space-y-3">
              {/* Actor */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold shrink-0" />
                <input type="text" value={actor.name} onChange={(e) => update("actor", e.target.value, actor.id)}
                  className="flex-1 bg-transparent border-b border-border/60 py-0.5 text-sm font-semibold text-foreground font-sans placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors" placeholder="Actor name" />
                <button onClick={() => removeActor(actor.id)} className="text-foreground/40 hover:text-red-400 transition-colors" aria-label="Remove actor"><Trash2 size={12} /></button>
              </div>

              {/* Impacts */}
              <div className="ml-4 space-y-2 border-l-2 border-border/30 pl-3">
                {actor.impacts.map((im) => (
                  <div key={im.id} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <input type="text" value={im.name} onChange={(e) => update("impact", e.target.value, actor.id, im.id)}
                        className="flex-1 bg-transparent border-b border-border/60 py-0.5 text-sm text-foreground/75 font-sans placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors" placeholder="Impact" />
                      <button onClick={() => addDeliverable(actor.id, im.id)} className="text-foreground/50 hover:text-gold-dark transition-colors" aria-label="Add deliverable"><Plus size={11} /></button>
                    </div>
                    {/* Deliverables */}
                    <div className="ml-4 space-y-1">
                      {im.deliverables.map((d) => (
                        <div key={d.id} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-border shrink-0" />
                          <input type="text" value={d.name} onChange={(e) => update("deliverable", e.target.value, actor.id, im.id, d.id)}
                            className="flex-1 bg-transparent border-b border-transparent py-0.5 text-sm text-foreground font-sans placeholder:text-foreground/60 focus:border-gold/50 focus:outline-none transition-colors" placeholder="Deliverable" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={() => addImpact(actor.id)} className="flex items-center gap-1 text-sm text-foreground/70 hover:text-gold-dark transition-colors font-sans">
                  <Plus size={10} /> Add Impact
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default ImpactMapping;
