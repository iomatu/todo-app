import { useState, useEffect } from 'react'
import { loadNotes, createNote, editNote, removeNote } from '../services/storage'

export function useNotes(userId) {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    if (!userId) { setNotes([]); return }
    loadNotes(userId).then(data => setNotes(data))
  }, [userId])

  async function addNote(note) {
    setNotes(prev => [note, ...prev])
    await createNote(note, userId)
  }

  async function updateNote(id, changes) {
    const updatedAt = new Date().toISOString()
    setNotes(prev =>
      prev.map(n => n.id === id ? { ...n, ...changes, updatedAt } : n)
    )
    await editNote(id, { ...changes, updatedAt })
  }

  async function deleteNote(id) {
    setNotes(prev => prev.filter(n => n.id !== id))
    await removeNote(id)
  }

  return { notes, addNote, updateNote, deleteNote }
}