const SORT_OPTIONS = [
  { value: 'createdAt', label: '作成日' },
  { value: 'dueDate', label: '期限' },
  { value: 'priority', label: '優先度' },
]

export default function SortSelect({ value, onChange }) {
  const [field, direction] = value.split('_')

  function handleFieldChange(newField) {
    onChange(`${newField}_${direction}`)
  }

  function toggleDirection() {
    onChange(`${field}_${direction === 'asc' ? 'desc' : 'asc'}`)
  }

  return (
    <div className="sort-bar">
      <span className="sort-label">↕️ 並び替え</span>
      <div className="sort-options">
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`sort-btn ${field === opt.value ? 'sort-btn--active' : ''}`}
            onClick={() => handleFieldChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        className="sort-direction tooltip"
        data-tip={direction === 'asc' ? '昇順' : '降順'}
        onClick={toggleDirection}
      >
        {direction === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  )
}