import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const COMPONENTS = [
  'src/components/Badge.svelte',
  'src/components/Toaster.svelte',
  'src/components/Terminal.svelte',
  'src/components/StatusBadge.svelte',
  'src/components/ConfigFloatingWindow.svelte'
];

describe('Design Tokens Enforcement & Hex Palette Guard', () => {
  it('should not contain un-commented literal hex colors in the 5 target components', () => {
    COMPONENTS.forEach((filePath) => {
      const fullPath = path.resolve(filePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        const hexMatches = line.match(/#[0-9a-fA-F]{6}\b/g);
        if (hexMatches) {
          const hasExemptionComment = line.includes('Excepción documentada') || line.includes('Excepción');
          expect(
            hasExemptionComment,
            `Found undocumented hex color on line ${index + 1} of ${filePath}: "${line.trim()}"`
          ).toBe(true);
        }
      });
    });
  });

  it('should ensure all theme semantic tokens used in target components exist in all 3 theme blocks in theme.css', () => {
    const themePath = path.resolve('src/tokens/theme.css');
    const themeCss = fs.readFileSync(themePath, 'utf8');

    // Split theme.css into the three theme blocks
    const darkBlockMatch = themeCss.match(/(?::root,\s*\[data-theme='dark'\])([\s\S]*?)(?=\n\[data-theme='light'\]|\n@media)/);
    const lightBlockMatch = themeCss.match(/\[data-theme='light'\]([\s\S]*?)(?=\n@media|\n\/\*)/);
    const mediaBlockMatch = themeCss.match(/@media\s*\(prefers-color-scheme:\s*light\)([\s\S]*?)(?=\n\/\*|$)/);

    expect(darkBlockMatch, 'Dark theme block missing in theme.css').not.toBeNull();
    expect(lightBlockMatch, 'Light theme block missing in theme.css').not.toBeNull();
    expect(mediaBlockMatch, 'Media query light theme block missing in theme.css').not.toBeNull();

    const darkBlock = darkBlockMatch[1];
    const lightBlock = lightBlockMatch[1];
    const mediaBlock = mediaBlockMatch[1];

    // Collect all var(--swal-*) references from the 5 target components
    const usedTokens = new Set();
    COMPONENTS.forEach((filePath) => {
      const content = fs.readFileSync(path.resolve(filePath), 'utf8');
      const matches = content.match(/--swal-[a-zA-Z0-9-]+/g);
      if (matches) {
        matches.forEach((token) => usedTokens.add(token));
      }
    });

    // Semantic theme prefixes that must exist in all 3 blocks
    const themePrefixes = [
      '--swal-bg',
      '--swal-surface',
      '--swal-border',
      '--swal-text',
      '--swal-accent',
      '--swal-success',
      '--swal-warning',
      '--swal-danger',
      '--swal-info',
      '--swal-shadow',
      '--swal-hover',
      '--swal-void',
      '--swal-overlay'
    ];

    usedTokens.forEach((token) => {
      // Exclude dynamic properties set at runtime like --swal-accent-custom
      if (token === '--swal-accent-custom') return;

      const isSemantic = themePrefixes.some((prefix) => token.startsWith(prefix));
      if (isSemantic) {
        const inDark = darkBlock.includes(`${token}:`);
        const inLight = lightBlock.includes(`${token}:`);
        const inMedia = mediaBlock.includes(`${token}:`);

        expect(inDark, `Semantic token ${token} must exist in dark theme block`).toBe(true);
        expect(inLight, `Semantic token ${token} must exist in light theme block`).toBe(true);
        expect(inMedia, `Semantic token ${token} must exist in prefers-color-scheme light block`).toBe(true);
      } else {
        // Theme-independent tokens (radius, font, space) must exist somewhere in theme.css
        expect(themeCss.includes(`${token}:`), `Token ${token} must exist in theme.css`).toBe(true);
      }
    });
  });
});
