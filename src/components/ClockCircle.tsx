type ClockType = 'annual' | 'trajectory' | 'generational'

export type ClockCircleProps = {
  clockType: ClockType
  visited: boolean
  size?: number
}

const clockConfig: Record<
  ClockType,
  { color: string; hourAngle: number; minuteAngle: number }
> = {
  annual: { color: '#1F4E79', hourAngle: 270, minuteAngle: 0 },
  trajectory: { color: '#C97D1A', hourAngle: 0, minuteAngle: 0 },
  generational: { color: '#0D6B5E', hourAngle: 150, minuteAngle: 0 },
}

const center = 16
const radius = 13.25
const tickInner = 1.75
const tickOuter = 3.75
const hourHandLength = radius * 0.35
const minuteHandLength = radius * 0.55
const tickAngles = [0, 90, 180, 270]

function polarToCartesian(angle: number, length: number) {
  const radians = ((angle - 90) * Math.PI) / 180

  return {
    x: center + Math.cos(radians) * length,
    y: center + Math.sin(radians) * length,
  }
}

export function ClockCircle({
  clockType,
  visited,
  size = 32,
}: ClockCircleProps) {
  const { color, hourAngle, minuteAngle } = clockConfig[clockType]
  const ringStroke = visited ? color : '#C8C5BC'
  const fill = visited ? color : 'transparent'
  const tickStroke = visited ? '#FFFFFF' : '#C8C5BC'
  const hourHandEnd = polarToCartesian(hourAngle, hourHandLength)
  const minuteHandEnd = polarToCartesian(minuteAngle, minuteHandLength)

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill={fill}
        stroke={ringStroke}
        strokeWidth="1.5"
      />

      {tickAngles.map((angle) => {
        const start = polarToCartesian(angle, radius - tickInner)
        const end = polarToCartesian(angle, radius - tickOuter)

        return (
          <line
            key={angle}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={tickStroke}
            strokeWidth="1"
            strokeLinecap="round"
          />
        )
      })}

      <g
        opacity={visited ? 1 : 0}
        style={{ transition: 'opacity 300ms ease' }}
      >
        <line
          x1={center}
          y1={center}
          x2={hourHandEnd.x}
          y2={hourHandEnd.y}
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1={center}
          y1={center}
          x2={minuteHandEnd.x}
          y2={minuteHandEnd.y}
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
