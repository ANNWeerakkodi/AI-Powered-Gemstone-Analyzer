import { ABOUT_TEXT } from '../constants';
import { ScrollRevealText } from './ScrollRevealText';

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24 relative py-32 lg:py-56 px-8 overflow-hidden bg-background"
    >
      {/* Background Video aligned to the right side */}
      <div className="absolute inset-0 z-0 flex justify-end pointer-events-none">
        <div className="relative w-full lg:w-3/4 h-full">
          <video 
            src="https://download-video-ak.vimeocdn.com/v3-1/playback/bf0a9291-df33-4329-aa8a-a8ef2e90364b/5367ebf6-e38763fd?__token__=st=1785170290~exp=1785173890~acl=%2Fv3-1%2Fplayback%2Fbf0a9291-df33-4329-aa8a-a8ef2e90364b%2F5367ebf6-e38763fd%2A~hmac=6e64b23e847433b0f900c9b2b4214655b485571597c314845d4d50778c1632da&r=dXMtZWFzdDE%3D"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60 mix-blend-screen"
          />
          {/* Gradient overlays to smoothly fade the video into the background and remove any hard edges */}
          
          {/* Horizontal fade: Blends the left edge of the video into the solid background */}
          <div className="absolute inset-y-0 left-0 w-3/4 lg:w-1/2 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
          
          {/* Vertical fades: Blends the top and bottom edges */}
          <div className="absolute inset-x-0 top-0 h-32 lg:h-48 bg-gradient-to-b from-background to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 lg:h-48 bg-gradient-to-t from-background to-transparent"></div>
          
          {/* Optional aesthetic color overlay */}
          <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text on the left side */}
          <div className="text-left max-w-2xl">
            <ScrollRevealText
              text={ABOUT_TEXT}
              className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] leading-relaxed font-heading text-foreground"
            />
          </div>
          {/* Empty right column allows the video to be fully visible on large screens */}
          <div className="hidden lg:block"></div>
        </div>
      </div>
    </section>
  );
}
