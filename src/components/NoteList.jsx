import NoteCard from './NoteCard'

export default function NoteList({ notes, onEdit, onDelete, categories }) {
  if (notes.length === 0) {
    return (
      <div className="task-list-empty">
        <p>メモがありません。追加してみましょう！</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          categories={categories}
        />
      ))}
    </div>
  )
}