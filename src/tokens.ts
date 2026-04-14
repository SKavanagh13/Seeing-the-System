export const tokens = {
  color: {
    background: '#f6f1e8',
    surface: '#fffaf2',
    surfaceStrong: '#f1e5d1',
    text: '#1f1a17',
    textMuted: '#5e554d',
    border: '#d4c2aa',
    annual: '#1F4E79',
    trajectory: '#C97D1A',
    generational: '#0D6B5E',
    link: '#6d2e1c',
  },
  font: {
    body: '"Georgia", "Times New Roman", serif',
    heading: '"Avenir Next", "Segoe UI", sans-serif',
    mono: '"Consolas", "Courier New", monospace',
  },
  size: {
    body: '17px',
    keyQuestion: '28px',
    title: 'clamp(2rem, 3vw, 3rem)',
  },
  space: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  radius: {
    sm: '0.375rem',
    md: '0.75rem',
    pill: '999px',
  },
  shadow: {
    soft: '0 14px 40px rgba(74, 55, 34, 0.08)',
  },
} as const
