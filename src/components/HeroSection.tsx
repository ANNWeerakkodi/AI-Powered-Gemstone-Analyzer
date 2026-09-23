import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { HERO_STATS } from '../constants';
import { Sparkles, ArrowRight, Camera, Upload, ShieldCheck } from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen overflow-hidden scroll-mt-0 pt-20 flex flex-col justify-between"
    >
      {/* Hero Background Video */}
      <video
        src="https://res.cloudinary.com/yd5tclbf/video/upload/v1790096985/GemHero.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Dynamic theme backdrop overlay (removed backdrop-blur for performance) */}
      <div className="absolute inset-0 bg-background/70 transition-colors duration-300" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent transition-colors duration-300" />

      <div className="relative z-10 mx-auto max-w-4xl w-full px-6 md:px-8 py-16 md:py-24 flex-1 flex flex-col items-center justify-center text-center">
        {/* Gem AI badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <span className="inline-flex items-center gap-2 liquid-glass-strong rounded-full px-5 py-2 text-xs md:text-sm font-semibold text-foreground border border-border/50 shadow-md">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            AI-Powered Gemstone Intelligence
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-2px] text-foreground font-heading leading-tight"
        >
          Identify, Grade &{' '}
          <span className="font-accent italic font-normal text-primary">Value</span>{' '}
          Ceylon Gemstones
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
        >
          Unleash the ancient mystique of Sri Lankan gemstones with cutting-edge AI technology.
        </motion.p>

        {/* Interactive Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={() => navigate('/analyze', { state: { mode: 'camera' } })}
            className="flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 hover:opacity-90 hover:scale-105 active:scale-95 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>Scan with Camera</span>
          </button>

          <Link to="/analyze">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="liquid-glass-strong flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-foreground border border-border/50 hover:bg-secondary/60 transition-colors shadow-md"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Verification badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >

        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 w-full max-w-3xl grid grid-cols-3 gap-6 pt-8 border-t border-border/40"
        >
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-4xl font-bold text-foreground font-heading">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
