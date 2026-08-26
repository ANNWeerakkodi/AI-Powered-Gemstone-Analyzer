import { motion } from 'motion/react';
import { HOW_TO_USE_STEPS } from '../constants';
import { Camera, Sparkles, Award, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap: Record<string, React.ReactNode> = {
  Camera: <Camera className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
};

export function HowToUseSection() {
  return (
    <section id="how-to-use" className="scroll-mt-24 bg-background py-28 px-6 md:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Simple 4-Step Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-1.5px] text-foreground mb-4 font-heading">
            How to <span className="font-accent italic font-normal text-primary">Use</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get instant gemstone identification, quality classification, and market valuation in four easy steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_TO_USE_STEPS.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="liquid-glass-strong rounded-2xl p-6 flex flex-col justify-between group hover:scale-[1.03] transition-all duration-300 border border-border/50 shadow-lg shadow-black/5"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    {iconMap[item.icon]}
                  </div>
                  <span className="text-2xl font-bold font-heading text-primary/30 group-hover:text-primary transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
        >
          <div>
            <h3 className="text-xl font-bold text-foreground font-heading">Ready to test your gemstone?</h3>
            <p className="text-sm text-muted-foreground mt-1">Upload an image file or use your phone/laptop camera now.</p>
          </div>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90 hover:scale-105 transition-all shrink-0"
          >
            <span>Start Free Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
