"use client"

import { useState } from "react"

export default function ActivityLog({ activities }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const getActivityIcon = (action) => {
    switch (action) {
      case "created":
        return "➕"
      case "updated":
        return "✏️"
      case "deleted":
        return "🗑️"
      case "moved":
        return "↔️"
      case "smart assigned":
        return "🎯"
      case "resolved conflict":
        return "🔧"
      default:
        return "📝"
    }
  }

  return (
    <div className={`activity-log ${isExpanded ? "expanded" : ""}`}>
      <div className="activity-header">
        <h3>Activity Log</h3>
        <button className="expand-btn" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "←" : "→"}
        </button>
      </div>

      <div className="activity-content">
        {activities.length === 0 ? (
          <div className="no-activities">
            <p>No recent activities</p>
          </div>
        ) : (
          <div className="activity-list">
            {activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{getActivityIcon(activity.action)}</div>
                <div className="activity-details">
                  <div className="activity-text">
                    <strong>{activity.user}</strong> {activity.action}
                    {activity.taskTitle && <span className="task-name"> "{activity.taskTitle}"</span>}
                    {activity.details && <span className="activity-extra"> {activity.details}</span>}
                  </div>
                  <div className="activity-time">{formatTime(activity.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
