// 期限の状態を返す
// 'overdue'  : 期限切れ
// 'warning'  : 期限が近い
// 'normal'   : 通常
// null       : 期限なし・完了済み
export function getDeadlineStatus(task, warningHours) {
  if (!task.dueDate || task.status === 'done') return null

  const now = new Date()
  const due = new Date(task.dueDate)
  const diffHours = (due - now) / (1000 * 60 * 60)

  if (diffHours < 0) return 'overdue'
  if (diffHours <= warningHours) return 'warning'
  return 'normal'
}