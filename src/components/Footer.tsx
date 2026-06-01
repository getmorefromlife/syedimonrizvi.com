import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="max-w-6xl mx-auto px-6 py-10 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <p className="text-sm text-muted-foreground font-sans">
        © {new Date().getFullYear()} Syed Imon Rizvi. All rights reserved.
      </p>
      <div className="flex items-center gap-5">
        {[
          { icon: Mail, href: "mailto:hello@syedimonrizvi.com" },
          { icon: Linkedin, href: "https://www.linkedin.com/in/syedimonrizvi/" },
          { icon: Github, href: "https://github.com/getmorefromlife" },
          { icon: Twitter, href: "https://x.com/syedimonrizvi" },
        ].map((s, i) => (
          <a
            key={i}
            href={s.href}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-gold-dark hover:shadow-md transition-all duration-200"
          >
            <s.icon size={18} />
          </a>
        ))}
      </div>
    </motion.footer>
  );
};

export default Footer;
