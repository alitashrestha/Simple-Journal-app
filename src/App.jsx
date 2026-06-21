import { useState, useCallback } from 'react'
import DailyTab from './components/DailyTab'
import WeeklyGoalsTab from './components/WeeklyGoalsTab'
import MonthlyGoalsTab from './components/MonthlyGoalsTab'
import { loadData, saveData } from './store'

const TABS = [
  { id: 'daily', label: 'Today' },
  { id: 'weekly', label: 'Week' },
  { id: 'monthly', label: 'Month' },
]

export default function App() {
  const [tab, setTab] = useState('daily')
  const [data, setData] = useState(() => loadData())

  const update = useCallback((updater) => {
    setData(prev => {
      const next = updater(prev)
      saveData(next)
      return next
    })
  }, [])

  const dateDisplay = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col min-h-svh bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-100 px-5 sticky top-0 z-10">
        <div className="max-w-lg mx-auto">
          <div className="pt-4 pb-2">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{dateDisplay}</p>
            <h1 className="text-2xl font-semibold text-gray-900 mt-0.5">Daily Journal</h1>
          </div>
          <div className="flex">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-2.5 text-sm font-medium transition-all border-b-2 ${
                  tab === t.id
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-lg mx-auto px-4 py-5 pb-10">
          {tab === 'daily' && <DailyTab data={data} update={update} />}
          {tab === 'weekly' && <WeeklyGoalsTab data={data} update={update} />}
          {tab === 'monthly' && <MonthlyGoalsTab data={data} update={update} />}
        </div>
      </main>
    </div>
  )
}
