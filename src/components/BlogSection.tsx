import { motion } from 'motion/react';

const BLOG_POSTS = [
  {
    title: 'How AI is Revolutionizing Sri Lankan Gem Trade',
    excerpt: 'Machine learning models are now capable of identifying gemstones with over 95% accuracy, transforming how dealers assess gems.',
    date: 'Jul 2026',
    tag: 'AI & Technology',
  },
  {
    title: 'Understanding Gemstone Quality Grades: AAA to C',
    excerpt: 'A comprehensive guide to how professional gemstone grading works and what each quality tier means for pricing.',
    date: 'Jun 2026',
    tag: 'Education',
  },
  {
    title: 'The Rich History of Ratnapura: City of Gems',
    excerpt: 'Explore the millennia-old tradition of gem mining in Sri Lanka and why Ceylon gems command premium prices worldwide.',
    date: 'May 2026',
    tag: 'Heritage',
  },
];

export function BlogSection() {
  return (
    <section id="blog" className="scroll-mt-24 bg-background py-32 px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium tracking-[-2px] text-foreground mb-4 font-heading">
            Latest{' '}
            <span className="font-accent italic font-normal">Insights</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest news from the gemstone industry and AI technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="liquid-glass-strong rounded-2xl p-6 flex flex-col group hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
            >
              <span className="text-xs font-medium text-primary mb-3 uppercase tracking-wider">
                {post.tag}
              </span>
              <h3 className="text-lg font-semibold text-foreground mb-3 font-heading group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {post.excerpt}
              </p>
              <p className="text-xs text-muted-foreground mt-4">{post.date}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
