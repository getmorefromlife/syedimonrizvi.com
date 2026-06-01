import { motion } from "framer-motion";
import { Send } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding bg-background relative min-h-screen pt-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-dark mb-2 font-sans">
            Let's Connect
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Get in Touch
          </h2>
        </motion.div>

        <motion.form
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card-strong p-8 md:p-12 space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 font-sans">
                Name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/60 text-foreground placeholder:text-muted-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 font-sans">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/60 text-foreground placeholder:text-muted-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition-shadow"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 font-sans">
              Message
            </label>
            <textarea
              rows={5}
              placeholder="How can I help you?"
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/60 text-foreground placeholder:text-muted-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition-shadow resize-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full gold-gradient text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Send size={16} />
            Send Message
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactSection;
