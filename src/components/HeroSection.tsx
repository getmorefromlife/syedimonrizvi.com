import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BookOpen, Music } from "lucide-react";
import profileImg from "@/assets/syed-imon-rizvi.png";

function formatTime(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const PROGRESS_RADIUS = 90;
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS;

const HeroSection = () => {
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleEnter = useCallback(() => {
    if (audioRef.current) return;
    setEntered(true);

    const audio = new Audio("/audio/soft-landing.mp3");
    audio.volume = 0.15;
    audioRef.current = audio;

    const onMeta = () => {
      setDuration(audio.duration);
      setLoaded(true);
    };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnd = () => setPlaying(false);

    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    audio.play().then(() => setPlaying(true)).catch(() => {});

    return () => {
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const dashOffset = PROGRESS_CIRCUMFERENCE * (1 - progressPct / 100);

  return (
    <>
      {/* Entry overlay */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={handleEnter}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center celestial-gradient cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-center px-6"
            >
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden shadow-[0_0_50px_rgba(196,164,80,0.3)] border-2 border-white/40 mb-6">
                <img
                  src={profileImg}
                  alt="Syed Imon Rizvi"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-2">
                Syed Imon Rizvi
              </h1>
              <p className="text-base text-muted-foreground font-sans max-w-md">
                Creator of the Aligile Ethos — Enterprise Agile Coach, PMP, Author &amp; Poet
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-12 text-sm text-muted-foreground/60 font-sans tracking-wide flex items-center gap-2"
            >
              <Music size={14} className="text-gold-light" />
              Tap anywhere to enter
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero content */}
      <section className="relative min-h-screen flex items-center justify-center celestial-gradient overflow-hidden pt-20">
        {/* Animated orbs */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="orb w-72 h-72 bg-gold-light/20 top-20 -left-20"
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="orb w-96 h-96 bg-celestial-deep/30 bottom-10 -right-32"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="orb w-48 h-48 bg-gold/15 top-1/2 left-1/3"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Profile image with progress ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="mx-auto mb-8 relative inline-block"
          >
            <div className="w-40 h-40 md:w-52 md:h-52 mx-auto rounded-full overflow-hidden shadow-[0_0_60px_rgba(196,164,80,0.25)] border-4 border-white/60 animate-float relative z-10">
              <img
                src={profileImg}
                alt="Syed Imon Rizvi"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Circular progress ring */}
            {entered && loaded && (
              <svg
                className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                viewBox="0 0 200 200"
                style={{ filter: "drop-shadow(0 0 6px rgba(196,164,80,0.3))" }}
              >
                <circle
                  cx="100"
                  cy="100"
                  r={PROGRESS_RADIUS}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="2.5"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={PROGRESS_RADIUS}
                  fill="none"
                  stroke="rgb(196,164,80)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={PROGRESS_CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-300 ease-linear"
                />
              </svg>
            )}

            {/* Timer text */}
            {entered && loaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap"
              >
                <span className="text-xs font-mono tracking-wider text-gold drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </motion.div>
            )}

            {/* Glow ring */}
            <div className="absolute inset-0 w-40 h-40 md:w-52 md:h-52 mx-auto rounded-full border-2 border-gold-light/20 animate-glow-pulse" />
          </motion.div>

          {/* Headlines */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-foreground mb-4"
          >
            Syed Imon Rizvi
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-sans"
          >
            Bridging Technology, Art &amp; Spirituality — Agile Transformations, SAP &amp; Cloud, Poetry &amp; Liturgical Music
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full gold-gradient text-primary-foreground font-semibold text-sm shadow-[0_8px_30px_rgba(196,164,80,0.3)] hover:shadow-[0_12px_40px_rgba(196,164,80,0.45)] hover:scale-105 transition-all duration-300"
            >
              <Sparkles size={18} />
              Explore My Consultancy
            </a>
            <a
              href="/books"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass-card font-semibold text-sm text-foreground hover:scale-105 transition-all duration-300"
            >
              <BookOpen size={18} />
              View My Books
            </a>
          </motion.div>
        </div>

        {/* Now playing pill (bottom-left on hero) */}
        {playing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-6 flex items-center gap-2.5 px-4 py-2 rounded-full glass-card shadow-lg"
          >
            <div className="flex items-end gap-[2px] h-3.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-[2.5px] bg-gold-light rounded-full"
                  animate={{ height: ["30%", "100%", "50%", "80%", "30%"] }}
                  transition={{
                    duration: 0.5 + i * 0.15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-sans">
              Soft Landing
            </span>
          </motion.div>
        )}
      </section>
    </>
  );
};

export default HeroSection;
