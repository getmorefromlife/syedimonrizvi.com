import { motion } from "framer-motion";
import { ExternalLink, BookOpen } from "lucide-react";
import booksImg from "@/assets/books-showcase.jpg";

type Book = {
  title: string;
  subtitle?: string;
};

type Category = {
  name: string;
  gradient: string;
  books: Book[];
};

const categories: Category[] = [
  {
    name: "Business & Professional Development",
    gradient: "from-amber-600/90 to-amber-400/90",
    books: [
      { title: "The Digital Factory", subtitle: "An Agile Leader's Playbook for Modern Technology Delivery" },
      { title: "The SAFe Playbook" },
      { title: "Scrum Guide 2020 Mindmaps" },
      { title: "Mastering the S/4HANA Core Transformation", subtitle: "Greenfield, Brownfield & Hybrid Projects" },
      { title: "Mastering the 14 Qualities Series", subtitle: "Project Manager · Scrum Master · Agile Coach · Change Manager · Sales Manager · Risk Manager" },
      { title: "100 Questions, 100 Answers for Project Managers", subtitle: "Infinite Opportunities" },
      { title: "A Growth Mindset", subtitle: "Integrated Operating Series" },
    ],
  },
  {
    name: "Religious Publications",
    gradient: "from-emerald-600/90 to-emerald-400/90",
    books: [
      { title: "The Illuminated Path", subtitle: "Unveiling the Essence of Shi'ism" },
    ],
  },
  {
    name: "Literary & Poetry Publications",
    gradient: "from-violet-600/90 to-violet-400/90",
    books: [
      { title: "Outspoken" },
      { title: "Assalam-o-Alaikum O Universe" },
    ],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardItem = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

const BooksSection = () => {
  return (
    <section id="books" className="section-padding celestial-gradient relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-dark mb-2 font-sans">
            Published Works
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Author &amp; Digital Publisher
          </h2>
        </motion.div>

        {/* Watermark background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div
            className="absolute -right-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.06] rotate-12"
            style={{
              backgroundImage: `url(${booksImg})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              filter: "grayscale(1) contrast(1.2)",
            }}
          />
          <div
            className="absolute -left-20 bottom-0 w-[400px] h-[400px] opacity-[0.04] -rotate-6"
            style={{
              backgroundImage: `url(${booksImg})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              filter: "grayscale(1) contrast(1.2)",
            }}
          />
        </div>

        <div className="flex flex-col gap-12">
            {categories.map((cat) => (
              <motion.div
                key={cat.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`h-px flex-1 bg-gradient-to-r ${cat.gradient} opacity-40`} />
                  <span className={`text-xs font-bold uppercase tracking-[0.2em] font-sans bg-gradient-to-r ${cat.gradient} bg-clip-text text-transparent`}>
                    {cat.name}
                  </span>
                  <div className={`h-px flex-1 bg-gradient-to-l ${cat.gradient} opacity-40`} />
                </div>

                {/* Book cards */}
                <motion.div
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="grid md:grid-cols-2 gap-4"
                >
                  {cat.books.map((b) => (
                    <motion.div
                      key={b.title}
                      variants={cardItem}
                      whileHover={{ y: -6, scale: 1.02 }}
                      className="glass-card-strong overflow-hidden group cursor-pointer"
                    >
                      {/* Mini cover strip */}
                      <div className={`h-2 bg-gradient-to-r ${cat.gradient}`} />
                      <div className="p-5 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-serif font-bold text-foreground text-lg leading-tight">
                            {b.title}
                          </h3>
                          <ExternalLink
                            size={15}
                            className="text-muted-foreground group-hover:text-gold-dark transition-colors shrink-0 mt-1"
                          />
                        </div>
                        {b.subtitle && (
                          <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                            {b.subtitle}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 mt-1">
                          <BookOpen size={11} className="text-gold-dark/60" />
                          <span className="text-[10px] font-medium uppercase tracking-wider text-gold-dark/60 font-sans">
                            KDP Published
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
    </section>
  );
};

export default BooksSection;
