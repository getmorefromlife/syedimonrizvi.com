import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";

const tracks = [
  {
    title: "Paak Sar Zameen Shaad Baad",
    type: "National Anthem Remix — Produced by Syed Imon Rizvi (Qalb Studios)",
    file: "/audio/paak-sar-zameen.mp3",
  },
  {
    title: "Ramzaan — Kids Song",
    type: "Lyrics: Syed Imon Rizvi",
    file: "/audio/ramzaan-kids-song.mp3",
  },
];

function formatTime(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const StudioSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(false);

  const track = tracks[currentIndex];

  isPlayingRef.current = isPlaying;

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (i === tracks.length - 1 ? 0 : i + 1));
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? tracks.length - 1 : i - 1));
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);
  }, []);

  const handleNextRef = useRef(handleNext);
  handleNextRef.current = handleNext;

  // Create a single audio element on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const onTimeupdate = () => {
      if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };
    const onLoadedMetadata = () => {
      if (audioRef.current) setDuration(audioRef.current.duration);
    };
    const onCanPlay = () => {
      if (isPlayingRef.current && audio.paused) {
        audio.play().catch(() => setIsPlaying(false));
      }
    };
    const onEnded = () => handleNextRef.current();
    const onError = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeupdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeupdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Change source when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = track.file;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
  }, [currentIndex]);

  // Play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (isPlaying) {
      if (audio.readyState >= HTMLMediaElement.HAVE_METADATA && audio.paused) {
        audio.play().catch(() => setIsPlaying(false));
      }
    } else {
      if (!audio.paused) audio.pause();
    }
  }, [isPlaying]);

  // Volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      const el = progressRef.current;
      if (!audio || !el || !duration) return;
      const rect = el.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = pct * duration;
      setCurrentTime(audio.currentTime);
    },
    [duration],
  );

  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section
      id="studio"
      className="section-padding celestial-gradient relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-dark mb-2 font-sans">
            Listen & Experience
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Audio Studio
          </h2>
          <p className="mt-4 text-muted-foreground font-sans max-w-lg mx-auto">
            Reciter · Singer · Liturgical composer, musician, and vocalist
            (Digital & AI)
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card-strong overflow-hidden"
        >
          {/* Now Playing */}
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border-b border-white/5">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl gold-gradient flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
              <Music size={48} className="text-primary-foreground/80" />
              {isPlaying && (
                <div className="absolute inset-0 flex items-end justify-center gap-[3px] pb-5">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.span
                      key={i}
                      className="w-[3px] bg-primary-foreground/70 rounded-full"
                      animate={{
                        height: ["30%", "90%", "50%", "100%", "30%"],
                      }}
                      transition={{
                        duration: 0.8 + i * 0.15,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0 w-full">
              <p className="text-xs uppercase tracking-widest text-gold-dark font-sans mb-1">
                Now Playing
              </p>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground truncate">
                {track.title}
              </h3>
              <p className="text-sm text-muted-foreground font-sans mt-0.5">
                {track.type}
              </p>

              <div className="mt-4">
                <div
                  ref={progressRef}
                  className="relative w-full h-2 rounded-full bg-muted cursor-pointer group"
                  onClick={handleSeek}
                  role="slider"
                  aria-label="Seek"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progressPct)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    const audio = audioRef.current;
                    if (!audio || !duration) return;
                    const step = duration * 0.05;
                    if (e.key === "ArrowRight") {
                      audio.currentTime = Math.min(audio.currentTime + step, duration);
                    } else if (e.key === "ArrowLeft") {
                      audio.currentTime = Math.max(audio.currentTime - step, 0);
                    }
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full gold-gradient pointer-events-none"
                    style={{ width: `${progressPct}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gold-light shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ left: `calc(${progressPct}% - 8px)` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-xs text-muted-foreground font-mono tabular-nums">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Previous track"
              >
                <SkipBack size={16} />
              </button>
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center shadow-md hover:shadow-lg transition-shadow text-primary-foreground"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} className="ml-0.5" />
                )}
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Next track"
              >
                <SkipForward size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={16} />
                ) : (
                  <Volume2 size={16} />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolume(v);
                  if (v > 0 && isMuted) setIsMuted(false);
                }}
                className="w-20 sm:w-24 h-1.5 rounded-full appearance-none cursor-pointer bg-muted accent-gold-light
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-light [&::-webkit-slider-thumb]:shadow-md"
                aria-label="Volume"
              />
            </div>
          </div>

          {/* Track list */}
          <div className="px-6 sm:px-8 pb-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-sans mb-3">
              Playlist
            </p>
            <div className="space-y-1">
              {tracks.map((t, i) => {
                const active = i === currentIndex;
                return (
                  <motion.button
                    key={t.title}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      if (i === currentIndex) {
                        togglePlay();
                      } else {
                        setCurrentIndex(i);
                        setCurrentTime(0);
                        setDuration(0);
                        setIsPlaying(true);
                      }
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-colors duration-200 ${
                      active
                        ? "bg-gold/10 border border-gold-light/30"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        active
                          ? "gold-gradient text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {active && isPlaying ? (
                        <Pause size={13} />
                      ) : (
                        <Play size={13} className="ml-0.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          active ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {t.title}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-mono tabular-nums shrink-0 ${
                        active ? "text-gold-light" : "text-muted-foreground/60"
                      }`}
                    >
                      {t.type}
                    </span>
                    {active && isPlaying && (
                      <div className="flex items-end gap-[2px] h-4 shrink-0">
                        {[0, 1, 2].map((j) => (
                          <motion.span
                            key={j}
                            className="w-[2px] bg-gold-light rounded-full"
                            animate={{
                              height: ["30%", "100%", "50%", "80%", "30%"],
                            }}
                            transition={{
                              duration: 0.6 + j * 0.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StudioSection;
