import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Send } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface CommItem {
  id: number;
  audience: string;
  message: string;
  channel: string;
  frequency: string;
  owner: string;
  notes: string;
}

let nextId = 6;

const CHANNELS = ["Email", "Slack", "Teams", "Meeting", "Dashboard", "Newsletter", "Wiki", "Other"];
const FREQUENCIES = ["Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly", "Ad-hoc", "Per release"];

const CommunicationPlan = () => {
  const [items, setItems] = useState<CommItem[]>([
    { id: 1, audience: "Development Team", message: "Sprint goals, daily progress, blockers", channel: "Daily Standup", frequency: "Daily", owner: "Scrum Master", notes: "15 min timebox, 9:00 AM" },
    { id: 2, audience: "Stakeholders", message: "Sprint progress, demos, metrics", channel: "Sprint Review", frequency: "Bi-weekly", owner: "Product Owner", notes: "End of sprint, 30 min" },
    { id: 3, audience: "Executives", message: "Quarterly OKR progress, roadmap updates", channel: "Quarterly Review", frequency: "Quarterly", owner: "EM / PM", notes: "Slide deck, 45 min" },
    { id: 4, audience: "End Users", message: "Feature releases, downtime, known issues", channel: "Email / Status Page", frequency: "Per release", owner: "Tech Writer", notes: "Use plain language, no jargon" },
    { id: 5, audience: "Product Team", message: "Customer feedback, usage data, priorities", channel: "Product Sync", frequency: "Weekly", owner: "Product Owner", notes: "Wed 2 PM, 30 min" },
  ]);

  const addItem = () => {
    const id = nextId++;
    setItems((prev) => [...prev, { id, audience: "", message: "", channel: "Email", frequency: "Weekly", owner: "", notes: "" }]);
  };
  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };
  const update = (id: number, field: keyof CommItem, value: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <ToolCard
      title="Communication Plan"
      subtitle="Plan stakeholder communications: audience, message, channel, frequency, and owner."
    >
      <ToolInfo
        what="A Communication Plan defines who needs what information, when, how, and from whom. It ensures stakeholders get the right level of detail at the right cadence — preventing under-communication (surprises) and over-communication (noise)."
        why="Use it at project initiation or when joining a new team. Essential for distributed teams, multi-stakeholder projects, and any situation where miscommunication could cause delays or friction."
        how="1. Identify each stakeholder group. 2. Define what information they need and why. 3. Choose the best channel (email, meeting, dashboard, etc.). 4. Set the frequency. 5. Assign an owner. 6. Review periodically — needs change as the project evolves."
      />

      <div className="glass-card p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-semibold text-foreground text-base">Communications</h2>
          <button onClick={addItem} className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans">
            <Plus size={14} /> Add
          </button>
        </div>

        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="border border-border/40 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm text-foreground/70 font-mono shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <Send size={12} className="text-gold-dark" />
                </div>
                <input type="text" value={item.audience} onChange={(e) => update(item.id, "audience", e.target.value)}
                  className="flex-1 bg-transparent border-b border-border/60 py-0.5 text-sm font-semibold text-foreground font-sans placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors" placeholder="Audience / Stakeholder" />
              </div>
              <button onClick={() => removeItem(item.id)} className="text-foreground/40 hover:text-red-400 transition-colors shrink-0" aria-label="Remove"><Trash2 size={12} /></button>
            </div>

            <input type="text" value={item.message} onChange={(e) => update(item.id, "message", e.target.value)}
              className="w-full bg-transparent text-sm text-foreground/75 font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors" placeholder="What information do they need?" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm font-sans">
              <div>
                <span className="text-sm text-foreground/70 font-sans block mb-0.5">Channel</span>
                <select value={item.channel} onChange={(e) => update(item.id, "channel", e.target.value)}
                  className="w-full bg-transparent border border-border/40 rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:border-gold/50 transition-colors">
                  {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <span className="text-sm text-foreground/70 font-sans block mb-0.5">Frequency</span>
                <select value={item.frequency} onChange={(e) => update(item.id, "frequency", e.target.value)}
                  className="w-full bg-transparent border border-border/40 rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:border-gold/50 transition-colors">
                  {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <span className="text-sm text-foreground/70 font-sans block mb-0.5">Owner</span>
                <input type="text" value={item.owner} onChange={(e) => update(item.id, "owner", e.target.value)}
                  className="w-full bg-transparent border border-border/40 rounded-lg px-2 py-1.5 text-foreground placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors" placeholder="Owner" />
              </div>
              <div>
                <span className="text-sm text-foreground/70 font-sans block mb-0.5">Notes</span>
                <input type="text" value={item.notes} onChange={(e) => update(item.id, "notes", e.target.value)}
                  className="w-full bg-transparent border border-border/40 rounded-lg px-2 py-1.5 text-foreground placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors" placeholder="Notes" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default CommunicationPlan;
