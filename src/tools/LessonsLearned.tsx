import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Search } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

type Category = "process" | "tech" | "people" | "tools" | "other";
type Status = "open" | "in-progress" | "done";

interface Lesson {
  id: number;
  what: string;
  outcome: string;
  action: string;
  category: Category;
  status: Status;
  owner: string;
  date: string;
}

let nextId = 6;

const CAT_STYLES: Record<Category, string> = {
  process: "bg-violet-500/10 border-violet-400/30 text-violet-500",
  tech: "bg-sky-500/10 border-sky-400/30 text-sky-500",
  people: "bg-emerald-500/10 border-emerald-400/30 text-emerald-500",
  tools: "bg-amber-500/10 border-amber-400/30 text-amber-500",
  other: "bg-muted/20 border-border/40 text-muted-foreground",
};

const LessonsLearned = () => {
  const [lessons, setLessons] = useState<Lesson[]>([
    { id: 1, what: "Prerender script failed on Netlify because Chrome wasn't installed", outcome: "Build broke, deploy delayed by 30 minutes", action: "Add 'npx puppeteer browsers install chrome' to build command in netlify.toml", category: "process", status: "done", owner: "Syed", date: "2026-06-02" },
    { id: 2, what: "Audio files with spaces in names caused URL encoding issues", outcome: "Tracks wouldn't load in production", action: "Rename all audio files to slug-style names (no spaces, no special characters)", category: "tech", status: "done", owner: "Syed", date: "2026-05-28" },
    { id: 3, what: "Browser autoplay policy blocks audio on page load", outcome: "Hero audio didn't play on first visit", action: "Add a splash/entry overlay that requires user tap before audio plays", category: "tools", status: "done", owner: "Syed", date: "2026-05-25" },
    { id: 4, what: "Stale closures in audio player callbacks", outcome: "Track navigation and play/pause had intermittent bugs", action: "Use refs for callback refs instead of state closures, single Audio element lifecycle", category: "tech", status: "done", owner: "Syed", date: "2026-05-26" },
    { id: 5, what: "Single-page app has poor SEO for multi-content site", outcome: "Only homepage indexed by search engines", action: "Switch from hash routing to separate pages with React Router; add prerender script for static HTML", category: "process", status: "done", owner: "Syed", date: "2026-05-27" },
  ]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<Category | "all">("all");

  const addLesson = () => {
    const id = nextId++;
    setLessons((prev) => [...prev, { id, what: "", outcome: "", action: "", category: "process", status: "open", owner: "", date: new Date().toISOString().split("T")[0] }]);
  };

  const removeLesson = (id: number) => {
    if (lessons.length <= 1) return;
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  const update = (id: number, field: keyof Lesson, value: string) => {
    setLessons((prev) => prev.map((l) => l.id === id ? { ...l, [field]: value } : l));
  };

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      if (filterCat !== "all" && l.category !== filterCat) return false;
      if (search) {
        const q = search.toLowerCase();
        return l.what.toLowerCase().includes(q) || l.action.toLowerCase().includes(q);
      }
      return true;
    });
  }, [lessons, search, filterCat]);

  const stats = useMemo(() => {
    return {
      total: lessons.length,
      done: lessons.filter((l) => l.status === "done").length,
      inProgress: lessons.filter((l) => l.status === "in-progress").length,
      open: lessons.filter((l) => l.status === "open").length,
      categories: {
        process: lessons.filter((l) => l.category === "process").length,
        tech: lessons.filter((l) => l.category === "tech").length,
        people: lessons.filter((l) => l.category === "people").length,
        tools: lessons.filter((l) => l.category === "tools").length,
      },
    };
  }, [lessons]);

  return (
    <ToolCard
      title="Lessons Learned Log"
      subtitle="Capture, track, and action insights from retrospectives and post-mortems."
    >
      <ToolInfo
        what="A Lessons Learned log (or Retrospective Action Log) captures what went well, what didn't, and what actions the team commits to. It turns retrospective discussions into a trackable improvement backlog."
        why="Use it during and after every retrospective. Without a written log, lessons are forgotten and the same problems recur. Tracking action items with owners and dates ensures accountability."
        how="1. During retro, capture the situation (what happened) and the outcome. 2. Define a concrete action to prevent or replicate it. 3. Assign an owner and set the status. 4. Review open actions at the start of each retro. 5. Celebrate completed actions to encourage participation."
      />

      {/* Stats */}
      <div className="glass-card-strong p-4 md:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xl font-serif font-bold text-foreground">{stats.total}</p>
            <p className="text-[10px] text-muted-foreground/50 font-sans">Total</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xl font-serif font-bold text-emerald-500">{stats.done}</p>
            <p className="text-[10px] text-muted-foreground/50 font-sans">Done</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xl font-serif font-bold text-amber-500">{stats.inProgress}</p>
            <p className="text-[10px] text-muted-foreground/50 font-sans">In Progress</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xl font-serif font-bold text-red-400">{stats.open}</p>
            <p className="text-[10px] text-muted-foreground/50 font-sans">Open</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-sm font-serif font-bold gold-text">{stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}%</p>
            <p className="text-[10px] text-muted-foreground/50 font-sans">Resolution rate</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card p-4 md:p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-1 min-w-[160px]">
            <Search size={14} className="text-muted-foreground/40 shrink-0" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-sans placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/50 transition-colors" placeholder="Search..." />
          </div>
          <div className="flex items-center gap-1 text-xs font-sans">
            {(["all", "process", "tech", "people", "tools", "other"] as const).map((c) => (
              <button key={c} onClick={() => setFilterCat(c)}
                className={`px-2 py-1 rounded-md capitalize transition-colors ${filterCat === c ? "bg-gold/15 text-gold-dark border border-gold/30" : "text-muted-foreground/50 hover:text-foreground"}`}>{c}</button>
            ))}
          </div>
          <button onClick={addLesson} className="flex items-center gap-1 text-xs font-medium text-gold-dark hover:text-gold transition-colors font-sans shrink-0">
            <Plus size={14} /> Add Lesson
          </button>
        </div>
      </div>

      {/* Lessons */}
      <div className="glass-card p-4 md:p-5 space-y-3">
        {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground/50 font-sans py-8">No lessons recorded yet.</p>}
        {filtered.map((l, i) => (
          <motion.div key={l.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="border border-border/40 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs text-muted-foreground/50 font-mono shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <input type="text" value={l.what} onChange={(e) => update(l.id, "what", e.target.value)}
                  className="flex-1 bg-transparent border-b border-border/60 py-0.5 text-sm font-semibold text-foreground font-sans placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/50 transition-colors" placeholder="What happened?" />
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <select value={l.category} onChange={(e) => update(l.id, "category", e.target.value)}
                  className={`text-[10px] font-medium font-sans px-2 py-0.5 rounded-full border bg-transparent ${CAT_STYLES[l.category as Category] || ""}`}>
                  <option value="process">process</option>
                  <option value="tech">tech</option>
                  <option value="people">people</option>
                  <option value="tools">tools</option>
                  <option value="other">other</option>
                </select>
                <select value={l.status} onChange={(e) => update(l.id, "status", e.target.value)}
                  className="text-[10px] font-sans bg-transparent border border-border/40 rounded px-1.5 py-0.5 text-muted-foreground">
                  <option value="open">open</option>
                  <option value="in-progress">in-progress</option>
                  <option value="done">done</option>
                </select>
                <button onClick={() => removeLesson(l.id)} className="text-muted-foreground/20 hover:text-red-400 transition-colors" aria-label="Remove"><Trash2 size={12} /></button>
              </div>
            </div>

            <div className="space-y-2">
              <textarea value={l.outcome} onChange={(e) => update(l.id, "outcome", e.target.value)}
                className="w-full bg-transparent text-xs text-muted-foreground font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors resize-none h-10" placeholder="What was the outcome / impact?" />
              <div className="bg-gold/5 border border-gold/20 rounded-lg p-2.5">
                <span className="text-[10px] uppercase tracking-wider text-gold-dark font-sans">Action Item</span>
                <textarea value={l.action} onChange={(e) => update(l.id, "action", e.target.value)}
                  className="w-full bg-transparent text-xs text-foreground font-sans mt-0.5 border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors resize-none h-10" placeholder="What will you do about it?" />
              </div>
              <div className="flex gap-3 text-[11px] font-sans text-muted-foreground/60">
                <div className="flex items-center gap-1">
                  <span>Owner:</span>
                  <input type="text" value={l.owner} onChange={(e) => update(l.id, "owner", e.target.value)}
                    className="bg-transparent text-foreground font-sans text-[11px] border-b border-transparent focus:border-gold/50 focus:outline-none" placeholder="Name" />
                </div>
                <div className="flex items-center gap-1">
                  <span>Date:</span>
                  <input type="date" value={l.date} onChange={(e) => update(l.id, "date", e.target.value)}
                    className="bg-transparent text-foreground font-mono text-[11px] border-b border-transparent focus:border-gold/50 focus:outline-none" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="glass-card p-4 md:p-5">
        <h2 className="font-serif font-semibold text-foreground text-sm mb-2">By Category</h2>
        <div className="flex flex-wrap gap-2 text-xs font-sans">
          {(Object.entries(stats.categories) as [Category, number][]).map(([cat, count]) => (
            <div key={cat} className={`px-2.5 py-1 rounded-md border ${CAT_STYLES[cat]}`}>
              {cat}: {count}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/30 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default LessonsLearned;
