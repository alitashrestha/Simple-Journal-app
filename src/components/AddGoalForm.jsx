import { useState } from 'react'

export default function AddGoalForm({ onAdd, placeholder = 'New goal...' }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [target, setTarget] = useState('1')

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text.trim(), parseInt(target, 10) || 1)
    setText('')
    setTarget('1')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-sm text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add a goal
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">New Goal</p>
      <input
        autoFocus
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm bg-gray-50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-300 text-gray-800"
      />
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">Target (times to complete)</label>
          <input
            type="number"
            min="1"
            max="365"
            value={target}
            onChange={e => setTarget(e.target.value)}
            className="w-full text-sm bg-gray-50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-gray-200 text-gray-800"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 py-2.5 text-sm text-gray-400 hover:text-gray-600 rounded-xl bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex-1 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl disabled:opacity-30 hover:bg-gray-700 transition-colors"
        >
          Add Goal
        </button>
      </div>
    </form>
  )
}
