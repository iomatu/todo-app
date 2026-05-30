export default function TabNav({ current, onChange, taskCount, noteCount }) {
  return (
    <nav className="tab-nav">
      <button
        className={`tab-nav-btn ${current === 'tasks' ? 'tab-nav-btn--active' : ''}`}
        onClick={() => onChange('tasks')}
      >
        タスク
        {taskCount > 0 && <span className="tab-badge">{taskCount}</span>}
      </button>
      <button
        className={`tab-nav-btn ${current === 'notes' ? 'tab-nav-btn--active' : ''}`}
        onClick={() => onChange('notes')}
      >
        メモ
        {noteCount > 0 && <span className="tab-badge">{noteCount}</span>}
      </button>
    </nav>
  )
}