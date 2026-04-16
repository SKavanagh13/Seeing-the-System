export type ClockKey = 'annual' | 'trajectory' | 'generational'

export type ClockVisitedState = Record<ClockKey, boolean>

export const sequenceIndex: Record<string, number> = {
  '/': 0,
  '/annual-clock': 1,
  '/trajectory-clock': 2,
  '/generational-clock': 3,
  '/toolkit': 0,
  '/glossary': 0,
  '/epilogue': 99,
}

export const clockIndex: Record<ClockKey, number> = {
  annual: 1,
  trajectory: 2,
  generational: 3,
}

export function getSequencePageIndex(pathname: string): number {
  return sequenceIndex[pathname] ?? 0
}

export function getRouteDerivedClockState(pathname: string): ClockVisitedState {
  if (pathname === '/epilogue') {
    return {
      annual: true,
      trajectory: true,
      generational: true,
    }
  }

  const currentPageIndex = getSequencePageIndex(pathname)

  return {
    annual: currentPageIndex >= clockIndex.annual,
    trajectory: currentPageIndex >= clockIndex.trajectory,
    generational: currentPageIndex >= clockIndex.generational,
  }
}
