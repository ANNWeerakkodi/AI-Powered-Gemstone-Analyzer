import { ABOUT_TEXT } from '../constants';
import { ScrollRevealText } from './ScrollRevealText';

export function AboutSection() {
  const imageUrl = "https://www.ceylon-gem.com/wp-content/uploads/2023/07/banner-image.png";

  return (
    <section
      id="about"
      className="scroll-mt-24 relative py-12 lg:py-48 min-h-screen flex items-center justify-center px-6 md:px-12 overflow-hidden bg-background"
    >
      {/* Background Image aligned to the right side — Desktop only */}
      <div className="absolute inset-0 z-0 hidden lg:flex justify-end pointer-events-none">
        <div className="relative w-full lg:w-7/8 h-full">
          <img
            src={imageUrl}
            alt="Ceylon Gemstones"
            className="w-full h-full object-cover opacity-50 filter contrast-110 brightness-90"
          />
          {/* Gradient overlays to smoothly fade the image into the background */}
          <div className="absolute inset-y-0 left-0 w-3/4 lg:w-1/2 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
          <div className="absolute inset-x-0 top-0 h-32 lg:h-48 bg-gradient-to-b from-background to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 lg:h-48 bg-gradient-to-t from-background to-transparent"></div>
          <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full flex flex-col items-center">
        {/* Centered Heading */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-2px] text-foreground font-heading">
            About <span className="font-accent italic font-normal text-primary">Us</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center w-full">
          {/* Text on the left side */}
          <div className="text-left max-w-2xl">
            <ScrollRevealText
              text={ABOUT_TEXT}
              className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-medium tracking-[-0.5px] leading-snug md:leading-relaxed font-heading text-foreground"
            />
          </div>

          {/* Separate Framed Image Card — Mobile view only */}
          <div className="w-full flex justify-center mt-4 lg:hidden">
            <div className="relative group w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border border-border/50 shadow-2xl shadow-black/40 liquid-glass-strong">
              <img
                src={imageUrl}
                alt="Ceylon Gemstones"
                className="w-full h-full object-cover object-right scale-135 origin-right group-hover:scale-145 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-40" />
            </div>
          </div>

          {/* Empty right column on desktop to reveal the background image */}
          <div className="hidden lg:block"></div>
        </div>
      </div>
    </section>
  );
}
