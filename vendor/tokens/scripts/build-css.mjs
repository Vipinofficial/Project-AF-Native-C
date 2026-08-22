// Generates src/tokens.css from src/tokens.ts so web and native cannot drift.
// Run: npm run build:css
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { colors, space, webFonts } from '../src/tokens.ts';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'tokens.css');

/** bgPrimary -> --bg-primary */
const cssVar = (key) => '--' + key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const block = (obj) =>
  Object.entries(obj).map(([k, v]) => `  ${cssVar(k)}: ${v};`).join('\n');

const css = `/* GENERATED FILE — do not edit.
 * Source: packages/tokens/src/tokens.ts
 * Regenerate: npm run build:css
 */

:root {
  /* Colours */
${block(colors)}

  /* Spacing */
${block(space)}

  /* Typography */
${block(webFonts)}
}
`;

writeFileSync(OUT, css, 'utf8');

const count = Object.keys(colors).length + Object.keys(space).length + Object.keys(webFonts).length;
console.log(`wrote src/tokens.css — ${count} custom properties`);
