import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3a5273',
        'primary-container': '#526a8d',
        'on-primary': '#ffffff',
        surface: '#f9f9ff',
        'on-surface': '#001b3c',
        'on-surface-variant': '#43474e',
        'surface-container': '#e7eeff',
        'surface-container-low': '#f0f3ff',
        outline: '#74777f',
        secondary: '#b7102a',
        tertiary: '#27585a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: { DEFAULT: '0px', full: '9999px' },
    },
  },
};

export default config;
