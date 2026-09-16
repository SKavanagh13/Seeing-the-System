// Persists visited journey stops to localStorage.

import { useState, useCallback } from 'react'

export type StopKey = 'prologue' | 'annual' | 'trajectory' | 'generational' | 'epilogue'

const STORAGE_KEY = 'three-clocks:visited'
const VALID_KEYS = new Set<string>(['prologue', 'annual', 'trajectory', 'generational', 'epilogue'])

function isValidStopKey(s: unknown): s is StopKey {
  return typeof s === 'string' && VALID_KEYS.has(s)
}

function loadVisitedOnce(): Set<StopKey> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as unknown[]
    return new Set(arr.filter(isValidStopKey))
  } catch {
    return new Set()
  }
}

function persistVisited(visited: Set<StopKey>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]))
  } catch {
    // localStorage unavailable; continue silently
  }
}

export function useVisitedChapters(): [Set<StopKey>, (stop: StopKey) => void] {
  const [visited, setVisited] = useState<Set<StopKey>>(loadVisitedOnce)

  const markVisited = useCallback((stop: StopKey) => {
    setVisited((prev) => {
      if (prev.has(stop)) return prev
      const next = new Set(prev)
      next.add(stop)
      persistVisited(next)
      return next
    })
  }, [])

  return [visited, markVisited]
}
