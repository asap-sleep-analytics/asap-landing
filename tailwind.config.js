/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#050807',
        graphite: '#0d1412',
        mint: '#6ef7cf',
        mintdeep: '#34d9ae',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      boxShadow: {
        mint: '0 0 0 1px rgba(110, 247, 207, 0.3), 0 20px 40px rgba(9, 15, 13, 0.5)',
      },
      backgroundImage: {
        grain:
          'radial-gradient(circle at 15% 20%, rgba(110,247,207,0.08), transparent 30%), radial-gradient(circle at 85% 0%, rgba(110,247,207,0.12), transparent 35%), linear-gradient(180deg, #050807 0%, #060b09 55%, #050807 100%)',
      },
    },
  },
  plugins: [],
};
