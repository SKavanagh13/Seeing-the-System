type ClockType = 'annual' | 'trajectory' | 'generational'

export type ClockFaceProps = {
  clockType: ClockType
  filled: boolean
  size?: number
}

const clockConfig: Record<
  ClockType,
  { color: string; hourAngle: number; minuteAngle: number }
> = {
  annual: { color: '#1F4E79', hourAngle: 270, minuteAngle: 0 },
  trajectory: {
    color: '#C97D1A',
    hourAngle: 0,
    minuteAngle: 0,
  },
  generational: {
    color: '#0D6B5E',
    hourAngle: 150,
    minuteAngle: 0,
  },
}

const center = 24
const radius = 22
const faceRadius = 21
const tickOuterRadius = 18.5
const hourHandLength = radius * 0.3
const minuteHandLength = radius * 0.55
const tickAngles = Array.from({ length: 12 }, (_, index) => index * 30)
const inactiveColor = '#C8C5BC'

function polarToCartesian(angle: number, length: number) {
  const radians = ((angle - 90) * Math.PI) / 180

  return {
    x: center + Math.cos(radians) * length,
    y: center + Math.sin(radians) * length,
  }
}

function ClockStrokeLayer({
  color,
  hourAngle,
  minuteAngle,
}: {
  color: string
  hourAngle: number
  minuteAngle: number
}) {
  const hourHandEnd = polarToCartesian(hourAngle, hourHandLength)
  const minuteHandEnd = polarToCartesian(minuteAngle, minuteHandLength)

  return (
    <>
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />

      {tickAngles.map((angle) => {
        const isMajorTick = angle % 90 === 0
        const tickLength = isMajorTick ? 4 : 2
        const start = polarToCartesian(angle, tickOuterRadius - tickLength)
        const end = polarToCartesian(angle, tickOuterRadius)

        return (
          <line
            key={angle}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )
      })}

      <line
        x1={center}
        y1={center}
        x2={hourHandEnd.x}
        y2={hourHandEnd.y}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1={center}
        y1={center}
        x2={minuteHandEnd.x}
        y2={minuteHandEnd.y}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx={center} cy={center} r="2" fill={color} />
    </>
  )
}

export function ClockFace({
  clockType,
  filled,
  size = 48,
}: ClockFaceProps) {
  const { color, hourAngle, minuteAngle } = clockConfig[clockType]

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx={center} cy={center} r={faceRadius} fill="#FFFFFF" />
      <ClockStrokeLayer
        color={inactiveColor}
        hourAngle={hourAngle}
        minuteAngle={minuteAngle}
      />
      <g opacity={filled ? 1 : 0} style={{ transition: 'opacity 300ms ease' }}>
        <ClockStrokeLayer
          color={color}
          hourAngle={hourAngle}
          minuteAngle={minuteAngle}
        />
      </g>
    </svg>
  )
}
