import { useEffect, useState } from 'react'

/** useState that survives reloads. Storage can throw (private mode, blocked
 *  site data), so every access is guarded and the app works without it. */
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable: keep in-memory value */
    }
  }, [key, value])

  return [value, setValue] as const
}
