import { motion } from "framer-motion";
import typographyImg from "@/assets/typography-art.jpg";
import designImg1 from "@/assets/design-work-1.jpg";
import designImg2 from "@/assets/design-work-2.jpg";

const works = [
  { src: typographyImg, alt: "Arabic Calligraphy Art", label: "Digital Typography" },
  { src: designImg1, alt: "Geometric Design", label: "Graphic Design" },
  { src: designImg2, alt: "Brand Identity", label: "Brand Identity" },
];

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="section-padding bg-background relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-dark mb-2 font-sans">
            Creative Works
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Creative Portfolio
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {works.map((w, i) => (
            <motion.div
              key={w.label}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card-strong overflow-hidden group cursor-pointer"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={w.src}
                  alt={w.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="font-serif font-semibold text-foreground">
                  {w.label}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
