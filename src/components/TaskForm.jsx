import { useState, useEffect, useRef } from 'react'
import { PRIORITY, PRIORITY_LABEL, STATUS } from '../types/task'

export default function TaskForm({ onAdd, onUpdate, editingTask, onCancelEdit, categories, onAddCategory, defaultWarningHours }) {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [priority, setPriority] = useState(PRIORITY.MEDIUM)
    const [categoryId, setCategoryId] = useState('')
    const [warningHours, setWarningHours] = useState('')
    const [warningUnit, setWarningUnit] = useState('hours')
    const [newCategoryName, setNewCategoryName] = useState('')
    const [showNewCategory, setShowNewCategory] = useState(false)

    const isEditing = !!editingTask
    const formRef = useRef(null)

    useEffect(() => {
        if (editingTask) {
            setIsOpen(true)
            setTitle(editingTask.title)
            setDescription(editingTask.description || '')
            setDueDate(editingTask.dueDate ? editingTask.dueDate.slice(0, 16) : '')
            setPriority(editingTask.priority)
            setCategoryId(editingTask.categoryId || '')
            setWarningHours(editingTask.warningHours ?? '')
            setWarningUnit(
                editingTask.warningHours && editingTask.warningHours % 24 === 0 ? 'days' : 'hours'
            )
        }
    }, [editingTask])

    useEffect(() => {
        if (isOpen && formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [isOpen, editingTask])

    function handleCancel() {
        setIsOpen(false)
        setTitle('')
        setDescription('')
        setDueDate('')
        setPriority(PRIORITY.MEDIUM)
        setCategoryId('')
        setWarningHours('')
        setWarningUnit('hours')
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
        if (!title.trim()) return

        const taskData = {
            title: title.trim(),
            description: description.trim(),
            dueDate: dueDate || null,
            priority,
            categoryId: categoryId || null,
            warningHours: warningHours !== '' ? Number(warningHours) : null,
        }

        if (isEditing) {
            onUpdate(editingTask.id, taskData)
        } else {
            onAdd({
                ...taskData,
                id: crypto.randomUUID(),
                status: STATUS.TODO,
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
                    ＋ タスクを追加
                </button>
            ) : (
                <>
                    <h2>{isEditing ? 'タスクを編集' : 'タスクを追加'}</h2>
                    <form className="task-form" onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="title">タイトル <span className="required">*</span></label>
                            <input
                                id="title"
                                type="text"
                                placeholder="例：資料を作成する"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">説明（任意）</label>
                            <textarea
                                id="description"
                                placeholder="詳細メモを入力..."
                                rows={3}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="dueDate">期限日時</label>
                                <input
                                    id="dueDate"
                                    type="datetime-local"
                                    value={dueDate}
                                    onChange={e => setDueDate(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="priority">優先度</label>
                                <select
                                    id="priority"
                                    value={priority}
                                    onChange={e => setPriority(e.target.value)}
                                >
                                    {Object.entries(PRIORITY_LABEL).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>
                                期限の警告タイミング
                                <span className="form-hint">空欄の場合はデフォルト値（{defaultWarningHours}時間前）を使用</span>
                            </label>
                            <div className="warning-input-row">
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="空欄=デフォルト"
                                    value={
                                        warningHours === ''
                                            ? ''
                                            : warningUnit === 'days'
                                                ? Math.round(warningHours / 24)
                                                : warningHours
                                    }
                                    onChange={e => {
                                        const v = e.target.value
                                        if (v === '') { setWarningHours(''); return }
                                        setWarningHours(warningUnit === 'days' ? Number(v) * 24 : Number(v))
                                    }}
                                />
                                <select
                                    value={warningUnit}
                                    onChange={e => setWarningUnit(e.target.value)}
                                >
                                    <option value="hours">時間前</option>
                                    <option value="days">日前</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">カテゴリ</label>
                            <div className="category-select-row">
                                <select
                                    id="category"
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
                                {isEditing ? '✓ 保存する' : '＋ タスクを追加'}
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