import { useState, useEffect, useRef } from 'react'

export default function NoteForm({ onAdd, onUpdate, editingNote, onCancelEdit, categories, onAddCategory }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)
  const formRef = useRef(null)

  const isEditing = !!editingNote

  useEffect(() => {
    if (editingNote) {
      setIsOpen(true)
      setTitle(editingNote.title || '')
      setBody(editingNote.body || '')
      setCategoryId(editingNote.categoryId || '')
    }
  }, [editingNote])

  useEffect(() => {
    if (isOpen && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [isOpen, editingNote])

  function handleCancel() {
    setIsOpen(false)
    setTitle('')
    setBody('')
    setCategoryId('')
    setShowNewCategory(false)
    setNewCategoryName('')
    onCancelEdit()
  }

  function handleAddCategory() {
    if (!newCategoryName.trim()) return
    onAddCategory(newCategoryName)
    setNewCategoryName('')
    setShowNewCategory(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!body.trim()) return

    const noteData = {
      title: title.trim(),
      body: body.trim(),
      categoryId: categoryId || null,
    }

    if (isEditing) {
      onUpdate(editingNote.id, noteData)
    } else {
      onAdd({
        ...noteData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
    handleCancel()
  }

  return (
    <div className="task-form-wrapper" ref={formRef}>
      {!isOpen ? (
        <button className="btn-open-form" onClick={() => setIsOpen(true)}>
          ＋ メモを追加
        </button>
      ) : (
        <>
          <h2>{isEditing ? 'メモを編集' : 'メモを追加'}</h2>
          <form className="task-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="note-title">タイトル（任意）</label>
              <input
                id="note-title"
                type="text"
                placeholder="例：Slackのメッセージ、参考URL など"
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="note-body">
                内容 <span className="required">*</span>
                <span className="form-hint">URLは自動でリンクになります</span>
              </label>
              <textarea
                id="note-body"
                placeholder={'テキストやURLをそのまま貼り付けてください\n例：https://example.com'}
                rows={6}
                value={body}
                onChange={e => setBody(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="note-category">カテゴリ</label>
              <div className="category-select-row">
                <select
                  id="note-category"
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                >
                  <option value="">なし</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn-new-category"
                  onClick={() => setShowNewCategory(v => !v)}
                >
                  ＋ 新規作成
                </button>
              </div>
              {showNewCategory && (
                <div className="new-category-row">
                  <input
                    type="text"
                    placeholder="カテゴリ名を入力..."
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                  />
                  <button type="button" className="btn-primary" onClick={handleAddCategory}>
                    追加
                  </button>
                </div>
              )}
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-primary">
                {isEditing ? '✓ 保存する' : '＋ メモを追加'}
              </button>
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                キャンセル
              </button>
            </div>

          </form>
        </>
      )}
    </div>
  )
}