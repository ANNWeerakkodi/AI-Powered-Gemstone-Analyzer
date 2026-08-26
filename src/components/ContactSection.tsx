import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import heroVideo from '../../assets/GemVideo.mp4';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: delay > 0.15 ? 30 : 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay },
});

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-10 flex h-screen w-full items-center justify-center overflow-hidden scroll-mt-24"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
      />
      <div className="absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute inset-0 z-[1] bg-black/50" />

      <div className="relative z-10 mx-auto max-w-3xl px-8 text-center">
        <motion.h2
          {...fadeUp(0)}
          className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-2px] text-foreground mb-6 font-heading"
        >
          Ready to{' '}
          <span className="font-accent italic font-normal">Discover</span>{' '}
          Your Gem&apos;s True Value?
        </motion.h2>
        <motion.p
          {...fadeUp(0.15)}
          className="text-lg text-muted-foreground mb-10"
        >
          Upload your gemstone image and let our AI reveal its identity, quality,
          and market value in seconds.
        </motion.p>
        <motion.div
          {...fadeUp(0.3)}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/analyze">
            <button
              type="button"
              className="rounded-full bg-primary px-10 py-4 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
            >
              START ANALYZING
            </button>
          </Link>
          <a
            href="#about"
            className="liquid-glass-strong rounded-full px-10 py-4 text-sm font-medium text-foreground hover:scale-[1.03] transition-transform"
          >
            LEARN MORE
          </a>
        </motion.div>
      </div>
    </section>
  );
}
