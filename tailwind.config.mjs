export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        'pink-main': '#ff69b4',
        'pink-light': '#ffd1dc',
        'pink-soft': '#fff0f5',
        'pink-border': '#ffb6c1',
      },
      boxShadow: {
        'pink-card': '0 10px 40px rgba(255,105,180,0.3)',
        'pink-avatar': '0 10px 25px rgba(255,105,180,0.3)',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
