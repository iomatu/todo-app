export default function CategoryTabs({ categories, current, onChange, onDelete }) {
  return (
    <div className="category-tabs">
      <button
        className={`category-tab ${current === 'all' ? 'category-tab--active' : ''}`}
        onClick={() => onChange('all')}
      >
        すべて
      </button>
      {categories.map(cat => (
        <div key={cat.id} className="category-tab-wrapper">
          <button
            className={`category-tab ${current === cat.id ? 'category-tab--active' : ''}`}
            onClick={() => onChange(cat.id)}
          >
            {cat.name}
          </button>
          <button
            className="category-tab-delete tooltip"
            data-tip="カテゴリを削除"
            onClick={() => onDelete(cat.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}