'use client'

import { useEffect } from 'react'

/**
 * Silent visitor tracking component.
 * Sends a POST request to /api/visit on mount to track unique visitors.
 * Completely invisible to users - no UI, no console output.
 */
export default function VisitorTracker() {
  useEffect(() => {
    // Fire-and-forget: don't await, don't block
    fetch('/api/visit', {
      method: 'POST',
      keepalive: true, // Ensures request completes even if user navigates away
      cache: 'no-store',
    }).catch(() => {
      // Silently ignore errors - tracking should never affect UX
    })
  }, [])

  // Render nothing - this component is purely for side effects
  return null
}
