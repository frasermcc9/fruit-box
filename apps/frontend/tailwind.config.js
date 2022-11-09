const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        17: 'repeat(17, minmax(0, 1fr))',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
  darkMode: ['class', `[data-theme="theme_dark"]`],
};
