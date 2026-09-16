// Line-drawn SVG clock face for the masthead journey nav and chapter closing panels.
// viewBox 0 0 36 36, center at (18, 18).
// Hand positions are identity, not decoration — keep them constant.

export type ClockKey = 'annual' | 'trajectory' | 'generational'

const CLOCK_COLOR: Record<ClockKey, string> = {
  annual: '#1F4E79',
  trajectory: '#C97D1A',
  generational: '#0D6B5E',
}

// Hand angles in degrees from 12 o'clock (clockwise positive).
// Annual: hour at 9:00 (270°). Trajectory: hour at 6:00 (180°). Generational: hour at ~4:00 (120°).
// Minute hand is always at 12:00 (0°) on every clock.
const HAND_ANGLES: Record<ClockKey, { hour: number; minute: number }> = {
  annual:       { hour: 270, minute: 0 },
  trajectory:   { hour: 180, minute: 0 },
  generational: { hour: 120, minute: 0 },
}

const CX = 18
const CY = 18
const R_CIRCLE = 15.5
const R_TICK_OUTER = 13.5
const R_TICK_INNER = 10
const R_MINUTE_HAND = 12
const R_HOUR_HAND = 7.5
const R_CENTER_DOT = 1.9
const INACTIVE_COLOR = '#C0BCB2'
const CARDINAL_ANGLES = [0, 90, 180, 270]

function toCartesian(angleDeg: number, r: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CX + Math.cos(rad) * r,
    y: CY + Math.sin(rad) * r,
  }
}

type ClockDialProps = {
  clock: ClockKey
  size?: number
  visited?: boolean
}

export function ClockDial({ clock, size = 38, visited = false }: ClockDialProps) {
  const color = visited ? CLOCK_COLOR[clock] : INACTIVE_COLOR
  const { hour, minute } = HAND_ANGLES[clock]
  const minuteEnd = toCartesian(minute, R_MINUTE_HAND)
  const hourEnd = toCartesian(hour, R_HOUR_HAND)

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rim */}
      <circle cx={CX} cy={CY} r={R_CIRCLE} stroke={color} strokeWidth="1.5" />

      {/* Four cardinal ticks */}
      {CARDINAL_ANGLES.map((angle) => {
        const outer = toCartesian(angle, R_TICK_OUTER)
        const inner = toCartesian(angle, R_TICK_INNER)
        return (
          <line
            key={angle}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )
      })}

      {/* Minute hand (always at 12) */}
      <line
        x1={CX}
        y1={CY}
        x2={minuteEnd.x}
        y2={minuteEnd.y}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Hour hand (position varies by clock) */}
      <line
        x1={CX}
        y1={CY}
        x2={hourEnd.x}
        y2={hourEnd.y}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Center dot */}
      <circle cx={CX} cy={CY} r={R_CENTER_DOT} fill={color} />
    </svg>
  )
}
