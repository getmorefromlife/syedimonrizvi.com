import { motion } from "framer-motion";
import { ScrollText, Lightbulb, Heart, Eye, Shield, Check, Target, Globe, Users, Scale, BookOpen, Feather, Compass } from "lucide-react";

const coreConcepts = [
  {
    icon: Lightbulb,
    title: "Wisdom before Prescription",
    arabic: "Taslīm → Yaqīn",
    desc: "No practice has meaning without understanding its purpose. Knowledge with conviction over rituals without soul.",
  },
  {
    icon: Heart,
    title: "Conviction as Collective Purpose",
    arabic: "Yaqīn",
    desc: "True agility is powered by unshakable belief in the mission. Deep shared purpose over shallow compliance.",
  },
  {
    icon: Eye,
    title: "Truth over Assumptions",
    arabic: "Tasdīq",
    desc: "Every review and metric is an act of truth-seeking — courageous, evidence-based, and transparent.",
  },
  {
    icon: Shield,
    title: "Public Promise as Accountability",
    arabic: "Iqrār",
    desc: "Commitments are visible; boards and metrics are public acknowledgments — promises to each other and to society.",
  },
  {
    icon: Check,
    title: "Integrity in Completion",
    arabic: "Adāʾ",
    desc: "\"Done\" is not a checklist. It is the honorable discharge of our promises — quality with moral weight.",
  },
  {
    icon: Target,
    title: "Meaningful Action",
    arabic: "ʿAmal",
    desc: "All inner work must lead to outward good. Increments must create value and avoid harm.",
  },
];

const principles = [
  { icon: Lightbulb, title: "Wisdom Before Prescription", quote: "There is no wealth like wisdom." },
  { icon: Users, title: "Consultation as Guidance", quote: "No support more reliable than consultation." },
  { icon: Scale, title: "Justice as the Foundation", quote: "Justice puts things in their places." },
  { icon: Eye, title: "Truth Over Assumption", quote: "The tongue of the wise is behind his heart." },
  { icon: Compass, title: "Patience and Forbearance in Challenge", quote: "Forbearance is the bridle of the fool." },
  { icon: Heart, title: "Conviction Through Shared Purpose", quote: "He who has several opinions understands the pitfalls." },
  { icon: Shield, title: "Accountability Through Public Promise", quote: "He who is content with his own opinion faces danger." },
  { icon: Check, title: "Integrity in Fulfillment", quote: "Victory is by determination." },
  { icon: Target, title: "Meaningful Action, Not Empty Output", quote: "Through change of circumstances the mettle of men is known." },
  { icon: Globe, title: "Endurance Over Fragility", quote: "Endurance braves calamities." },
  { icon: Feather, title: "Humility Over Arrogance", quote: "He who adopts greed as a habit devalues himself." },
  { icon: BookOpen, title: "Systems Above Ego", quote: "Justice is superior." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const AligileSection = () => {
  return (
    <section id="aligile" className="section-padding celestial-gradient relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-dark mb-2 font-sans">
            The Framework
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">
            The Aligile Ethos
          </h2>
          <p className="text-muted-foreground font-sans text-base max-w-2xl mx-auto">
            Agility with Wisdom, Justice, and Integrity — inspired by the timeless wisdom of Imam Ali (a.s.)
          </p>
          <p className="text-xs text-muted-foreground/60 font-sans mt-2">
            Formulated and Founded by Syed Imon Rizvi — 2025
          </p>
        </motion.div>

        {/* Core Concepts */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-5 mb-20"
        >
          {coreConcepts.map((c) => (
            <motion.div
              key={c.title}
              variants={item}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass-card-strong p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center shadow-md shrink-0">
                  <c.icon size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground text-lg md:text-xl leading-tight">
                    {c.title}
                  </h3>
                  <span className="text-xs font-mono text-gold-dark tracking-wide">
                    {c.arabic}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                {c.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* 12 Principles */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
            12 Principles
          </h3>
          <p className="text-sm text-muted-foreground font-sans">
            Rooted in classical wisdom, built for modern agility
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {principles.map((p) => (
            <motion.div
              key={p.title}
              variants={item}
              className="glass-card p-4 flex items-start gap-3 group hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center shadow shrink-0 mt-0.5">
                <p.icon size={15} className="text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-serif font-semibold text-foreground text-base leading-tight mb-0.5">
                  {p.title}
                </h4>
                <p className="text-xs text-muted-foreground/70 font-sans italic">
                  {p.quote}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://getmorefromlife.github.io/aligile/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full gold-gradient text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <ScrollText size={16} />
            Read the Full Manifesto
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AligileSection;
