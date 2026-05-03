/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        // Tilda-style: sans-serif throughout. Inter is the closest free-tier match for TildaSans.
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Tilda palette: white background, near-black text, signature red CTA, light grey for soft sections
        primary: '#171717',   // near-black for body text (matches Tilda's #171717 menu link color)
        secondary: '#FFFFFF', // pure white background
        accent: '#E73C3C',    // Tilda's signature red CTA
        soft: '#F5F5F5',      // subtle light grey for cards/sections
      },
      borderRadius: {
        // Tilda's signature 30px rounded corners on cards & buttons
        'tilda': '30px',
      },
      boxShadow: {
        // Tilda's CTA shadow
        'tilda-cta': '0px 15px 30px -10px rgba(0,11,48,0.2)',
        'tilda-card': '0px 4px 20px -8px rgba(0,0,0,0.08)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#171717',
            a: {
              color: '#E73C3C',
              textDecoration: 'underline',
              fontWeight: '600',
              '&:hover': {
                color: '#171717',
              },
            },
            h1: {
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: '700',
              color: '#171717',
            },
            h2: {
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: '700',
              color: '#171717',
            },
            h3: {
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: '700',
              color: '#171717',
            },
            strong: {
              color: '#171717',
              fontWeight: '700',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
