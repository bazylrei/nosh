import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nosh: {
          green: '#62CC9B',
          teal: '#3AA58F',
          charcoal: '#2E373E',
          coral: '#F3764B',
          leaf: '#D5C52D',
          grey: '#B7BFC0',
        },
      },
      fontFamily: {
        heading: ['Nunito', 'Arial', 'sans-serif'],
        body: ['Nunito Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
