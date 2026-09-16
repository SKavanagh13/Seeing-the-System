// Design tokens — mirrors the CSS custom properties in styles.css.
// Use CSS variables in component styles; this file is a reference/documentation.

export const tokens = {
  color: {
    // Clock colors (semantic — never collapse to one accent)
    clockAnnual: '#1F4E79',
    clockTrajectory: '#C97D1A',
    clockGenerational: '#0D6B5E',
    clockAnnualHover: '#163A5A',
    clockTrajectoryHover: '#A8650F',
    clockGenerationalHover: '#0A574C',
    // Neutrals
    ink: '#14222F',
    bodyColor: '#24303B',
    bodyMuted: '#3B4650',
    secondary: '#4A5560',
    labelChipBg: '#4E5A66',
    paper: '#FFFFFF',
    paperMasthead: '#FFFDF8',
    panel: '#F2F5F7',
    rule: '#DDE2E6',
    ruleWarm: '#E3DFD4',
    dialInactive: '#C0BCB2',
    labelInactive: '#8C8A82',
    mastheadMuted: '#6B6A64',
    glossaryUnderline: '#8B99A5',
    termHoverTint: '#EEF3F7',
    // Status colors (toolkit only)
    statusGreen: '#2F6F4E',
    statusYellow: '#8A6A12',
    statusRed: '#A23B2E',
    // Go-further purple
    goFurtherTrigger: '#6B5F7D',
    goFurtherTriggerHover: '#4A3F58',
    goFurtherBillboard: '#3F3550',
    goFurtherRule: '#C9C0D6',
  },
  font: {
    serif: "'Instrument Serif', Georgia, serif",
    sans: "'IBM Plex Sans', system-ui, sans-serif",
    mono: "'IBM Plex Mono', 'Consolas', monospace",
    work: "'Work Sans', system-ui, sans-serif",
  },
  // Border radius: 0 everywhere — squareness is load-bearing for the institutional tone
  radius: 0,
} as const
