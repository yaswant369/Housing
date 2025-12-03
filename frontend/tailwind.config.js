// tailwind.config.js (ESM)
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your project structure
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          light: '#7c3aed',   // Light Indigo
          DEFAULT: '#5B21B6', // Indigo 700
          dark: '#4c1d95',    // Dark Indigo
        },
        secondary: {
          light: '#2dd4bf',   // Teal 400
          DEFAULT: '#14b8a6', // Teal 500
          dark: '#0f766e',    // Teal 700
        },
        accent: {
          amber: '#facc15',   // Amber 400
          amberDark: '#ca8a04', // Amber 600
          pink: '#ec4899',    // Pink 500
        },
        background: {
          light: '#f8fafc',   // Slate 50 - light grayish white
          DEFAULT: '#ffffff',
          dark: '#94a3b8',    // Slate 400 - for text
        },
        neutral: {
          100: '#f1f5f9',     // Slate 100
          300: '#cbd5e1',     // Slate 300
          600: '#475569',     // Slate 600 - dark text
        }
      },
      boxShadow: {
        card: '0 4px 15px rgba(91,33,182,0.15)', // subtle purple shadow
      },
      borderRadius: {
        'lg': '0.75rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};