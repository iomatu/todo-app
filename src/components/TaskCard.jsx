import { STATUS, STATUS_LABEL, PRIORITY_LABEL } from '../types/task'
import { getDeadlineStatus } from '../utils/deadline'

const PRIORITY_COLOR = {
    low: '#68d391',
    medium: '#f6ad55',
    high: '#fc8181',
}

const STATUS_NEXT = {
    [STATUS.TODO]: STATUS.IN_PROGRESS,
    [STATUS.IN_PROGRESS]: STATUS.DONE,
    [STATUS.DONE]: STATUS.TODO,
}

function formatDateTime(value) {
    if (!value) return null
    const d = new Date(value)
    const date = d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const time = d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    return `${date} ${time}`
}

export default function TaskCard({ task, onUpdate, onDelete, onEdit, categories, warningHours }) {
    const categoryName = categories.find(c => c.id === task.categoryId)?.name
    const deadlineStatus = getDeadlineStatus(task, warningHours)

    function handleStatusClick() {
        onUpdate(task.id, { status: STATUS_NEXT[task.status] })
    }

    return (
        <div className={[
            'task-card',
            `task-card--${task.status}`,
            deadlineStatus === 'overdue' ? 'task-card--overdue' : '',
            deadlineStatus === 'warning' ? 'task-card--warning' : '',
        ].join(' ')}>
            <div className="task-card-header">
                <div className="task-card-badges">
                    <span
                        className="priority-badge"
                        style={{ background: PRIORITY_COLOR[task.priority] }}
                    >
                        {PRIORITY_LABEL[task.priority]}
                    </span>
                    {categoryName && (
                        <span className="category-badge">📁 {categoryName}</span>
                    )}
                    {deadlineStatus === 'overdue' && (
                        <span className="deadline-badge deadline-badge--overdue">期限切れ</span>
                    )}
                    {deadlineStatus === 'warning' && (
                        <span className="deadline-badge deadline-badge--warning">期限間近</span>
                    )}
                </div>
                <div className="task-card-actions">
                    <button className="btn-edit tooltip" data-tip="編集" onClick={() => onEdit(task)}>✏️</button>
                    <button className="btn-delete tooltip" data-tip="削除" onClick={() => onDelete(task.id)}>✕</button>
                </div>
            </div>

            <div className="task-card-body">
                <p className="task-title">{task.title}</p>
                {task.description && (
                    <p className="task-description">{task.description}</p>
                )}
                {task.dueDate && (
                    <p className="task-due">📅 {formatDateTime(task.dueDate)}</p>
                )}
            </div>

            <div className="task-card-footer">
                <button
                    className={`btn-status btn-status--${task.status}`}
                    onClick={handleStatusClick}
                >
                    {STATUS_LABEL[task.status]}
                </button>
                <span className="status-hint">クリックで次のステータスへ</span>
            </div>
        </div>
    )
}