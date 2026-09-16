// SVG icons for the Prologue (sunrise) and Epilogue (crescent moon) masthead stops.
// Both use viewBox="0 0 36 36". Display size is 30×30 in the masthead.

type JourneyIconProps = {
  type: 'prologue' | 'epilogue'
  color?: string
  size?: number
}

const STROKE_WIDTH = 1.6

export function JourneyIcon({ type, color = '#6B6A64', size = 30 }: JourneyIconProps) {
  if (type === 'prologue') {
    return (
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Horizon line */}
        <line
          x1="4" y1="22" x2="32" y2="22"
          stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round"
        />
        {/* Half-dome sun arc sitting on horizon */}
        <path
          d="M 9 22 A 9 9 0 0 1 27 22"
          stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" fill="none"
        />
        {/* Ray: straight up */}
        <line
          x1="18" y1="13" x2="18" y2="7"
          stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round"
        />
        {/* Ray: upper-left */}
        <line
          x1="11.5" y1="15.5" x2="7" y2="11"
          stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round"
        />
        {/* Ray: upper-right */}
        <line
          x1="24.5" y1="15.5" x2="29" y2="11"
          stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round"
        />
      </svg>
    )
  }

  // Epilogue: crescent moon.
  // Outer circle center (18,18) r=10; inner circle center (21,18) r=8.
  // They intersect at x≈25.5, y≈18±6.6.
  // Path: outer large-arc CCW, inner small-arc CW, closes the crescent.
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 25.5 11.4 A 10 10 0 1 0 25.5 24.6 A 8 8 0 0 1 25.5 11.4 Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
