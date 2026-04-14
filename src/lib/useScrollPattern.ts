import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useScrollPattern() {
  const location = useLocation()

  useEffect(() => {
    // Stub for the shared scroll pattern described in the spec.
    // Future PRs should extend this hook with the centralized route-aware
    // scroll behavior instead of scattering scroll logic across pages.
  }, [location.pathname])
}
