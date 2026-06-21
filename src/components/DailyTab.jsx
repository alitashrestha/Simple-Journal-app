import { useState } from 'react'
import {
  getTodayTodos, setTodayTodos,
  getTodayMood, setTodayMood,
  getAllGoals,
} from '../store'

const MOODS = [
  { value: 1, emoji: '😔', label: 'Low' },
  { value: 2, emoji: '😐', label: 'Okay' },
  { value: 3, emoji: '🙂', label: 'Good' },
  { value: 4, emoji: '😄', label: 'Great' },
  { value: 5, emoji: '🤩', label: 'Amazing' },
]

const ENERGY = [
  { value: 1, emoji: '🪫', label: 'Drained' },
  { value: 2, emoji: '😴', label: 'Tired' },
  { value: 3, emoji: '⚡', label: 'Okay' },
  { value: 4, emoji: '🔥', label: 'Energized' },
  { value: 5, emoji: '💥', label: 'Supercharged' },
]

export default function DailyTab({ data, update }) {
  const todos = getTodayTodos(data)
  const mood = getTodayMood(data)
  const goals = getAllGoals(data)
  const [newTodo, setNewTodo] = useState('')
  const [linkingId, setLinkingId] = useState(null)

  const completedCount = todos.filter(t => t.done).length

  const addTodo = (e) => {
    e.preventDefault()
    const text = newTodo.trim()
    if (!text) return
    const todo = { id: crypto.randomUUID(), text, done: false, goalId: null }
    update(d => setTodayTodos(d, [...getTodayTodos(d), todo]))
    setNewTodo('')
  }

  const toggleTodo = (id) => {
    update(d => {
      const current = getTodayTodos(d)
      const updated = current.map(t => t.id === id ? { ...t, done: !t.done } : t)
      return setTodayTodos(d, updated)
    })
  }

  const deleteTodo = (id) => {
    update(d => setTodayTodos(d, getTodayTodos(d).filter(t => t.id !== id)))
  }

  const linkGoal = (todoId, goalId) => {
    update(d => {
      const current = getTodayTodos(d)
      const updated = current.map(t => t.id === todoId ? { ...t, goalId: goalId || null } : t)
      return setTodayTodos(d, updated)
    })
    setLinkingId(null)
  }

  const setMoodValue = (field, value) => {
    update(d => setTodayMood(d, { ...getTodayMood(d), [field]: value }))
  }

  const clearCompleted = () => {
    update(d => setTodayTodos(d, getTodayTodos(d).filter(t => !t.done)))
  }

  return (
    <div className="space-y-5">
      {/* Mood & Energy */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">How are you feeling?</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-400 mb-2">Mood</p>
            <div className="flex gap-2 justify-between">
              {MOODS.map(m => (
                <button
                  key={m.value}
                  onClick={() => setMoodValue('mood', m.value)}
                  title={m.label}
                  className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all text-xl ${
                    mood.mood === m.value
                      ? 'bg-gray-900 scale-105 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100 active:scale-95'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span className={`text-xs mt-1 font-medium ${mood.mood === m.value ? 'text-white' : 'text-gray-400'}`}>
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Energy</p>
            <div className="flex gap-2 justify-between">
              {ENERGY.map(e => (
                <button
                  key={e.value}
                  onClick={() => setMoodValue('energy', e.value)}
                  title={e.label}
                  className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all text-xl ${
                    mood.energy === e.value
                      ? 'bg-gray-900 scale-105 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100 active:scale-95'
                  }`}
                >
                  <span>{e.emoji}</span>
                  <span className={`text-xs mt-1 font-medium ${mood.energy === e.value ? 'text-white' : 'text-gray-400'}`}>
                    {e.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Todos */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Today's Todos</h2>
            {todos.length > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">{completedCount} of {todos.length} done</p>
            )}
          </div>
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear done
            </button>
          )}
        </div>

        {/* Progress bar */}
        {todos.length > 0 && (
          <div className="px-4 mb-3">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 rounded-full transition-all duration-500"
                style={{ width: `${todos.length ? (completedCount / todos.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Todo list */}
        <ul className="divide-y divide-gray-50">
          {todos.length === 0 && (
            <li className="px-4 py-6 text-center text-gray-400 text-sm">
              No todos yet — add one below!
            </li>
          )}
          {todos.map(todo => {
            const linkedGoal = goals.find(g => g.id === todo.goalId)
            return (
              <li key={todo.id} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      todo.done
                        ? 'bg-gray-900 border-gray-900'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {todo.done && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-relaxed ${todo.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {todo.text}
                    </p>
                    {linkedGoal && (
                      <span className="inline-flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                        {linkedGoal.type === 'weekly' ? 'Week' : 'Month'}: {linkedGoal.text}
                      </span>
                    )}
                    {/* Goal link selector */}
                    {linkingId === todo.id && goals.length > 0 && (
                      <div className="mt-2 bg-gray-50 rounded-xl p-2 space-y-1">
                        <button
                          onClick={() => linkGoal(todo.id, null)}
                          className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-white transition-colors text-gray-400"
                        >
                          No goal link
                        </button>
                        {goals.map(g => (
                          <button
                            key={g.id}
                            onClick={() => linkGoal(todo.id, g.id)}
                            className={`w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-white transition-colors ${
                              todo.goalId === g.id ? 'text-gray-900 font-medium bg-white' : 'text-gray-600'
                            }`}
                          >
                            <span className="text-gray-400 text-xs mr-1">{g.type === 'weekly' ? 'W' : 'M'}</span>
                            {g.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {goals.length > 0 && (
                      <button
                        onClick={() => setLinkingId(linkingId === todo.id ? null : todo.id)}
                        title="Link to goal"
                        className={`p-1.5 rounded-lg transition-colors ${
                          todo.goalId ? 'text-blue-400' : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1.5 text-gray-200 hover:text-red-400 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Add todo input */}
        <form onSubmit={addTodo} className="px-4 py-3 border-t border-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              placeholder="Add a todo..."
              className="flex-1 text-sm bg-gray-50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-300 text-gray-800"
            />
            <button
              type="submit"
              disabled={!newTodo.trim()}
              className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 active:scale-95 transition-all flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
