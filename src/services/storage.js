import { supabase } from './supabase'

const LOCAL_SETTINGS_KEY = 'todo-app-settings'

// タスク
export async function loadTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) { console.error('タスクの読み込みに失敗しました:', error); return [] }
  return data.map(t => ({
    id: t.id,
    title: t.title,
    description: t.description || '',
    status: t.status,
    priority: t.priority,
    dueDate: t.due_date,
    warningHours: t.warning_hours,
    categoryId: t.category_id,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  }))
}

export async function createTask(task) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.dueDate,
      warning_hours: task.warningHours,
      category_id: task.categoryId,
      created_at: task.createdAt,
      updated_at: task.updatedAt,
    })
    .select()
    .single()
  if (error) console.error('タスクの作成に失敗しました:', error)
  return data
}

export async function editTask(id, changes) {
  const { error } = await supabase
    .from('tasks')
    .update({
      title: changes.title,
      description: changes.description,
      status: changes.status,
      priority: changes.priority,
      due_date: changes.dueDate,
      warning_hours: changes.warningHours,
      category_id: changes.categoryId,
      updated_at: changes.updatedAt,
    })
    .eq('id', id)
  if (error) console.error('タスクの更新に失敗しました:', error)
}

export async function removeTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) console.error('タスクの削除に失敗しました:', error)
}

// カテゴリ
export async function loadCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) { console.error('カテゴリの読み込みに失敗しました:', error); return [] }
  return data.map(c => ({ id: c.id, name: c.name }))
}

export async function createCategory(category) {
  const { data, error } = await supabase
    .from('categories')
    .insert({ id: category.id, name: category.name })
    .select()
    .single()
  if (error) console.error('カテゴリの作成に失敗しました:', error)
  return data
}

export async function removeCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) console.error('カテゴリの削除に失敗しました:', error)
}

// メモ
export async function loadNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error('メモの読み込みに失敗しました:', error); return [] }
  return data.map(n => ({
    id: n.id,
    title: n.title || '',
    body: n.body,
    categoryId: n.category_id,
    createdAt: n.created_at,
    updatedAt: n.updated_at,
  }))
}

export async function createNote(note) {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      id: note.id,
      title: note.title,
      body: note.body,
      category_id: note.categoryId,
      created_at: note.createdAt,
      updated_at: note.updatedAt,
    })
    .select()
    .single()
  if (error) console.error('メモの作成に失敗しました:', error)
  return data
}

export async function editNote(id, changes) {
  const { error } = await supabase
    .from('notes')
    .update({
      title: changes.title,
      body: changes.body,
      category_id: changes.categoryId,
      updated_at: changes.updatedAt,
    })
    .eq('id', id)
  if (error) console.error('メモの更新に失敗しました:', error)
}

export async function removeNote(id) {
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) console.error('メモの削除に失敗しました:', error)
}

// 設定（設定だけlocalStorageに保存）
export function loadSettings() {
  try {
    const data = localStorage.getItem(LOCAL_SETTINGS_KEY)
    return data ? JSON.parse(data) : {
      warningHours: 24,
      sortKey: 'createdAt_desc',
      filter: 'all',
      activeCategory: 'all',
      noteCategory: 'all',
    }
  } catch (error) {
    console.error('設定の読み込みに失敗しました:', error)
    return { warningHours: 24, sortKey: 'createdAt_desc', filter: 'all', activeCategory: 'all', noteCategory: 'all' }
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('設定の保存に失敗しました:', error)
  }
}