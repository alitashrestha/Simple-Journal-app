import { useState } from 'react'
import { updateGoalProgress, deleteGoal } from '../store'

export default function GoalCard({ goal, goalType, update, linkedCount }) {
  const [adjusting, setAdjusting] = useState(false)
  const percent = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0
  const done = goal.current >= goal.target

  const adjust = (delta) => {
    update(d => updateGoalProgress(d, goalType, goal.id, goal.current + delta))
  }

  const remove = () => {
    if (window.confirm(`Delete goal "${goal.text}"?`)) {
      update(d => deleteGoal(d, goalType, goal.id))
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all ${done ? 'ring-1 ring-gray-200' : ''}`}>
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              done ? 'bg-gray-900 border-gray-900' : 'border-gray-300'
            }`}>
              {done && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium leading-snug ${done ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                {goal.text}
              </p>
              {linkedCount > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {linkedCount} linked todo{linkedCount !== 1 ? 's' : ''} today
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setAdjusting(!adjusting)}
              className="text-xs px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors font-medium"
            >
              {goal.current}/{goal.target}
            </button>
            <button
              onClick={remove}
              className="p-1.5 text-gray-200 hover:text-red-400 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-gray-900' : 'bg-gray-400'}`}
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{percent}% complete</p>
        </div>
      </div>

      {/* Adjust progress */}
      {adjusting && (
        <div className="border-t border-gray-50 px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium">Update progress</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => adjust(-1)}
              disabled={goal.current <= 0}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg font-medium"
            >
              −
            </button>
            <span className="text-sm font-semibold text-gray-800 w-8 text-center">{goal.current}</span>
            <button
              onClick={() => adjust(1)}
              disabled={goal.current >= goal.target}
              className="w-8 h-8 flex items-center justify-center bg-gray-900 hover:bg-gray-700 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg font-medium"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
