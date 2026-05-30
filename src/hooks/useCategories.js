import { useState, useEffect } from 'react'
import { loadCategories, createCategory, removeCategory } from '../services/storage'

export function useCategories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadCategories().then(data => setCategories(data))
  }, [])

  async function addCategory(name) {
    const trimmed = name.trim()
    if (!trimmed) return
    if (categories.some(c => c.name === trimmed)) return
    const newCategory = { id: crypto.randomUUID(), name: trimmed }
    setCategories(prev => [...prev, newCategory])
    await createCategory(newCategory)
  }

  async function deleteCategory(id) {
    setCategories(prev => prev.filter(c => c.id !== id))
    await removeCategory(id)
  }

  return { categories, addCategory, deleteCategory }
}