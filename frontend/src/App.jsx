import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5001/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch {
      setError("Failed to load tasks. Check your backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    setError("");

    try {
      if (editId !== null) {
        await axios.put(`${API_URL}/${editId}`, {
          title: title.trim(),
        });
      } else {
        await axios.post(API_URL, {
          title: title.trim(),
        });
      }

      setTitle("");
      setEditId(null);
      fetchTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save task."
      );
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setEditId(task.id);
  };

  const handleDelete = async (id) => {
    setError("");

    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== id)
      );
    } catch {
      setError("Failed to delete task.");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setEditId(null);
  };

  return (
    <main className="container">
      <h1>Task Manager</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter task name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button type="submit">
          {editId !== null ? "Update Task" : "Add Task"}
        </button>

        {editId !== null && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <span>{task.title}</span>

              <div className="actions">
                <button onClick={() => handleEdit(task)}>
                  Edit
                </button>

                <button
                  className="delete"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && tasks.length === 0 && (
        <p>No tasks found. Add your first task!</p>
      )}
    </main>
  );
}

export default App;