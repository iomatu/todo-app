import { useState, useEffect, useRef } from 'react'
import { loadCategories, saveCategories } from '../services/storage'

export function useCategories() {
  const [categories, setCategories] = useState(() => loadCategories())
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    saveCategories(categories)
  }, [categories])

  function addCategory(name) {
    const trimmed = name.trim()
    if (!trimmed) return
    if (categories.some(c => c.name === trimmed)) return // 重複チェック
    setCategories(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: trimmed }
    ])
  }

  function deleteCategory(id) {
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  return { categories, addCategory, deleteCategory }
}