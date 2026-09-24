export const NAV_LINKS = [
  { label: 'Home', path: '/', type: 'path' as const },
  { label: 'Services', section: 'services', type: 'hash' as const },
  { label: 'About', section: 'about', type: 'hash' as const },
  { label: 'Gallery', section: 'gallery', type: 'hash' as const },
  { label: 'How to Use', section: 'how-to-use', type: 'hash' as const },
  { label: 'Market Prices', path: '/market-prices', type: 'path' as const },
  { label: 'Analysis', path: '/analyze', type: 'path' as const },
  { label: 'Contact', section: 'contact', type: 'hash' as const },
] as const;

export const HOW_TO_USE_STEPS = [
  {
    step: '01',
    title: 'Choose Upload or Camera',
    description: 'Select an image file from your device (JPEG, PNG, WebP) or open your device camera to take a live photo.',
    icon: 'Camera',
  },
  {
    step: '02',
    title: 'AI Gemstone Scan',
    description: 'Our neural network verifies if the image is a valid gemstone and identifies its exact class out of 12 varieties.',
    icon: 'Sparkles',
  },
  {
    step: '03',
    title: 'Quality & Value Valuation',
    description: 'Receive an instant AAA-C quality grade breakdown, clarity analysis, and real-time USD/LKR price estimation.',
    icon: 'Award',
  },
  {
    step: '04',
    title: 'Download Valuation Report',
    description: 'Export a certificate of analysis report summary for your records, gemstone trading, or appraisal.',
    icon: 'FileText',
  },
] as const;


export const GEMSTONE_CLASSES = [
  'Blue Sapphire',
  'Ruby',
  "Cat's Eye",
  'Padparadscha',
  'Star Sapphire',
  'Alexandrite',
  'Spinel',
  'Topaz',
  'Garnet',
  'Tourmaline',
  'Zircon',
  'Moonstone',
] as const;

// Images served from public/images directory — add your own gemstone photos there
export const FEATURED_GEMS = [
  {
    title: 'Ceylon Blue Sapphire',
    category: 'Corundum Family',
    origin: 'Ratnapura, Sri Lanka',
    image: '/images/blue_sapphire.jpg',
  },
  {
    title: 'Pigeon Blood Ruby',
    category: 'Corundum Family',
    origin: 'Elahera, Sri Lanka',
    image: '/images/ruby.jpg',
  },
  {
    title: "Chrysoberyl Cat's Eye",
    category: 'Chrysoberyl Family',
    origin: 'Matale, Sri Lanka',
    image: '/images/cats_eye.jpg',
  },
  {
    title: 'Padparadscha Sapphire',
    category: 'Corundum Family',
    origin: 'Ratnapura, Sri Lanka',
    image: '/images/padparadscha.jpg',
  },
] as const;

export const SERVICES = [
  {
    icon: '💎',
    title: 'Gemstone Identification',
    description:
      'Upload an image of any gemstone and our AI model trained on Sri Lankan gem varieties will instantly identify it with high accuracy.',
  },
  {
    icon: '⭐',
    title: 'Quality Grading',
    description:
      'Get a professional-grade quality assessment from AAA to C, based on visual clarity, color saturation, and cut characteristics.',
  },
  {
    icon: '💰',
    title: 'Price Prediction',
    description:
      'Receive real-time price estimates in both USD and LKR, calibrated to current Sri Lankan gemstone market conditions.',
  },
] as const;

export const ABOUT_TEXT =
  'We harness the power of machine learning and deep neural networks to bring world-class gemstone analysis to Sri Lanka\'s vibrant gem industry — enabling miners, dealers, and collectors to identify, grade, and value precious stones with confidence and precision.';

export const PROJECTS = [
  {
    title: 'Gem AI Identification Model',
    category: 'Computer Vision / Deep Learning',
    image: '/images/blue_sapphire.jpg',
  },
  {
    title: 'Market Value Estimator',
    category: 'Regression Analysis / Pricing',
    image: '/images/ruby.jpg',
  },
];

export const VIDEOS = {
  showcase: '',
  ctaHls: '',
};
