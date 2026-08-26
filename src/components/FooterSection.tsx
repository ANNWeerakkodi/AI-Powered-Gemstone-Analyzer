import { Link } from 'react-router-dom';
import { Gem } from 'lucide-react';

const SERVICES = ['Gemstone Identification', 'Quality Grading', 'Price Prediction', 'Analysis Reports'];
const COMPANY = ['Services', 'About', 'Gallery', 'How to Use', 'Analysis', 'Contact'];
const CONNECT = ['Twitter', 'LinkedIn', 'Instagram', 'GitHub'];

const handleScrollClick = (e: React.MouseEvent<HTMLElement>, section: string) => {
  e.preventDefault();
  const element = document.getElementById(section);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export function FooterSection() {
  return (
    <footer id="footer" className="scroll-mt-24 border-t border-border bg-background px-8 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Gem className="w-5 h-5 text-primary" />
              <p className="text-xl font-semibold tracking-tight text-foreground font-heading">
                CycloneGems
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered gemstone analysis platform for Sri Lanka&apos;s vibrant gem industry. Identify, grade, and value precious stones with confidence.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-4 font-heading">Services</p>
            <ul className="space-y-2">
              {SERVICES.map((item) => (
                <li key={item}>
                  <Link
                    to="/analyze"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-4 font-heading">Company</p>
            <ul className="space-y-2">
              {COMPANY.map((item) => {
                const section = item.toLowerCase();
                return (
                  <li key={item}>
                    <a
                      href={`#${section}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => handleScrollClick(e, section)}
                    >
                      {item}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-4 font-heading">Connect</p>
            <ul className="space-y-2">
              {CONNECT.map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © 2026 CycloneGems AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a
              href="#terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
