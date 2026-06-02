import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Search, XCircle } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Blocker {
  id: number;
  item: string;
  description: string;
  raisedDate: string;
  resolvedDate: string;
  impact: string;
  status: "open" | "resolved";
}

let nextBlockerId = 4;

const BlockerLog = () => {
  const [blockers, setBlockers] = useState<Blocker[]>([
    { id: 1, item: "Login feature", description: "Waiting for OAuth provider approval", raisedDate: "2026-05-20", resolvedDate: "", impact: "3", status: "open" },
    { id: 2, item: "Payment integration", description: "API rate limit exceeded", raisedDate: "2026-05-22", resolvedDate: "2026-05-25", impact: "5", status: "resolved" },
    { id: 3, item: "Deployment pipeline", description: "SSL certificate expired", raisedDate: "2026-05-24", resolvedDate: "2026-05-28", impact: "4", status: "resolved" },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");

  const addBlocker = () => {
    const max = blockers.reduce((m, b) => Math.max(m, b.id), 0);
    setBlockers((prev) => [
      ...prev,
      { id: max + 1, item: "", description: "", raisedDate: new Date().toISOString().split("T")[0], resolvedDate: "", impact: "3", status: "open" },
    ]);
  };

  const removeBlocker = (id: number) => {
    if (blockers.length <= 1) return;
    setBlockers((prev) => prev.filter((b) => b.id !== id));
  };

  const updateBlocker = (id: number, field: keyof Blocker, value: string) => {
    setBlockers((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const toggleStatus = (id: number) => {
    setBlockers((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: b.status === "open" ? "resolved" : "open",
              resolvedDate: b.status === "open" ? new Date().toISOString().split("T")[0] : "",
            }
          : b
      )
    );
  };

  const filtered = useMemo(() => {
    return blockers.filter((b) => {
      if (filter === "open" && b.status !== "open") return false;
      if (filter === "resolved" && b.status !== "resolved") return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          b.item.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [blockers, search, filter]);

  const stats = useMemo(() => {
    const open = blockers.filter((b) => b.status === "open").length;
    const resolved = blockers.filter((b) => b.status === "resolved").length;
    const resolvedWithDate = blockers.filter((b) => b.status === "resolved" && b.raisedDate && b.resolvedDate);
    const avgResolution =
      resolvedWithDate.length > 0
        ? resolvedWithDate.reduce((sum, b) => {
            const raised = new Date(b.raisedDate);
            const resolved = new Date(b.resolvedDate);
            return sum + Math.max(0, (resolved.getTime() - raised.getTime()) / (1000 * 60 * 60 * 24));
          }, 0) / resolvedWithDate.length
        : null;
    const avgImpact =
      blockers.length > 0
        ? blockers.reduce((sum, b) => sum + Number(b.impact), 0) / blockers.length
        : 0;
    return { open, resolved, avgResolution, avgImpact, total: blockers.length };
  }, [blockers]);

  return (
    <ToolCard
      title="Blockers & Impediments Log"
      subtitle="Track, manage, and analyse blockers that slow down your team's delivery."
    >
      <ToolInfo
        what="A Blocker (or Impediment) Log is a lightweight register where teams record anything blocking progress — technical dependencies, external approvals, resource constraints, or process issues. Each blocker is tracked from creation to resolution with impact assessment."
        why="Use it in daily standups and retrospectives. Surfacing blockers immediately helps the Scrum Master or manager remove them faster. Over time, the log reveals systemic issues and recurring blockers that need process changes."
        how="1. When a blocker is identified, create a log entry with the affected item and description. 2. Rate the impact (1-5) to prioritise resolution. 3. Track the date raised. 4. When resolved, mark as resolved and note the resolution date. 5. Review trends in retrospectives — recurring blockers signal deeper issues."
      />

      {/* Stats */}
      {stats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-strong p-5 md:p-6"
        >
          <h2 className="font-serif font-semibold text-foreground text-base mb-3">Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-serif font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-foreground/70 font-sans">Total Blockers</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-serif font-bold text-red-400">{stats.open}</p>
              <p className="text-sm text-foreground/70 font-sans">Open</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-serif font-bold text-emerald-500">{stats.resolved}</p>
              <p className="text-sm text-foreground/70 font-sans">Resolved</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-xl font-serif font-bold text-foreground">
                {stats.avgResolution !== null ? stats.avgResolution.toFixed(1) : "—"}
              </p>
              <p className="text-sm text-foreground/70 font-sans">Avg Resolution (days)</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="glass-card p-4 md:p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-1 min-w-[160px]">
            <Search size={14} className="text-foreground/60 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-b border-border/60 py-1 text-sm text-foreground font-sans placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="Search blockers..."
            />
          </div>
          <div className="flex items-center gap-1 text-sm font-sans">
            {(["all", "open", "resolved"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                  filter === f
                    ? "bg-gold/15 text-gold-dark border border-gold/30"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={addBlocker}
            className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors font-sans shrink-0"
          >
            <Plus size={14} /> Add Blocker
          </button>
        </div>
      </div>

      {/* Blocker list */}
      <div className="glass-card p-5 md:p-6 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-foreground/70 font-sans py-8">
            No blockers found. Add one to get started.
          </p>
        ) : (
          filtered.map((blocker, i) => (
            <motion.div
              key={blocker.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-xl p-4 space-y-3 ${
                blocker.status === "open" ? "border-red-400/30 bg-red-500/5" : "border-border/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm text-foreground/70 font-mono shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <input
                    type="text"
                    value={blocker.item}
                    onChange={(e) => updateBlocker(blocker.id, "item", e.target.value)}
                    className="bg-transparent border-b border-border/60 py-0.5 text-sm font-semibold text-foreground font-sans placeholder:text-foreground/60 focus:outline-none focus:border-gold/50 transition-colors max-w-[180px]"
                    placeholder="Affected item"
                  />
                  <span className={`text-sm font-medium font-sans px-2 py-0.5 rounded-full ${
                    blocker.status === "open" ? "bg-red-400/10 text-red-400" : "bg-emerald-500/10 text-emerald-500"
                  }`}>
                    {blocker.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateBlocker(blocker.id, "impact", String(s))}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          Number(blocker.impact) >= s
                            ? s >= 4 ? "bg-red-400" : s >= 3 ? "bg-amber-400" : "bg-muted-foreground/40"
                            : "bg-border/40"
                        }`}
                        aria-label={`Impact ${s}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => toggleStatus(blocker.id)}
                    className={`text-sm font-sans px-2 py-0.5 rounded transition-colors ${
                      blocker.status === "open"
                        ? "text-emerald-500 hover:bg-emerald-500/10"
                        : "text-foreground/70 hover:text-red-400"
                    }`}
                  >
                    {blocker.status === "open" ? "Resolve" : "Reopen"}
                  </button>
                  <button
                    onClick={() => removeBlocker(blocker.id)}
                    className="text-foreground/40 hover:text-red-400 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={blocker.description}
                onChange={(e) => updateBlocker(blocker.id, "description", e.target.value)}
                className="w-full bg-transparent text-sm text-foreground/75 font-sans placeholder:text-foreground/50 focus:outline-none"
                placeholder="Describe the blocker..."
              />

              <div className="flex gap-4 text-sm font-sans text-foreground/80">
                <div className="flex items-center gap-1">
                  <span>Raised:</span>
                  <input
                    type="date"
                    value={blocker.raisedDate}
                    onChange={(e) => updateBlocker(blocker.id, "raisedDate", e.target.value)}
                    className="bg-transparent text-foreground font-mono text-sm focus:outline-none"
                  />
                </div>
                {blocker.status === "resolved" && (
                  <div className="flex items-center gap-1">
                    <span>Resolved:</span>
                    <input
                      type="date"
                      value={blocker.resolvedDate}
                      onChange={(e) => updateBlocker(blocker.id, "resolvedDate", e.target.value)}
                      className="bg-transparent text-foreground font-mono text-sm focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <p className="text-center text-sm uppercase tracking-[0.25em] text-foreground/50 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default BlockerLog;
