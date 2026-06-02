import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const ToolCard = ({ title, subtitle, children }: Props) => (
  <section className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6">
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-foreground/75 font-sans text-base max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="space-y-6"
      >
        {children}
      </motion.div>
    </div>
  </section>
);

export default ToolCard;
