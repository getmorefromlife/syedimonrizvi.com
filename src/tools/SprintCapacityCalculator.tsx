import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Users } from "lucide-react";
import ToolCard from "./ToolCard";

interface Member {
  id: number;
  name: string;
  availableDays: string;
  pto: string;
  meetingLoad: string;
  focusFactor: string;
  dailyVelocity: string;
}

let nextMemberId = 1;

function calcCapacity(m: Member) {
  const days = Number(m.availableDays) || 0;
  const pto = Number(m.pto) || 0;
  const meetings = Number(m.meetingLoad) || 0;
  const focus = Number(m.focusFactor) || 0.7;
  const vel = Number(m.dailyVelocity) || 1.5;
  const effDays = Math.max(0, days - pto) * (1 - meetings) * focus;
  const points = effDays * vel;
  const hours = effDays * 6;
  return { effDays: Math.round(effDays * 10) / 10, points: Math.round(points * 10) / 10, hours: Math.round(hours) };
}

const defaultMember = () => ({
  id: nextMemberId++,
  name: "",
  availableDays: "10",
  pto: "0",
  meetingLoad: "0.2",
  focusFactor: "0.7",
  dailyVelocity: "1.5",
});

const SprintCapacityCalculator = () => {
  const [members, setMembers] = useState<Member[]>([defaultMember()]);

  const addMember = () => setMembers((prev) => [...prev, defaultMember()]);
  const removeMember = (id: number) => {
    if (members.length <= 1) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };
  const updateMember = (id: number, field: keyof Member, value: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const capacities = useMemo(
    () => members.map((m) => ({ ...m, cap: calcCapacity(m) })),
    [members]
  );

  const totals = useMemo(
    () => ({
      points: capacities.reduce((s, m) => s + m.cap.points, 0),
      hours: capacities.reduce((s, m) => s + m.cap.hours, 0),
      members: capacities.filter((m) => m.name.trim()).length,
    }),
    [capacities]
  );

  return (
    <ToolCard
      title="Sprint Capacity Calculator"
      subtitle="Calculate your team's available capacity considering PTO, meetings, and focus factor."
    >
      {/* Total */}
      <AnimatePresence>
        {totals.members > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-strong p-8 md:p-10 text-center mb-8"
          >
            <p className="text-sm uppercase tracking-widest text-foreground/80 font-sans mb-1">
              Team Capacity
            </p>
            <div className="flex items-center justify-center gap-8">
              <div>
                <div className="text-5xl md:text-6xl font-serif font-bold gold-text">
                  {totals.points}
                </div>
                <p className="text-sm text-foreground/70 font-sans mt-1">Story Points</p>
              </div>
              <div className="w-px h-16 bg-border/60" />
              <div>
                <div className="text-5xl md:text-6xl font-serif font-bold text-foreground">
                  {totals.hours}
                </div>
                <p className="text-sm text-foreground/70 font-sans mt-1">Hours</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Member rows */}
      <div className="glass-card p-6 md:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-semibold text-foreground text-lg">Team Members</h2>
          <button
            onClick={addMember}
            className="flex items-center gap-1.5 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans"
          >
            <Plus size={14} /> Add Member
          </button>
        </div>

        {capacities.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-border/40 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground/70 font-mono">{String(i + 1).padStart(2, "0")}</span>
                <input
                  type="text"
                  value={m.name}
                  onChange={(e) => updateMember(m.id, "name", e.target.value)}
                  className="bg-transparent border-b border-border/60 py-0.5 text-sm text-foreground font-sans placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="Name"
                />
              </div>
              <div className="flex items-center gap-4 text-sm font-sans">
                <span className="text-gold-dark font-medium">{m.cap.points} pts</span>
                <span className="text-foreground/75">{m.cap.hours}h</span>
                <button
                  onClick={() => removeMember(m.id)}
                  className="text-foreground/50 hover:text-red-400 transition-colors"
                  aria-label="Remove member"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-sm uppercase tracking-wider text-foreground/70 font-sans mb-0.5">
                  Days
                </label>
                <input
                  type="number"
                  value={m.availableDays}
                  onChange={(e) => updateMember(m.id, "availableDays", e.target.value)}
                  className="w-full bg-transparent border-b border-border/40 py-1 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
                  min="0"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider text-foreground/70 font-sans mb-0.5">
                  PTO
                </label>
                <input
                  type="number"
                  value={m.pto}
                  onChange={(e) => updateMember(m.id, "pto", e.target.value)}
                  className="w-full bg-transparent border-b border-border/40 py-1 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
                  min="0"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider text-foreground/70 font-sans mb-0.5">
                  Meetings
                </label>
                <input
                  type="number"
                  value={m.meetingLoad}
                  onChange={(e) => updateMember(m.id, "meetingLoad", e.target.value)}
                  className="w-full bg-transparent border-b border-border/40 py-1 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
                  min="0"
                  max="1"
                  step="0.05"
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider text-foreground/70 font-sans mb-0.5">
                  Focus
                </label>
                <input
                  type="number"
                  value={m.focusFactor}
                  onChange={(e) => updateMember(m.id, "focusFactor", e.target.value)}
                  className="w-full bg-transparent border-b border-border/40 py-1 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
                  min="0"
                  max="1"
                  step="0.05"
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider text-foreground/70 font-sans mb-0.5">
                  Pts/Day
                </label>
                <input
                  type="number"
                  value={m.dailyVelocity}
                  onChange={(e) => updateMember(m.id, "dailyVelocity", e.target.value)}
                  className="w-full bg-transparent border-b border-border/40 py-1 text-sm text-foreground font-mono focus:outline-none focus:border-gold/50 transition-colors"
                  min="0"
                  step="0.1"
                />
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

export default SprintCapacityCalculator;
