import { motion } from 'motion/react';
import { FEATURED_GEMS } from '../constants';

export function GemGallerySection() {
  return (
    <section id="gallery" className="scroll-mt-24 bg-background py-32 pb-16 px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
