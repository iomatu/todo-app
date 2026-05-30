const STORAGE_KEY = 'todo-app-tasks'
const CATEGORY_KEY = 'todo-app-categories'
const SETTINGS_KEY = 'todo-app-settings'
const NOTES_KEY = 'todo-app-notes'

export function loadTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('タスクの読み込みに失敗しました:', error)
    return []
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error('タスクの保存に失敗しました:', error)
  }
}

export function loadCategories() {
  try {
    const data = localStorage.getItem(CATEGORY_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('カテゴリの読み込みに失敗しました:', error)
    return []
  }
}

export function saveCategories(categories) {
  try {
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories))
  } catch (error) {
    console.error('カテゴリの保存に失敗しました:', error)
  }
}

export function loadSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY)
    return data ? JSON.parse(data) : { warningHours: 24 }
  } catch (error) {
    console.error('設定の読み込みに失敗しました:', error)
    return { warningHours: 24 }
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('設定の保存に失敗しました:', error)
  }
}

export function loadNotes() {
  try {
    const data = localStorage.getItem(NOTES_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('メモの読み込みに失敗しました:', error)
    return []
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
  } catch (error) {
    console.error('メモの保存に失敗しました:', error)
  }
}