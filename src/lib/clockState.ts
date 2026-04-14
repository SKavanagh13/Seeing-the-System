export type ClockKey = 'annual' | 'trajectory' | 'generational'

export type ClockVisitedState = Record<ClockKey, boolean>

const STORAGE_KEY = 'seeing-the-system.clock-visited'
const listeners = new Set<() => void>()

export const defaultClockVisitedState: ClockVisitedState = {
  annual: false,
  trajectory: false,
  generational: false,
}

export function readClockVisitedState(): ClockVisitedState {
  if (typeof window === 'undefined') {
    return defaultClockVisitedState
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY)
  if (!rawValue) {
    return defaultClockVisitedState
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<ClockVisitedState>

    return {
      annual: Boolean(parsed.annual),
      trajectory: Boolean(parsed.trajectory),
      generational: Boolean(parsed.generational),
    }
  } catch {
    return defaultClockVisitedState
  }
}

export function writeClockVisitedState(state: ClockVisitedState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  listeners.forEach((listener) => listener())
}

export function getClockKeyForPath(pathname: string): ClockKey | null {
  if (pathname === '/annual-clock') {
    return 'annual'
  }

  if (pathname === '/trajectory-clock') {
    return 'trajectory'
  }

  if (pathname === '/generational-clock') {
    return 'generational'
  }

  return null
}

export function markClockVisited(clock: ClockKey) {
  const currentState = readClockVisitedState()
  if (currentState[clock]) {
    return
  }

  writeClockVisitedState({
    ...currentState,
    [clock]: true,
  })
}

export function subscribeToClockVisitedState(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}
