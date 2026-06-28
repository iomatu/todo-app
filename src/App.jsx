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
import LoginForm from './components/LoginForm'
import { useTasks } from './hooks/useTasks'
import { useCategories } from './hooks/useCategories'
import { useSettings } from './hooks/useSettings'
import { useNotes } from './hooks/useNotes'
import { useAuth } from './hooks/useAuth'
import { signOut } from './services/auth'
import { sortTasks } from './utils/sort'
import AccountSettings from './components/AccountSettings'

function App() {
  const { user, username, loading: authLoading } = useAuth()
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks(user?.id)
  const { categories, addCategory, deleteCategory } = useCategories(user?.id)
  const { settings, updateSettings } = useSettings()
  const { notes, addNote, updateNote, deleteNote } = useNotes(user?.id)
  const [editingTask, setEditingTask] = useState(null)
  const [editingNote, setEditingNote] = useState(null)
  const [page, setPage] = useState('tasks')
  const [showAccountSettings, setShowAccountSettings] = useState(false)

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

  if (authLoading) {
    return <div className="login-wrapper"><div className="loading">読み込み中...</div></div>
  }

  if (!user) {
    return <LoginForm onLogin={() => { }} />
  }

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
          <div className="header-controls">
            {page === 'tasks' && (
              <HeaderSettings
                warningHours={settings.warningHours}
                onChange={v => updateSettings({ warningHours: v })}
              />
            )}
            <div className="user-menu">
              <button
                className="username-display"
                onClick={() => setShowAccountSettings(true)}
              >
                👤 {username}
              </button>
              <button className="btn-signout" onClick={signOut}>ログアウト</button>
            </div>
            {showAccountSettings && (
              <AccountSettings
                username={username}
                onClose={() => setShowAccountSettings(false)}
              />
            )}
          </div>
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
          loading ? (
            <div className="loading">読み込み中...</div>
          ) : (
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
          )
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