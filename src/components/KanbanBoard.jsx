"use client"

export default function KanbanBoard({
  tasks,
  users,
  columns,
  onTaskClick,
  onDragStart,
  onDragOver,
  onDrop,
  onSmartAssign,
  draggedTask,
}) {
  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status)
  }

  const getUserById = (userId) => {
    return users.find((user) => user.id === userId)
  }

  const TaskCard = ({ task }) => {
    const assignedUser = getUserById(task.assignedTo)

    return (
      <div
        className={`task-card ${draggedTask?.id === task.id ? "dragging" : ""}`}
        draggable
        onDragStart={() => onDragStart(task)}
        onClick={() => onTaskClick(task)}
      >
        <div className="task-header">
          <h4 className="task-title">{task.title}</h4>
          <div className="task-actions">
            <button
              className="smart-assign-btn"
              onClick={(e) => {
                e.stopPropagation()
                onSmartAssign(task.id)
              }}
              title="Smart Assign"
            >
              🎯
            </button>
          </div>
        </div>

        {task.description && <p className="task-description">{task.description}</p>}

        <div className="task-footer">
          <div className="task-priority">
            <span className={`priority-badge ${task.priority?.toLowerCase()}`}>{task.priority || "Medium"}</span>
          </div>

          {assignedUser && (
            <div className="task-assignee">
              <div className="user-avatar">{assignedUser.username.charAt(0).toUpperCase()}</div>
              <span className="user-name">{assignedUser.username}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="kanban-board">
      {columns.map((column) => (
        <div
          key={column}
          className={`kanban-column ${draggedTask ? "drag-active" : ""}`}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, column)}
        >
          <div className="column-header">
            <h3>{column}</h3>
            <span className="task-count">{getTasksByStatus(column).length}</span>
          </div>

          <div className="column-content">
            {getTasksByStatus(column).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {getTasksByStatus(column).length === 0 && (
              <div className="empty-column">
                <p>No tasks in {column}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
