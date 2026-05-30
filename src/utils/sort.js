const PRIORITY_ORDER = { high: 3, medium: 2, low: 1 }

export function sortTasks(tasks, sortKey) {
  const [field, direction] = sortKey.split('_')
  const asc = direction === 'asc'

  return [...tasks].sort((a, b) => {
    if (field === 'createdAt') {
      const diff = new Date(a.createdAt) - new Date(b.createdAt)
      return asc ? diff : -diff
    }

    if (field === 'dueDate') {
      // 期限なしは常に末尾
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      const diff = new Date(a.dueDate) - new Date(b.dueDate)
      return asc ? diff : -diff
    }

    if (field === 'priority') {
      const diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      return asc ? diff : -diff
    }

    return 0
  })
}