import { useState, useEffect, useRef } from 'react'
import { loadNotes, saveNotes } from '../services/storage'

export function useNotes() {
  const [notes, setNotes] = useState(() => loadNotes())
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    saveNotes(notes)
  }, [notes])

  function addNote(note) {
    setNotes(prev => [note, ...prev])
  }

  function updateNote(id, changes) {
    setNotes(prev =>
      prev.map(n => n.id === id ? { ...n, ...changes, updatedAt: new Date().toISOString() } : n)
    )
  }

  function deleteNote(id) {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  return { notes, addNote, updateNote, deleteNote }
}