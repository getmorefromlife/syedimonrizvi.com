import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen } from "lucide-react";

interface Section {
  title: string;
  content: string;
}

interface Props {
  what: string;
  why: string;
  how: string;
  sections?: Section[];
}

const ToolInfo = ({ what, why, how, sections }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card p-5 md:p-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen size={16} className="text-gold-dark shrink-0" />
          <span className="font-serif font-semibold text-foreground text-sm">
            What is this?
          </span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-muted-foreground/60" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4 border-t border-border/40 mt-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold-dark font-sans font-medium">
                  What it is
                </span>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed mt-1">{what}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold-dark font-sans font-medium">
                  When to use it
                </span>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed mt-1">{why}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold-dark font-sans font-medium">
                  How to use it
                </span>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed mt-1">{how}</p>
              </div>

              {sections && sections.length > 0 && (
                <div className="border-t border-border/30 pt-3 space-y-3">
                  {sections.map((s) => (
                    <div key={s.title}>
                      <span className="text-[10px] uppercase tracking-wider text-gold-dark font-sans font-medium">
                        {s.title}
                      </span>
                      <p className="text-sm text-muted-foreground font-sans leading-relaxed mt-1">{s.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToolInfo;
