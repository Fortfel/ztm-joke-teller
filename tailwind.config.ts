import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      // strategy: 'base', // only generate global styles
      // strategy: 'class', // only generate classes
    }),
    // https://github.com/jamiebuilds/tailwindcss-animate/tree/main
    // require('./plugins/bg-stripes')({
    //   // Optional configuration
    //   size: '7.07px',
    //   angle: '135deg',
    //   opacity: 50,
    //   bgOpacity: 10,
    // }),
  ],
} satisfies Config
