function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  return parts.map((part, i) =>
    urlRegex.test(part)
      ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="note-link">{part}</a>
      : part
  )
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

export default function NoteCard({ note, onEdit, onDelete, categories }) {
  const categoryName = categories.find(c => c.id === note.categoryId)?.name

  return (
    <div className="note-card">
      <div className="note-card-header">
        <div className="task-card-badges">
          {note.title && <p className="note-title">{note.title}</p>}
          {categoryName && (
            <span className="category-badge">📁 {categoryName}</span>
          )}
        </div>
        <div className="task-card-actions">
          <button className="btn-edit tooltip" data-tip="編集" onClick={() => onEdit(note)}>✏️</button>
          <button className="btn-delete tooltip" data-tip="削除" onClick={() => onDelete(note.id)}>✕</button>
        </div>
      </div>
      <p className="note-body">{linkify(note.body)}</p>
      <p className="note-date">{formatDate(note.createdAt)}</p>
    </div>
  )
}