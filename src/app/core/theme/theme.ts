/**
 * Theme catalog. Values must match the `data-theme` selectors in
 * src/theme/themes.scss and the storage key used by index.html's early
 * paint script.
 */

export type ThemeId = 'midnight' | 'ocean' | 'forest' | 'ember' | 'amethyst' | 'daylight';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  /** Swatch colors used by the theme picker (independent of the live palette). */
  swatches: [string, string, string];
  /** 'dark' or 'light' — drives status bar styling on native. */
  scheme: 'dark' | 'light';
  /** Base canvas color, used for native status bar background. */
  statusBarColor: string;
}

export const THEMES: readonly ThemeDefinition[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Default indigo glass on deep navy',
    swatches: ['#0b1020', '#6366f1', '#14b8a6'],
    scheme: 'dark',
    statusBarColor: '#0B1020',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool cyan and teal over deep sea',
    swatches: ['#04121f', '#0ea5e9', '#2dd4bf'],
    scheme: 'dark',
    statusBarColor: '#04121F',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Mossy green with lime highlights',
    swatches: ['#07160f', '#10b981', '#a3e635'],
    scheme: 'dark',
    statusBarColor: '#07160F',
  },
  {
    id: 'ember',
    name: 'Ember',
    description: 'Warm rose-to-amber glow',
    swatches: ['#1a0b10', '#f43f5e', '#f97316'],
    scheme: 'dark',
    statusBarColor: '#1A0B10',
  },
  {
    id: 'amethyst',
    name: 'Amethyst',
    description: 'Violet glass with pink accents',
    swatches: ['#120b24', '#a855f7', '#ec4899'],
    scheme: 'dark',
    statusBarColor: '#120B24',
  },
  {
    id: 'daylight',
    name: 'Daylight',
    description: 'Light glass over a soft sky',
    swatches: ['#eef2fb', '#4f46e5', '#14b8a6'],
    scheme: 'light',
    statusBarColor: '#EEF2FB',
  },
];

export const DEFAULT_THEME: ThemeId = 'midnight';

/** Shared with the inline script in src/index.html. */
export const THEME_STORAGE_KEY = 'splitwisely.theme';

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && THEMES.some((t) => t.id === value);
}

export function themeById(id: ThemeId): ThemeDefinition {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
