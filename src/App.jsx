import { useState } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import StatusFilter from './components/StatusFilter'
import CategoryTabs from './components/CategoryTabs'
import HeaderSettings from './components/HeaderSettings'
import SortSelect from './components/SortSelect'
import TabNav from './components/TabNav'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'
import { useTasks } from './hooks/useTasks'
import { useCategories } from './hooks/useCategories'
import { useSettings } from './hooks/useSettings'
import { useNotes } from './hooks/useNotes'
import { sortTasks } from './utils/sort'

function App() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks()
  const { categories, addCategory, deleteCategory } = useCategories()
  const { settings, updateSettings } = useSettings()
  const { notes, addNote, updateNote, deleteNote } = useNotes()
  const [editingTask, setEditingTask] = useState(null)
  const [editingNote, setEditingNote] = useState(null)
  const [page, setPage] = useState('tasks')

  const filter = settings.filter
  const activeCategory = settings.activeCategory
  const sortKey = settings.sortKey

  function handleDeleteCategory(id) {
    deleteCategory(id)
    if (activeCategory === id) updateSettings({ activeCategory: 'all' })
  }

  function getWarningHours(task) {
    return task.warningHours ?? settings.warningHours
  }

  const filteredTasks = sortTasks(
    tasks
      .filter(t => activeCategory === 'all' || t.categoryId === activeCategory)
      .filter(t => filter === 'all' || t.status === filter),
    sortKey
  )

  const remainingTasks = tasks.filter(t => t.status !== 'done').length

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-top">
          <div>
            <h1>ToDo アプリ</h1>
            <p className="task-count">
              {remainingTasks} 件残り ／ 全 {tasks.length} 件
            </p>
          </div>
          {page === 'tasks' && (
            <HeaderSettings
              warningHours={settings.warningHours}
              onChange={v => updateSettings({ warningHours: v })}
            />
          )}
        </div>
        <TabNav
          current={page}
          onChange={setPage}
          taskCount={remainingTasks}
          noteCount={notes.length}
        />
      </header>

      <main className="app-main">
        {page === 'tasks' && (
          <>
            <TaskForm
              onAdd={addTask}
              onUpdate={updateTask}
              editingTask={editingTask}
              onCancelEdit={() => setEditingTask(null)}
              categories={categories}
              onAddCategory={addCategory}
              defaultWarningHours={settings.warningHours}
            />
            <CategoryTabs
              categories={categories}
              current={activeCategory}
              onChange={v => updateSettings({ activeCategory: v })}
              onDelete={handleDeleteCategory}
            />
            <SortSelect
              value={sortKey}
              onChange={v => updateSettings({ sortKey: v })}
            />
            <StatusFilter
              current={filter}
              onChange={v => updateSettings({ filter: v })}
            />
            <TaskList
              tasks={filteredTasks}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onEdit={setEditingTask}
              categories={categories}
              getWarningHours={getWarningHours}
            />
          </>
        )}

        {page === 'notes' && (
          <>
            <NoteForm
              onAdd={addNote}
              onUpdate={updateNote}
              editingNote={editingNote}
              onCancelEdit={() => setEditingNote(null)}
              categories={categories}
              onAddCategory={addCategory}
            />
            <CategoryTabs
              categories={categories}
              current={settings.noteCategory ?? 'all'}
              onChange={v => updateSettings({ noteCategory: v })}
              onDelete={handleDeleteCategory}
            />
            <NoteList
              notes={notes.filter(n =>
                settings.noteCategory === 'all' || !settings.noteCategory
                  ? true
                  : n.categoryId === settings.noteCategory
              )}
              onEdit={setEditingNote}
              onDelete={deleteNote}
              categories={categories}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default App