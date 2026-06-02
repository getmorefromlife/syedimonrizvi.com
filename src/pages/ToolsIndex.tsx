import { motion } from "framer-motion";
import { TrendingUp, LineChart, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tools = [
  {
    title: "Velocity Calculator",
    desc: "Track sprint velocity, compute averages, and forecast backlog completion.",
    icon: TrendingUp,
    href: "/tools/velocity",
    color: "text-gold-dark",
  },
  {
    title: "Burndown Chart",
    desc: "Generate ideal vs. actual burndown charts and export as PNG for standups.",
    icon: LineChart,
    href: "/tools/burndown",
    color: "text-gold-dark",
  },
  {
    title: "Sprint Capacity",
    desc: "Calculate team capacity with per-member PTO, meetings, and focus factor.",
    icon: Users,
    href: "/tools/capacity",
    color: "text-gold-dark",
  },
];

const ToolsIndex = () => (
  <>
    <Navbar />
    <section className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/40 font-sans mb-4">
            Free Project Management Tools
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Agile Toolbox
          </h1>
          <p className="text-muted-foreground font-sans text-sm max-w-lg mx-auto leading-relaxed">
            Minimal, privacy-first tools for agile teams. No sign-ups, no tracking — just data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((t, i) => (
            <motion.div
              key={t.href}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
            >
              <Link
                to={t.href}
                className="glass-card-strong block h-full p-8 group hover:-translate-y-1 transition-all duration-300"
              >
                <t.icon size={32} className={`${t.color} mb-5`} />
                <h2 className="font-serif font-semibold text-xl text-foreground mb-2 group-hover:text-gold-dark transition-colors">
                  {t.title}
                </h2>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-4">
                  {t.desc}
                </p>
                <div className="flex items-center gap-1 text-xs font-medium text-gold-dark font-sans">
                  Open Tool <ArrowRight size={12} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/30 font-sans mt-16">
          Built by Syed Imon Rizvi — Qalb Studios
        </p>
      </div>
    </section>
    <Footer />
  </>
);

export default ToolsIndex;
