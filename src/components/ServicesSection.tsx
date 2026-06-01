import { motion } from "framer-motion";
import { BarChart3, RefreshCw, Calendar, Lightbulb } from "lucide-react";

const services = [
  {
    icon: Lightbulb,
    title: "Aligile Ethos — Agile Transformation",
    description:
      "Foundational Agile coaching that integrates classical wisdom on leadership, ethics, and justice with modern Agile practices to remedy procedural drift.",
    price: "Custom Quote",
    cta: "Get in Touch",
  },
  {
    icon: BarChart3,
    title: "SAP & Cloud Transformation",
    description:
      "End-to-end SAP S/4HANA implementations, cloud migration (AWS, Azure), and enterprise AI strategy for operational excellence.",
    price: "Custom Quote",
    cta: "Get in Touch",
  },
  {
    icon: RefreshCw,
    title: "Scrum & Agile Certifications",
    description:
      "Certified workshops and coaching sessions — PSM I & II, PAL I, SAFe — to build high-performing agile teams from the ground up.",
    price: "From $499",
    cta: "Book a Session",
  },
  {
    icon: Calendar,
    title: "1-on-1 Mentorship",
    description:
      "Personalized guidance for career development, PMP certification, Agile leadership, and project management growth.",
    price: "From $199/hr",
    cta: "Schedule Now",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-background relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-dark mb-2 font-sans">
            What I Offer
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Professional Services
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="glass-card-strong p-8 flex flex-col items-center text-center gap-5 group"
            >
              <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center shadow-lg group-hover:shadow-[0_8px_30px_rgba(196,164,80,0.35)] transition-shadow duration-300">
                <s.icon size={28} className="text-primary-foreground" />
              </div>
              <h3 className="font-serif font-bold text-xl text-foreground">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                {s.description}
              </p>
              <p className="font-serif font-bold text-2xl gold-text">
                {s.price}
              </p>
              <a
                href="/contact"
                className="mt-auto inline-flex items-center gap-2 px-6 py-3 rounded-full gold-gradient text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                {s.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
