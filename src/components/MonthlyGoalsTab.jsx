import { getMonthlyGoals, addMonthlyGoal, getTodayTodos } from '../store'
import GoalCard from './GoalCard'
import AddGoalForm from './AddGoalForm'

function getMonthLabel() {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function MonthlyGoalsTab({ data, update }) {
  const goals = getMonthlyGoals(data)
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
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Monthly Goals</h2>
        <span className="text-xs text-gray-400">{getMonthLabel()}</span>
      </div>

      {goals.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm px-4 py-8 text-center">
          <p className="text-gray-400 text-sm">No goals for this month yet.</p>
          <p className="text-gray-300 text-xs mt-1">Set bigger goals that span the whole month.</p>
        </div>
      )}

      {activeGoals.map(goal => (
        <GoalCard
          key={goal.id}
          goal={goal}
          goalType="monthly"
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
              goalType="monthly"
              update={update}
              linkedCount={linkedCounts[goal.id] || 0}
            />
          ))}
        </div>
      )}

      <AddGoalForm
        onAdd={(text, target) => update(d => addMonthlyGoal(d, text, target))}
        placeholder="e.g. Read 4 books"
      />

      {goals.length > 0 && (
        <div className="bg-gray-50 rounded-2xl px-4 py-3 text-center">
          <p className="text-xs text-gray-400">
            {completedGoals.length} of {goals.length} goals completed this month
          </p>
        </div>
      )}
    </div>
  )
}
