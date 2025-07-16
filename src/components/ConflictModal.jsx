"use client"

export default function ConflictModal({ conflictData, users, onResolve, onClose }) {
  const { currentVersion, newVersion } = conflictData

  const getUserById = (userId) => {
    return users.find((user) => user.id === userId)?.username || "Unknown"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="conflict-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚠️ Conflict Detected</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="conflict-content">
          <p className="conflict-message">
            This task was modified by another user while you were editing it. Please choose how to resolve this
            conflict:
          </p>

          <div className="versions-comparison">
            <div className="version-card">
              <h3>Current Version</h3>
              <div className="version-info">
                <p>
                  <strong>Last modified by:</strong> {getUserById(currentVersion.lastModifiedBy)}
                </p>
                <p>
                  <strong>Modified at:</strong> {formatDate(currentVersion.lastModified)}
                </p>
              </div>
              <div className="version-details">
                <p>
                  <strong>Title:</strong> {currentVersion.title}
                </p>
                <p>
                  <strong>Description:</strong> {currentVersion.description || "No description"}
                </p>
                <p>
                  <strong>Status:</strong> {currentVersion.status}
                </p>
                <p>
                  <strong>Priority:</strong> {currentVersion.priority}
                </p>
                <p>
                  <strong>Assigned to:</strong> {getUserById(currentVersion.assignedTo) || "Unassigned"}
                </p>
              </div>
            </div>

            <div className="version-card">
              <h3>Your Version</h3>
              <div className="version-info">
                <p>
                  <strong>Your changes</strong>
                </p>
              </div>
              <div className="version-details">
                <p>
                  <strong>Title:</strong> {newVersion.title}
                </p>
                <p>
                  <strong>Description:</strong> {newVersion.description || "No description"}
                </p>
                <p>
                  <strong>Status:</strong> {newVersion.status}
                </p>
                <p>
                  <strong>Priority:</strong> {newVersion.priority}
                </p>
                <p>
                  <strong>Assigned to:</strong> {getUserById(newVersion.assignedTo) || "Unassigned"}
                </p>
              </div>
            </div>
          </div>

          <div className="conflict-actions">
            <button onClick={() => onResolve("overwrite")} className="overwrite-btn">
              Use My Version (Overwrite)
            </button>
            <button onClick={() => onResolve("merge")} className="merge-btn">
              Merge Changes
            </button>
            <button onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
