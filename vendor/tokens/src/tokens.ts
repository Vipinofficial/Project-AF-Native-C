/**
 * The single source of truth for ARLI's visual design.
 *
 * Web consumes the generated `tokens.css` (CSS custom properties).
 * Native imports `theme` from this package directly.
 * Run `npm run build:css` after editing — see README.
 *
 * Key names are camelCase and convert 1:1 to the existing CSS variable names
 * (`bgPrimary` → `--bg-primary`), so no existing web markup has to change.
 */

export const colors = {
  // --- Surfaces -------------------------------------------------------------
  bgPrimary: '#FAF6F0',
  bgSecondary: '#F4ECE1',
  colorCardBg: '#FFFFFF',
  /** Cream used for text and fills sitting ON dark primary surfaces. 49 uses. */
  colorCream: '#FAF5EC',

  // --- Borders --------------------------------------------------------------
  borderColor: '#E4DBC8',
  borderFocus: '#1A2542',

  // --- Text -----------------------------------------------------------------
  textPrimary: '#1A2542',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  colorPlaceholder: '#A0AEC0',

  // --- Brand ----------------------------------------------------------------
  colorPrimary: '#1A2542',
  colorPrimaryHover: '#111827',
  colorAccent: '#C2492F',
  colorAccentHover: '#9B3823',
  colorGold: '#D4AF37',

  // --- Navigation -----------------------------------------------------------
  /** Active nav icon. Deliberately lighter than colorPrimary. 26 uses. */
  colorNavActive: '#2A3B66',
  /** Inactive nav icon / stroke. 12 uses. */
  colorNavInactive: '#8A8270',

  // --- Status ---------------------------------------------------------------
  colorSuccess: '#1E4D3B',
  colorSuccessText: '#2E7D5B',
  colorSuccessBg: '#E2F0D9',
  colorWarning: '#D4AF37',
  /** Pending/warning badge text. 41 uses. */
  colorWarningText: '#A5732A',
  /** Pending/warning badge background. 11 uses. */
  colorWarningBg: '#FBF3E0',
  colorAmber: '#E9A23B',

  // --- Overlays -------------------------------------------------------------
  /** Toast background and shadow colour. 12 uses. */
  colorInk: '#22201C',
} as const;

export const space = {
  pagePx: '16px',
  pagePxMd: '24px',
  pagePxLg: '80px',
} as const;

/** Expo font family names, registered by `useFonts` in the native entry points. */
export const nativeFonts = {
  fontSerif: 'InstrumentSerif_400Regular',
  fontSerifItalic: 'InstrumentSerif_400Regular_Italic',
  fontSans: 'InstrumentSans_400Regular',
  fontSansMedium: 'InstrumentSans_500Medium',
  fontSansSemiBold: 'InstrumentSans_600SemiBold',
  fontSansBold: 'InstrumentSans_700Bold',
} as const;

/** CSS font stacks, matching the Google Fonts import in each web app. */
export const webFonts = {
  fontSerif: "'Instrument Serif', Georgia, serif",
  fontSans: "'Instrument Sans', system-ui, -apple-system, sans-serif",
} as const;

/**
 * Drop-in replacement for the old `src/theme.ts` in both native apps — same
 * shape, so migration is a one-line import swap.
 */
export const theme = { ...colors, ...nativeFonts } as const;

export type Colors = typeof colors;
export type ColorToken = keyof Colors;
export type Theme = typeof theme;
