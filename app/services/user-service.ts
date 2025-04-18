'use client'

import { v4 as uuidv4 } from 'uuid'

/**
 * Gets or creates a unique user ID stored in localStorage
 * Creates a new UUID if one doesn't exist
 */
export function getUserId(): string {
  // Check if running in browser environment
  if (typeof window === 'undefined') {
    return 'server-side'
  }

  const storageKey = 'userId'
  let userId = localStorage.getItem(storageKey)

  // If no user ID exists, create one and store it
  if (!userId) {
    userId = uuidv4()
    localStorage.setItem(storageKey, userId)
  }

  return userId
} 