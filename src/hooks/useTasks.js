import { useState, useEffect } from 'react'
import { loadTasks, createTask, editTask, removeTask } from '../services/storage'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks().then(data => {
      setTasks(data)
      setLoading(false)
    })
  }, [])

  async function addTask(task) {
    setTasks(prev => [task, ...prev])
    await createTask(task)
  }

  async function updateTask(id, changes) {
    const updatedAt = new Date().toISOString()
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, ...changes, updatedAt } : t)
    )
    await editTask(id, { ...changes, updatedAt })
  }

  async function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
    await removeTask(id)
  }

  return { tasks, loading, addTask, updateTask, deleteTask }
}