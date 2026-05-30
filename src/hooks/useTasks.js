import { useState, useEffect, useRef } from 'react'
import { loadTasks, saveTasks } from '../services/storage'

export function useTasks() {
  const [tasks, setTasks] = useState(() => loadTasks()) // ← ここで直接読み込む
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    saveTasks(tasks)
  }, [tasks])

  function addTask(task) {
    setTasks(prev => [...prev, task])
  }

  function updateTask(id, changes) {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, ...changes, updatedAt: new Date().toISOString() } : t)
    )
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return { tasks, addTask, updateTask, deleteTask }
}