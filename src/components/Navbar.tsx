import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { Menu, X, Gem, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { theme, toggleTheme } = useTheme();

  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      const sections = ['services', 'about', 'gallery', 'how-to-use', 'contact'];

      if (window.scrollY < 200) {
        setActiveSection('home');
        return;
      }

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initially
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleScrollClick = (e: React.MouseEvent<HTMLElement>, section: string) => {
    e.preventDefault();
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(section);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-4">
      {/* Subtle glass background */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-xl border-b border-border/40 shadow-sm transition-colors duration-300" />

      {/* Brand logo */}
      <Link
        to="/"
        className="relative z-10 flex items-center gap-2.5 text-xl font-bold tracking-tight font-heading text-foreground group"
        onClick={() => setActiveSection('home')}
      >
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Gem className="w-5 h-5 text-primary" />
        </div>
        <span>
          Cyclone<span className="text-primary font-normal font-accent italic">Gems</span>
        </span>
      </Link>

      {/* Desktop nav */}
      <nav className="relative z-10 hidden lg:flex items-center gap-1 bg-secondary/30 p-1.5 rounded-full border border-border/50 backdrop-blur-md">
        {NAV_LINKS.map((item) => {
          let isActive = false;

          if (item.type === 'path') {
            if (item.path === '/') {
              isActive = isHome && activeSection === 'home';
            } else {
              isActive = location.pathname === item.path;
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => {
                  if (item.path === '/') setActiveSection('home');
                }}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${isActive
                  ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                  : 'text-foreground/80 hover:text-foreground hover:bg-secondary/50'
                  }`}
              >
                {item.label}
              </Link>
            );
          }

          // Hash link
          isActive = isHome && activeSection === item.section;

          return isHome ? (
            <a
              key={item.label}
              href={`#${item.section}`}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${isActive
                ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                : 'text-foreground/80 hover:text-foreground hover:bg-secondary/50'
                }`}
              onClick={(e) => handleScrollClick(e, item.section)}
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.label}
              to={`/#${item.section}`}
              className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/50 rounded-full transition-all duration-200"
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Actions (Theme Switcher + Analyze Quick Button) */}
      <div className="relative z-10 flex items-center gap-3">
        {/* Quick CTA */}
        <Link
          to="/analyze"
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze Gem</span>
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2.5 rounded-full bg-secondary/60 border border-border/50 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-40 bg-background/95 backdrop-blur-2xl border-b border-border p-6 shadow-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((item) => {
                let isActive = false;
                if (item.type === 'path') {
                  if (item.path === '/') {
                    isActive = isHome && activeSection === 'home';
                  } else {
                    isActive = location.pathname === item.path;
                  }
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={`px-4 py-3 text-base font-medium rounded-xl transition-colors ${isActive
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'text-foreground hover:bg-secondary/60'
                        }`}
                      onClick={() => {
                        if (item.path === '/') setActiveSection('home');
                        setMobileOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                }

                isActive = isHome && activeSection === item.section;

                return isHome ? (
                  <a
                    key={item.label}
                    href={`#${item.section}`}
                    className={`px-4 py-3 text-base font-medium rounded-xl transition-colors ${isActive
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'text-foreground hover:bg-secondary/60'
                      }`}
                    onClick={(e) => {
                      handleScrollClick(e, item.section);
                      setMobileOpen(false);
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={`/#${item.section}`}
                    className="px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/60 rounded-xl transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}

            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
