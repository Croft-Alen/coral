/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: 'var(--color-brand)',
        brandLight: 'var(--color-brand-light)',
        brandDark: 'var(--color-brand-dark)',
        pageBg: 'var(--color-page-bg)',
        cardBg: 'var(--color-card-bg)',
        textHeading: 'var(--color-text-heading)',
        textBody: 'var(--color-text-body)',
        textMuted: 'var(--color-text-muted)',
      },
      // ... your other theme extensions
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ... any other plugins you have
  ],
}