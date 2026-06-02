import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, ThumbsUp, Lightbulb, AlertCircle } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

type FeedbackType = "positive" | "improvement" | "question";
type Priority = "low" | "medium" | "high";

interface Feedback {
  id: number;
  text: string;
  type: FeedbackType;
  priority: Priority;
  source: string;
  sprint: string;
  date: string;
  actionItem: string;
}

let nextId = 7;

const TYPE_ICONS: Record<FeedbackType, React.ComponentType<{ size?: number; className?: string }>> = {
  positive: ThumbsUp,
  improvement: Lightbulb,
  question: AlertCircle,
};

const TYPE_STYLES: Record<FeedbackType, string> = {
  positive: "bg-emerald-500/10 border-emerald-400/30 text-emerald-500",
  improvement: "bg-amber-500/10 border-amber-400/30 text-amber-500",
  question: "bg-sky-500/10 border-sky-400/30 text-sky-500",
};

const PRIORITY_STYLES: Record<Priority, string> = {
  low: "text-foreground/80",
  medium: "text-amber-500",
  high: "text-red-400",
};

const SprintReviewCollector = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([
    { id: 1, text: "Really love the new dashboard layout — much cleaner!", type: "positive", priority: "low", source: "Stakeholder A", sprint: "Sprint 8", date: "2026-06-01", actionItem: "" },
    { id: 2, text: "Search feature is slow when filtering by date range", type: "improvement", priority: "high", source: "Product Owner", sprint: "Sprint 8", date: "2026-06-01", actionItem: "Optimise date-range query in search API" },
    { id: 3, text: "Can we export reports to Excel?", type: "question", priority: "medium", source: "User Group", sprint: "Sprint 8", date: "2026-06-01", actionItem: "Evaluate CSV/Excel export library" },
  ]);
  const [filterType, setFilterType] = useState<FeedbackType | "all">("all");

  const addFeedback = () => {
    const id = nextId++;
    setFeedback((prev) => [...prev, { id, text: "", type: "improvement", priority: "medium", source: "", sprint: "", date: new Date().toISOString().split("T")[0], actionItem: "" }]);
  };

  const removeFeedback = (id: number) => {
    if (feedback.length <= 1) return;
    setFeedback((prev) => prev.filter((f) => f.id !== id));
  };

  const update = (id: number, field: keyof Feedback, value: string) => {
    setFeedback((prev) => prev.map((f) => f.id === id ? { ...f, [field]: value } : f));
  };

  const stats = useMemo(() => {
    return {
      total: feedback.length,
      positive: feedback.filter((f) => f.type === "positive").length,
      improvement: feedback.filter((f) => f.type === "improvement").length,
      question: feedback.filter((f) => f.type === "question").length,
      highPriority: feedback.filter((f) => f.priority === "high" && f.type === "improvement").length,
    };
  }, [feedback]);

  const filtered = feedback.filter((f) => filterType === "all" || f.type === filterType);

  return (
    <ToolCard
      title="Sprint Review Feedback Collector"
      subtitle="Capture, categorise, and act on feedback from sprint reviews and stakeholder demos."
    >
      <ToolInfo
        what="The Sprint Review is a working session where the team demonstrates completed work and gathers feedback from stakeholders. This collector organises feedback into three types: positive (reinforce what works), improvement (actionable changes), and questions (clarifications or new needs)."
        why="Use it during or immediately after Sprint Reviews. Structured feedback prevents valuable insights from being lost, helps the Product Owner prioritise the backlog, and shows stakeholders their input is valued."
        how="1. During the review, capture each piece of feedback as it comes. 2. Categorise as positive, improvement, or question. 3. Assign a priority to improvement items. 4. Note the source and sprint. 5. For improvements, define an action item and add it to the backlog. 6. Review the feedback distribution each sprint to spot trends."
      />

      {/* Stats */}
      <div className="glass-card-strong p-4 md:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xl font-serif font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-foreground/70 font-sans">Total</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xl font-serif font-bold text-emerald-500">{stats.positive}</p>
            <p className="text-sm text-foreground/70 font-sans">Positive</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xl font-serif font-bold text-amber-500">{stats.improvement}</p>
            <p className="text-sm text-foreground/70 font-sans">Improvements</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xl font-serif font-bold text-sky-500">{stats.question}</p>
            <p className="text-sm text-foreground/70 font-sans">Questions</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card p-4 md:p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-sm font-sans">
            {(["all", "positive", "improvement", "question"] as const).map((t) => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${filterType === t ? "bg-gold/15 text-gold-dark border border-gold/30" : "text-foreground/70 hover:text-foreground"}`}>{t}</button>
            ))}
          </div>
          <button onClick={addFeedback} className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans shrink-0 ml-auto">
            <Plus size={14} /> Add Feedback
          </button>
        </div>
      </div>

      {/* Feedback list */}
      <div className="glass-card p-4 md:p-5 space-y-3">
        {filtered.length === 0 && <p className="text-center text-sm text-foreground/70 font-sans py-8">No feedback captured yet.</p>}
        {filtered.map((f, i) => {
          const Icon = TYPE_ICONS[f.type];
          return (
            <motion.div key={f.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className={`border rounded-xl p-4 space-y-3 ${f.type === "positive" ? "border-emerald-400/20" : f.type === "improvement" ? "border-amber-400/20" : "border-sky-400/20"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Icon size={16} className={TYPE_STYLES[f.type].split(" ")[2] || "text-foreground/75"} />
                  <span className="text-sm text-foreground/70 font-mono shrink-0">#{String(i + 1).padStart(2, "0")}</span>
                  <span className={`text-sm font-medium font-sans px-2 py-0.5 rounded-full border ${TYPE_STYLES[f.type]}`}>{f.type}</span>
                  <select value={f.priority} onChange={(e) => update(f.id, "priority", e.target.value)}
                    className={`text-sm font-sans bg-transparent border border-border/30 rounded px-1.5 py-0.5 ${PRIORITY_STYLES[f.priority as Priority]}`}>
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </select>
                </div>
                <button onClick={() => removeFeedback(f.id)} className="text-foreground/40 hover:text-red-400 transition-colors shrink-0" aria-label="Remove"><Trash2 size={12} /></button>
              </div>

              <textarea value={f.text} onChange={(e) => update(f.id, "text", e.target.value)}
                className="w-full bg-transparent text-sm text-foreground font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors resize-none h-14" placeholder="What was the feedback?" />

              <div className="flex flex-wrap gap-3 text-sm font-sans text-foreground/80">
                <div className="flex items-center gap-1">
                  <span>Source:</span>
                  <input type="text" value={f.source} onChange={(e) => update(f.id, "source", e.target.value)}
                    className="bg-transparent text-foreground border-b border-transparent focus:border-gold/50 focus:outline-none max-w-[120px]" placeholder="Name" />
                </div>
                <div className="flex items-center gap-1">
                  <span>Sprint:</span>
                  <input type="text" value={f.sprint} onChange={(e) => update(f.id, "sprint", e.target.value)}
                    className="bg-transparent text-foreground border-b border-transparent focus:border-gold/50 focus:outline-none max-w-[80px]" placeholder="Sprint" />
                </div>
                <div className="flex items-center gap-1">
                  <span>Date:</span>
                  <input type="date" value={f.date} onChange={(e) => update(f.id, "date", e.target.value)}
                    className="bg-transparent text-foreground font-mono border-b border-transparent focus:border-gold/50 focus:outline-none" />
                </div>
              </div>

              {f.type === "improvement" && (
                <div className="bg-gold/5 border border-gold/20 rounded-lg p-2.5">
                  <span className="text-sm uppercase tracking-wider text-gold-dark font-sans">Action Item</span>
                  <input type="text" value={f.actionItem} onChange={(e) => update(f.id, "actionItem", e.target.value)}
                    className="w-full bg-transparent text-sm text-foreground font-sans mt-0.5 border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors" placeholder="What will we do about this?" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default SprintReviewCollector;
