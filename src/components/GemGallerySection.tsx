import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { FEATURED_GEMS } from '../constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function GemGallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setCurrentIndex(index);
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? FEATURED_GEMS.length - 1 : currentIndex - 1;
    scrollToSlide(newIndex);
  };

  const nextSlide = () => {
    const newIndex = currentIndex === FEATURED_GEMS.length - 1 ? 0 : currentIndex + 1;
    scrollToSlide(newIndex);
  };

  return (
    <section id="gallery" className="scroll-mt-24 bg-background py-20 md:py-32 pb-16 px-4 md:px-8 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium tracking-[-2px] text-foreground mb-4 font-heading">
            Sri Lankan{' '}
            <span className="font-accent italic font-normal">Gemstones</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the world-renowned precious gems from the island known as
            Ratna Dwīpa — the Island of Gems.
          </p>
        </motion.div>

        {/* Mobile Slideshow View */}
        <div className="block md:hidden relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 px-2 pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {FEATURED_GEMS.map((gem) => (
              <div
                key={gem.title}
                className="snap-center shrink-0 w-[85vw] max-w-sm flex flex-col"
              >
                <div className="liquid-glass aspect-[4/3] rounded-2xl overflow-hidden mb-3 relative group">
                  <img
                    src={gem.image}
                    alt={gem.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="liquid-glass-strong rounded-full px-3 py-1 text-xs font-medium text-foreground">
                      {gem.origin}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-medium text-foreground font-heading">
                  {gem.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {gem.category}
                </p>
              </div>
            ))}
          </div>

          {/* Controls: Left / Right arrows & Dots */}
          <div className="flex items-center justify-between mt-6 px-4">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="p-2.5 rounded-full bg-secondary/80 border border-border/50 text-foreground hover:bg-secondary active:scale-95 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {FEATURED_GEMS.map((gem, idx) => (
                <button
                  key={gem.title}
                  type="button"
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? 'w-7 bg-primary'
                      : 'w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/60'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="p-2.5 rounded-full bg-secondary/80 border border-border/50 text-foreground hover:bg-secondary active:scale-95 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {FEATURED_GEMS.map((gem, i) => (
            <motion.article
              key={gem.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group"
            >
              <div className="liquid-glass aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative">
                <img
                  src={gem.image}
                  alt={gem.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="liquid-glass-strong rounded-full px-3 py-1 text-xs font-medium text-foreground">
                    {gem.origin}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-medium text-foreground font-heading">
                {gem.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {gem.category}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
