import type { Config } from 'tailwindcss';

const lightColors = {
  black: {
    100: '#A4A4A4',
    200: '#666666',
    300: '#4D4D4D',
    400: '#2B2B2B',
    500: '#222222',
    600: '#1F1F1F',
    700: '#0F0F0F',
    800: '#000000',
  },
  neon: {
    100: '#EEFDC5',
    200: '#DFF998',
    300: '#CDF462',
    400: '#C1E950',
    500: '#B1DD38',
    600: '#A0CD27',
    700: '#8EB81B',
    800: '#7AA013',
    900: '#67870E',
  },
  purple: {
    100: 'F8F5FF',
    200: '#D9C6FE',
    300: '#BB9AFC',
    400: '#A281E4',
    500: '#8A55F6',
    600: '#793DF0',
    700: '#6C2CEA',
    800: '#6121E1',
    900: '#5819D7',
    1000: '#5214CC',
  },
};

const darkColors = {
  white: {
    100: '#fcfcfc',
    200: '#fafafa',
    300: '#f8f8f8',
    400: '#f6f6f6',
    500: '#f4f4f4',
    600: '#dedede',
    700: '#dadada',
    800: '#b8b8b8',
    900: '#868686',
  },
  black: {
    100: '#fcfcfc',
    200: '#fafafa',
    300: '#f8f8f8',
    400: '#f6f6f6',
    500: '#f4f4f4',
    600: '#dedede',
    700: '#dadada',
    800: '#b8b8b8',
    900: '#868686',
  },
};

export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        light: lightColors,
        dark: darkColors,
      },
      backgroundImage: {
        dots: 'radial-gradient(rgb(0 0 0 / 6%) 1px, transparent 2px)',
      },
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
