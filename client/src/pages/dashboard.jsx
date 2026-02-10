import { useEffect, useState } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default function Dashboard() {
  const [todos, setTodos] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // Fetch todos
  const fetchTodos = async () => {
    const res = await axios.get(`${API_URL}/todos`, { withCredentials: true })
    setTodos(res.data)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  // Open add modal
  const openAddModal = () => {
    setTitle("")
    setDescription("")
    setIsEditing(false)
    setShowModal(true)
  }

  // Open edit modal
  const openEditModal = (todo) => {
    setTitle(todo.title)
    setDescription(todo.description)
    setCurrentId(todo.id)
    setIsEditing(true)
    setShowModal(true)
  }

  // Add or update todo
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isEditing) {
      await axios.put(
        `${API_URL}/todos/${currentId}`,
        { title, description },
        { withCredentials: true }
      )
    } else {
      await axios.post(
        `${API_URL}/todos`,
        { title, description },
        { withCredentials: true }
      )
    }

    setShowModal(false)
    fetchTodos()
  }

  // Delete todo
  const deleteTodo = async (id) => {
    if (!confirm("Delete this task?")) return
    await axios.delete(`${API_URL}/todos/${id}`, { withCredentials: true })
    fetchTodos()
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📋 My To-Do Dashboard</h1>
        <button className="add-btn" onClick={openAddModal}>
          + Add Task
        </button>
      </header>

      <div className="todo-list">
        {todos.length === 0 && <p>No tasks yet</p>}

        {todos.map((todo) => (
          <div className="todo-card" key={todo.id}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>

            <div className="actions">
              <button className="edit" onClick={() => openEditModal(todo)}>
                Edit
              </button>
              <button className="delete" onClick={() => deleteTodo(todo.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEditing ? "Edit Task" : "Add New Task"}</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <div className="modal-actions">
                <button type="submit">
                  {isEditing ? "Update" : "Add"}
                </button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
