import TaskCard from './TaskCard'

export default function TaskList({ tasks, onUpdate, onDelete, onEdit, categories, getWarningHours }) {
  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>タスクがありません。追加してみましょう！</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onEdit={onEdit}
          categories={categories}
          warningHours={getWarningHours(task)}
        />
      ))}
    </div>
  )
}