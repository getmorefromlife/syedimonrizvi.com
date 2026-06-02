import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Eye, EyeOff, RotateCcw } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

const CARDS = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, Infinity, "?"] as const;

interface Player {
  id: number;
  name: string;
  card: (typeof CARDS)[number] | null;
}

let nextPlayerId = 1;

const PlanningPoker = () => {
  const [players, setPlayers] = useState<Player[]>([
    { id: nextPlayerId++, name: "Player 1", card: null },
    { id: nextPlayerId++, name: "Player 2", card: null },
    { id: nextPlayerId++, name: "Player 3", card: null },
  ]);
  const [revealed, setRevealed] = useState(false);

  const addPlayer = () => {
    const num = players.length + 1;
    setPlayers((prev) => [...prev, { id: nextPlayerId++, name: `Player ${num}`, card: null }]);
  };

  const removePlayer = (id: number) => {
    if (players.length <= 1) return;
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    if (revealed) setRevealed(false);
  };

  const updateName = (id: number, name: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const selectCard = (id: number, card: (typeof CARDS)[number]) => {
    if (revealed) return;
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, card: p.card === card ? null : card } : p))
    );
  };

  const numericCards = useMemo(() => {
    const vals = players
      .map((p) => p.card)
      .filter((c): c is number => typeof c === "number" && c !== Infinity);
    return vals;
  }, [players, revealed]);

  const stats = useMemo(() => {
    const vals = numericCards;
    if (vals.length === 0) return null;
    const sum = vals.reduce((a, b) => a + b, 0);
    const avg = sum / vals.length;
    const sorted = [...vals].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const counts: Record<string, number> = {};
    vals.forEach((v) => {
      const k = String(v);
      counts[k] = (counts[k] || 0) + 1;
    });
    const mode = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return { avg, median, min, max, mode: Number(mode[0]), modeCount: mode[1], total: vals.length };
  }, [numericCards]);

  const hasAllSelected = players.every((p) => p.card !== null);

  return (
    <ToolCard
      title="Planning Poker"
      subtitle="Estimate story points collaboratively as a team. Reach consensus through discussion."
    >
      <ToolInfo
        what="Planning Poker (also called Scrum Poker) is a gamified estimation technique where team members assign story points to work items by playing numbered cards face down, then revealing simultaneously to avoid anchoring bias."
        why="Use it during Sprint Planning (or Backlog Refinement) to estimate effort for user stories, tasks, or features. Best for teams that want to avoid one person dominating the estimate."
        how="1. The Product Owner presents a story. 2. Each estimator privately selects a card matching their estimate. 3. All cards are revealed simultaneously. 4. If estimates differ significantly, high and low estimators explain their reasoning. 5. Re-estimate until consensus is reached."
      />

      {/* Cards reference */}
      <div className="glass-card p-5 md:p-6">
        <h2 className="font-serif font-semibold text-foreground text-sm mb-3">Card Deck (Fibonacci sequence)</h2>
        <div className="flex flex-wrap gap-2">
          {CARDS.map((c) => (
            <div
              key={String(c)}
              className="w-12 h-16 md:w-14 md:h-18 rounded-lg bg-background border border-border/50 flex items-center justify-center text-xs font-mono text-muted-foreground"
            >
              {c === Infinity ? "∞" : String(c)}
            </div>
          ))}
        </div>
      </div>

      {/* Players */}
      <div className="glass-card p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-semibold text-foreground text-sm">Players</h2>
          <div className="flex items-center gap-2">
            {revealed && (
              <button
                onClick={() => {
                  setRevealed(false);
                  setPlayers((prev) => prev.map((p) => ({ ...p, card: null })));
                }}
                className="flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-gold-dark transition-colors font-sans"
              >
                <RotateCcw size={12} /> Reset
              </button>
            )}
            <button
              onClick={addPlayer}
              className="flex items-center gap-1 text-xs font-medium text-gold-dark hover:text-gold transition-colors font-sans"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {players.map((player, i) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border/40 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground/50 font-mono">{String(i + 1).padStart(2, "0")}</span>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updateName(player.id, e.target.value)}
                  className="bg-transparent border-b border-border/60 py-0.5 text-sm text-foreground font-sans placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/50 transition-colors max-w-[140px]"
                  placeholder="Name"
                />
              </div>
              <button
                onClick={() => removePlayer(player.id)}
                className="text-muted-foreground/30 hover:text-red-400 transition-colors"
                aria-label="Remove player"
              >
                <Trash2 size={13} />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {CARDS.map((c) => {
                const selected = player.card === c;
                return (
                  <button
                    key={String(c)}
                    onClick={() => selectCard(player.id, c)}
                    disabled={revealed}
                    className={`w-10 h-13 md:w-11 md:h-14 rounded-lg text-xs font-mono transition-all ${
                      revealed && selected
                        ? "bg-gold/20 border-gold border-2 text-gold-dark font-bold"
                        : selected
                          ? "bg-gold/15 border-gold border-2 text-gold-dark font-bold"
                          : "bg-background border border-border/40 text-muted-foreground hover:border-muted-foreground/40"
                    } ${revealed ? "cursor-default" : "cursor-pointer"}`}
                  >
                    {c === Infinity ? "∞" : c === "?" ? "?" : String(c)}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls & Stats */}
      <div className="glass-card-strong p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-3">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              disabled={!hasAllSelected}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium font-sans transition-all ${
                hasAllSelected
                  ? "bg-gold/15 text-gold-dark border border-gold/30 hover:bg-gold/25"
                  : "bg-muted/20 text-muted-foreground/40 border border-border/30 cursor-not-allowed"
              }`}
            >
              <Eye size={14} /> Reveal Cards
            </button>
          ) : (
            <button
              onClick={() => {
                setRevealed(false);
                setPlayers((prev) => prev.map((p) => ({ ...p, card: null })));
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium font-sans bg-muted/20 text-muted-foreground border border-border/40 hover:bg-muted/30 transition-all"
            >
              <EyeOff size={14} /> New Round
            </button>
          )}
          {!hasAllSelected && !revealed && (
            <span className="text-[10px] text-muted-foreground/40 font-sans">
              Waiting for all players to select
            </span>
          )}
        </div>

        {revealed && stats && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-border/30"
          >
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-sans">Average</p>
              <p className="text-lg font-serif font-bold gold-text">{stats.avg.toFixed(1)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-sans">Median</p>
              <p className="text-lg font-serif font-bold text-foreground">{stats.median}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-sans">Mode</p>
              <p className="text-lg font-serif font-bold text-foreground">
                {stats.mode} <span className="text-xs text-muted-foreground/50">({stats.modeCount}x)</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-sans">Min</p>
              <p className="text-lg font-serif font-bold text-foreground">{stats.min}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-sans">Max</p>
              <p className="text-lg font-serif font-bold text-foreground">{stats.max}</p>
            </div>
          </motion.div>
        )}
      </div>

      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/30 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default PlanningPoker;
