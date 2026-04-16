export type ClockKey = 'annual' | 'trajectory' | 'generational'

export type ClockVisitedState = Record<ClockKey, boolean>

const LEGACY_STORAGE_KEY = 'seeing-the-system.clock-visited'
const STORAGE_KEYS: Record<ClockKey, string> = {
  annual: 'clock-visited-annual',
  trajectory: 'clock-visited-trajectory',
  generational: 'clock-visited-generational',
}
const listeners = new Set<() => void>()

export const defaultClockVisitedState: ClockVisitedState = {
  annual: false,
  trajectory: false,
  generational: false,
}

let _cachedRaw: string | null = null
let _cachedState: ClockVisitedState = defaultClockVisitedState

export function readClockVisitedState(): ClockVisitedState {
  if (typeof window === 'undefined') {
    return defaultClockVisitedState
  }

  const rawValue = JSON.stringify({
    annual: window.localStorage.getItem(STORAGE_KEYS.annual),
    trajectory: window.localStorage.getItem(STORAGE_KEYS.trajectory),
    generational: window.localStorage.getItem(STORAGE_KEYS.generational),
  })

  if (rawValue === _cachedRaw) {
    return _cachedState
  }

  _cachedRaw = rawValue

  try {
    const parsed = JSON.parse(rawValue) as Record<ClockKey, string | null>
    _cachedState = {
      annual: parsed.annual === 'true',
      trajectory: parsed.trajectory === 'true',
      generational: parsed.generational === 'true',
    }

    if (Object.values(_cachedState).some(Boolean)) {
      return _cachedState
    }

    const legacyRawValue = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!legacyRawValue) {
      return _cachedState
    }

    const legacyParsed = JSON.parse(legacyRawValue) as Partial<ClockVisitedState>
    _cachedState = {
      annual: Boolean(legacyParsed.annual),
      trajectory: Boolean(legacyParsed.trajectory),
      generational: Boolean(legacyParsed.generational),
    }

    return _cachedState
  } catch {
    _cachedState = defaultClockVisitedState
    return _cachedState
  }
}

export function writeClockVisitedState(state: ClockVisitedState) {
  if (typeof window === 'undefined') {
    return
  }

  ;(Object.keys(STORAGE_KEYS) as ClockKey[]).forEach((clock) => {
    window.localStorage.setItem(STORAGE_KEYS[clock], String(state[clock]))
  })
  _cachedState = state
  _cachedRaw = JSON.stringify({
    annual: String(state.annual),
    trajectory: String(state.trajectory),
    generational: String(state.generational),
  })
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
