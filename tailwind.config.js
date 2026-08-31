module.exports = {
  /** @type {import('tailwindcss').Config} */
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#00DCFF',
        'accent-soft': '#52F0FF',
        'accent-dark': '#092E38',
        'border-accent': 'rgba(0,220,255,0.3)',
        'border-muted': '#797979',
        'border-subtle': 'rgba(255,255,255,0.08)',
        bg: '#11151B',
        'bg-card': '#0C0F14',
        'bg-elevated': '#161B24',
        'bg-elevated-2': '#1C2230',
        fg: '#FFFFFF',
        'fg-muted': 'rgba(255,255,255,0.6)',
        'fg-dim': 'rgba(255,255,255,0.35)',
        warning: '#FFAA00',
        danger: '#FF4444',
      },
      fontFamily: {
        heading: ["'Chakra Petch'", "'Montserrat'", "'Readex Pro'", 'sans-serif'],
        chakra: ["'Chakra Petch'", 'sans-serif'],
        body: ["'Readex Pro'", 'Inter', 'sans-serif'],
        readex: ["'Readex Pro'", 'sans-serif'],
        montserrat: ["'Montserrat'", 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        accentPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        shineOnce: {
          '0%': { transform: 'translateX(-3rem) skewX(-12deg)' },
          '100%': { transform: 'translateX(100vw) skewX(-12deg)' },
        },
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out both',
        'fade-in-up': 'fadeInUp 0.7s ease-out both',
        'accent-pulse': 'accentPulse 1.5s infinite',
        'shine-once': 'shineOnce 2.8s forwards',
        'reveal-up': 'revealUp 0.5s cubic-bezier(0.23,1,0.32,1) both',
        marquee: 'marquee 35s linear infinite',
        'marquee-reverse': 'marqueeReverse 35s linear infinite',
        'marquee-fast': 'marquee 22s linear infinite',
        'marquee-reverse-fast': 'marqueeReverse 22s linear infinite',
      },
      backgroundImage: {
        'gradient-brand-vertical': 'linear-gradient(180deg, #00DCFF 18.831%, #0088FF 95.455%)',
      },
    },
  },
  plugins: [],
};
