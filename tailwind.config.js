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
        pageBg: 'var(--color-pageBg)',
        cardBg: 'var(--color-cardBg)',
        textHeading: 'var(--color-text-heading)',
        textBody: 'var(--color-text-body)',
        textMuted: 'var(--color-text-muted)',
        border: 'var(--color-border)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}