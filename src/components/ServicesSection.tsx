import { motion } from 'motion/react';
import { SERVICES } from '../constants';
import { Link } from 'react-router-dom';
import { Search, Award, TrendingUp } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  '💎': <Search className="w-7 h-7" />,
  '⭐': <Award className="w-7 h-7" />,
  '💰': <TrendingUp className="w-7 h-7" />,
};

export function ServicesSection() {
  return (
    <section
      id="services"
      className="scroll-mt-10 bg-background py-10 px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium tracking-[-2px] text-foreground mb-4 font-heading">
            Our <span className="font-accent italic font-normal">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powered by deep learning models trained on thousands of Sri Lankan gemstone samples.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="liquid-glass-strong rounded-2xl p-8 h-full flex flex-col group hover:scale-[1.02] transition-transform duration-300">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  {iconMap[service.icon]}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 font-heading">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {service.description}
                </p>
                <Link
                  to={service.title.toLowerCase().includes('price') ? '/market-prices' : '/analyze'}
                  className="mt-6 text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                >
                  {service.title.toLowerCase().includes('price') ? 'Explore Market Prices →' : 'Try it now →'}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
