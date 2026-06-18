// prettier.config.mts
import { type Config } from 'prettier';

const config: Config = {
  printWidth: 100, // max line length
  tabWidth: 2, // spaces per tab
  useTabs: false, // spaces instead of tabs
  semi: true, // add semicolons
  singleQuote: true, // single quotes
  trailingComma: 'none', // no trailing commas
  bracketSpacing: true, // spaces inside object literals
  arrowParens: 'always', // always include parentheses in arrow functions
  endOfLine: 'lf' // line endings
};

export default config;
