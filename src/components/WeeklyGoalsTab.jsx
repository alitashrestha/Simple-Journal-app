import { getWeeklyGoals, addWeeklyGoal, getTodayTodos, currentWeekKey } from '../store'
import GoalCard from './GoalCard'
import AddGoalForm from './AddGoalForm'

function getWeekRange() {
  const d = new Date()
  const day = d.getDay()
  const diffToMon = d.getDate() - day + (day === 0 ? -6 : 1)
  const mon = new Date(d)
  mon.setDate(diffToMon)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(mon)} – ${fmt(sun)}`
}

export default function WeeklyGoalsTab({ data, update }) {
  const goals = getWeeklyGoals(data)
  const todos = getTodayTodos(data)

  const linkedCounts = goals.reduce((acc, g) => {
    acc[g.id] = todos.filter(t => t.goalId === g.id).length
    return acc
  }, {})

  const completedGoals = goals.filter(g => g.current >= g.target)
  const activeGoals = goals.filter(g => g.current < g.target)

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Weekly Goals</h2>
        <span className="text-xs text-gray-400">{getWeekRange()}</span>
      </div>

      {goals.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm px-4 py-8 text-center">
          <p className="text-gray-400 text-sm">No goals for this week yet.</p>
          <p className="text-gray-300 text-xs mt-1">Add a goal and link your daily todos to it.</p>
        </div>
      )}

      {activeGoals.map(goal => (
        <GoalCard
          key={goal.id}
          goal={goal}
          goalType="weekly"
          update={update}
          linkedCount={linkedCounts[goal.id] || 0}
        />
      ))}

      {completedGoals.length > 0 && (
        <div className="pt-2">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 px-1">Completed</p>
          {completedGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              goalType="weekly"
              update={update}
              linkedCount={linkedCounts[goal.id] || 0}
            />
          ))}
        </div>
      )}

      <AddGoalForm
        onAdd={(text, target) => update(d => addWeeklyGoal(d, text, target))}
        placeholder="e.g. Exercise 5 times"
      />

      {goals.length > 0 && (
        <div className="bg-gray-50 rounded-2xl px-4 py-3 text-center">
          <p className="text-xs text-gray-400">
            {completedGoals.length} of {goals.length} goals completed this week
          </p>
        </div>
      )}
    </div>
  )
}
