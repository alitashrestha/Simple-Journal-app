const STORAGE_KEY = 'journal-app-data'

const today = () => new Date().toISOString().slice(0, 10)

const currentWeekKey = () => {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  return monday.toISOString().slice(0, 10)
}

const currentMonthKey = () => new Date().toISOString().slice(0, 7)

const defaultData = () => ({
  todos: {},
  moods: {},
  weeklyGoals: [],
  monthlyGoals: [],
  lastResetDate: today(),
})

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData()
    return JSON.parse(raw)
  } catch {
    return defaultData()
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getTodayTodos(data) {
  const key = today()
  return data.todos[key] || []
}

export function setTodayTodos(data, todos) {
  return { ...data, todos: { ...data.todos, [today()]: todos } }
}

export function getTodayMood(data) {
  return data.moods[today()] || { mood: null, energy: null }
}

export function setTodayMood(data, mood) {
  return { ...data, moods: { ...data.moods, [today()]: mood } }
}

export function getWeeklyGoals(data) {
  const week = currentWeekKey()
  return (data.weeklyGoals || []).filter(g => g.weekKey === week)
}

export function getMonthlyGoals(data) {
  const month = currentMonthKey()
  return (data.monthlyGoals || []).filter(g => g.monthKey === month)
}

export function addWeeklyGoal(data, text, target) {
  const goal = {
    id: crypto.randomUUID(),
    text,
    target: Number(target) || 1,
    current: 0,
    weekKey: currentWeekKey(),
    linkedTodos: [],
  }
  return { ...data, weeklyGoals: [...(data.weeklyGoals || []), goal] }
}

export function addMonthlyGoal(data, text, target) {
  const goal = {
    id: crypto.randomUUID(),
    text,
    target: Number(target) || 1,
    current: 0,
    monthKey: currentMonthKey(),
    linkedTodos: [],
  }
  return { ...data, monthlyGoals: [...(data.monthlyGoals || []), goal] }
}

export function updateGoalProgress(data, goalType, goalId, current) {
  const field = goalType === 'weekly' ? 'weeklyGoals' : 'monthlyGoals'
  return {
    ...data,
    [field]: data[field].map(g => g.id === goalId ? { ...g, current: Math.max(0, Math.min(current, g.target)) } : g),
  }
}

export function deleteGoal(data, goalType, goalId) {
  const field = goalType === 'weekly' ? 'weeklyGoals' : 'monthlyGoals'
  const updated = data[field].filter(g => g.id !== goalId)
  // Remove goal links from todos
  const todos = { ...data.todos }
  for (const key of Object.keys(todos)) {
    todos[key] = todos[key].map(t => t.goalId === goalId ? { ...t, goalId: null } : t)
  }
  return { ...data, [field]: updated, todos }
}

export function getAllGoals(data) {
  const week = currentWeekKey()
  const month = currentMonthKey()
  return [
    ...(data.weeklyGoals || []).filter(g => g.weekKey === week).map(g => ({ ...g, type: 'weekly' })),
    ...(data.monthlyGoals || []).filter(g => g.monthKey === month).map(g => ({ ...g, type: 'monthly' })),
  ]
}

export { today, currentWeekKey, currentMonthKey }
