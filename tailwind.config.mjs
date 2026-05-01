/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#2D2A26',
        secondary: '#F5EFE6',
        accent: '#C45F2E',
        soft: '#A4B5A0',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#2D2A26',
            a: {
              color: '#C45F2E',
              textDecoration: 'underline',
              '&:hover': {
                color: '#A4B5A0',
              },
            },
            h1: {
              fontFamily: 'Fraunces, serif',
              color: '#2D2A26',
            },
            h2: {
              fontFamily: 'Fraunces, serif',
              color: '#2D2A26',
            },
            h3: {
              fontFamily: 'Fraunces, serif',
              color: '#2D2A26',
            },
            strong: {
              color: '#2D2A26',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
