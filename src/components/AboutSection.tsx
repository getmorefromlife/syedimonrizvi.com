import { motion } from "framer-motion";
import { Award, RefreshCw, BookOpen, Music, Users, Star } from "lucide-react";

const expertise = [
  {
    icon: Star,
    title: "Creator of the Aligile Ethos",
    subtitle: "Remedying procedural drift in modern Agile",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: Award,
    title: "PMP® & Enterprise Agile Coach",
    subtitle: "PSM II, PAL I, SAFe Agilist",
    span: "col-span-1",
  },
  {
    icon: RefreshCw,
    title: "SAP & Cloud Transformation Consultant",
    subtitle: "S/4HANA, AWS, Azure, AI",
    span: "col-span-1",
  },
  {
    icon: BookOpen,
    title: "Religious Scholar & Polyglot",
    subtitle: "English, Urdu, Arabic, Persian",
    span: "col-span-1",
  },
  {
    icon: Music,
    title: "Liturgical Composer & Vocalist",
    subtitle: "Nasheed, poetry, film scoring",
    span: "col-span-1",
  },
  {
    icon: Users,
    title: "Founder — Mercer & Mills",
    subtitle: "Helping authors launch on Amazon KDP",
    span: "col-span-1 md:col-span-2",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const AboutSection = () => {
  return (
    <section id="about" className="section-padding celestial-gradient relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-dark mb-2 font-sans">
            Who I Am
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            The Versatile Expert
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {expertise.map((e) => (
            <motion.div
              key={e.title}
              variants={item}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`glass-card-strong p-6 flex flex-col items-center text-center gap-3 cursor-default ${e.span}`}
            >
              <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shadow-md">
                <e.icon size={22} className="text-primary-foreground" />
              </div>
              <h3 className="font-serif font-semibold text-foreground text-lg">
                {e.title}
              </h3>
              <p className="text-sm text-muted-foreground font-sans">
                {e.subtitle}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
