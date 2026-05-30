import { useState, useEffect, useRef } from 'react'
import { loadSettings, saveSettings } from '../services/storage'

export function useSettings() {
  const [settings, setSettings] = useState(() => ({
    warningHours: 24,
    sortKey: 'createdAt_desc',
    filter: 'all',
    activeCategory: 'all',
    ...loadSettings(),
  }))

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    saveSettings(settings)
  }, [settings])

  function updateSettings(changes) {
    setSettings(prev => ({ ...prev, ...changes }))
  }

  return { settings, updateSettings }
}