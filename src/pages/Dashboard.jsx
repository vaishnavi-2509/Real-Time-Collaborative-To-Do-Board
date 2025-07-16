import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityLog from '../components/ActivityLog';
import ConflictModal from '../components/ConflictModal';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';

function Dashboard() {
  const navigate = useNavigate();
  const [currentUser,setCurrentUser]=useState(null)
  const [tasks,setTasks]=useState([])
  const [users,setUsers]=useState([])
  const [activities,setActivities]=useState([])
  const [selectedTask,setSelectedTask]=useState(null)
  const [isModalOpen,setIsModalOpen]=useState(null)
  const [conflictData,setConflictData]=useState(null)
  const [draggedTask,setDraggedTask]=useState(null)
  
  const columns = ["Todo","In Progress","Done"]

  useEffect(()=>{
    const user= localStorage.getItem("currentUser")
    if(!user){
        navigate("/")
        return
    }

    const userData= JSON.parse(user)
    setCurrentUser(userData)

    const storedTasks= JSON.parse(localStorage.getItem("tasks")||"[]")
    const storedUsers= JSON.parse(localStorage.getItem("users")||"[]")
    const storedActivities= JSON.parse(localStorage.getItem("activities")||"[]")

    setTasks(storedTasks)
    setUsers(storedUsers)
    setActivities(storedActivities.slice(-20))
  },[navigate])

  const addActivity=(action,taskTitle="",details="")=>{
    const newActivity={
        id:date.now(),
        user: currentUser?.username||"Unknown",
        action,
        taskTitle,
        details,
        timestamp:new Date().toISOString(),
    }
    const updatedActivities=[newActivity,...activities].slice(0,20)
    setActivities(updatedActivities)
    localStorage.setItem("activities",JSON.stringify(updatedActivities))
  }

  const validateTaskTitle=(title, excludeId =null)=>{
    if(columns.includes(title)){
        return "Task title cannot match column names"
    }
    const existingTask= tasks.find((task)=>task.title.toLowerCase()===title.toLowerCase()&& task.id!==excludeId)
     if (existingTask) {
      return "Task title must be unique"
    }

    return null
  }
  const createTask = (taskData) => {
    const validation = validateTaskTitle(taskData.title)
    if (validation) {
      alert(validation)
      return
    }

    const newTask = {
      id: Date.now(),
      ...taskData,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      version: 1,
    }

    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    addActivity("created", newTask.title)
  }

  const updateTask = (taskId, updates) => {
    const validation = validateTaskTitle(updates.title, taskId)
    if (validation) {
      alert(validation)
      return
    }

    const existingTask = tasks.find((t) => t.id === taskId)
    if (!existingTask) return

    // Simulate conflict detection (in real app, this would be server-side)
    const timeDiff = Date.now() - new Date(existingTask.lastModified).getTime()
    if (timeDiff < 5000 && existingTask.lastModifiedBy && existingTask.lastModifiedBy !== currentUser.id) {
      // Potential conflict detected
      setConflictData({
        taskId,
        currentVersion: existingTask,
        newVersion: { ...existingTask, ...updates, lastModifiedBy: currentUser.id },
        updates,
      })
      return
    }

    const updatedTask = {
      ...existingTask,
      ...updates,
      lastModified: new Date().toISOString(),
      lastModifiedBy: currentUser.id,
      version: existingTask.version + 1,
    }

    const updatedTasks = tasks.map((task) => (task.id === taskId ? updatedTask : task))

    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    addActivity("updated", updatedTask.title)
  }

  const deleteTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    addActivity("deleted", task.title)
  }

  const smartAssign = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    // Count active tasks per user (tasks not in Done column)
    const activeTasks = tasks.filter((t) => t.status !== "Done")
    const userTaskCounts = {}

    users.forEach((user) => {
      userTaskCounts[user.id] = activeTasks.filter((t) => t.assignedTo === user.id).length
    })

    // Find user with fewest active tasks
    const userWithFewestTasks = users.reduce((min, user) => {
      const count = userTaskCounts[user.id] || 0
      const minCount = userTaskCounts[min.id] || 0
      return count < minCount ? user : min
    })

    updateTask(taskId, { assignedTo: userWithFewestTasks.id })
    addActivity("smart assigned", task.title, `to ${userWithFewestTasks.username}`)
  }

  const handleDragStart = (task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()
    if (!draggedTask) return

    if (draggedTask.status !== newStatus) {
      updateTask(draggedTask.id, { status: newStatus })
      addActivity("moved", draggedTask.title, `to ${newStatus}`)
    }
    setDraggedTask(null)
  }


  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/"); 
  };

  const resolveConflict = (resolution, selectedVersion) => {
    if (resolution === "merge" || resolution === "overwrite") {
      const finalUpdates =
        resolution === "overwrite" ? conflictData.updates : { ...conflictData.currentVersion, ...conflictData.updates }

      const updatedTask = {
        ...conflictData.currentVersion,
        ...finalUpdates,
        lastModified: new Date().toISOString(),
        lastModifiedBy: currentUser.id,
        version: conflictData.currentVersion.version + 1,
      }

      const updatedTasks = tasks.map((task) => (task.id === conflictData.taskId ? updatedTask : task))

      setTasks(updatedTasks)
      localStorage.setItem("tasks", JSON.stringify(updatedTasks))
      addActivity("resolved conflict", updatedTask.title, resolution)
    }

    setConflictData(null)
  }

  if (!currentUser) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>KanbanFlow</h1>
          <span className="user-welcome">Welcome, {currentUser.username}!</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="main-content">
          <div className="board-header">
            <h2>Project Board</h2>
            <button onClick={() => setIsModalOpen(true)} className="add-task-btn">
              + Add Task
            </button>
          </div>

          <KanbanBoard
            tasks={tasks}
            users={users}
            columns={columns}
            onTaskClick={setSelectedTask}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onSmartAssign={smartAssign}
            draggedTask={draggedTask}
          />
        </div>

        <ActivityLog activities={activities} />
      </div>

      {isModalOpen && <TaskModal task={null} users={users} onSave={createTask} onClose={() => setIsModalOpen(false)} />}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          users={users}
          onSave={(updates) => updateTask(selectedTask.id, updates)}
          onDelete={() => deleteTask(selectedTask.id)}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {conflictData && (
        <ConflictModal
          conflictData={conflictData}
          users={users}
          onResolve={resolveConflict}
          onClose={() => setConflictData(null)}
        />
      )}
    </div>
  )
}
export default Dashboard