import { STATUS, STATUS_LABEL } from '../types/task'

const FILTERS = [
  { value: 'all', label: 'すべて' },
  { value: STATUS.TODO, label: STATUS_LABEL[STATUS.TODO] },
  { value: STATUS.IN_PROGRESS, label: STATUS_LABEL[STATUS.IN_PROGRESS] },
  { value: STATUS.DONE, label: STATUS_LABEL[STATUS.DONE] },
]

export default function StatusFilter({ current, onChange }) {
  return (
    <div className="status-filter">
      {FILTERS.map(f => (
        <button
          key={f.value}
          className={`filter-btn ${current === f.value ? 'filter-btn--active' : ''}`}
          onClick={() => onChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}