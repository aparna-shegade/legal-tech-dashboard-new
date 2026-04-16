import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [form, setForm] = useState({
    caseId: "",
    taskTitle: "",
    dueDate: "",
    status: "Pending",
    completionPercentage: 0
  });
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const [tasksRes, casesRes] = await Promise.all([
        API.get("/api/tasks").catch(() => ({ data: [] })),
        API.get("/api/cases").catch(() => ({ data: [] }))
      ]);
      setTasks(tasksRes.data || []);
      setFilteredTasks(tasksRes.data || []);
      setCases(casesRes.data || []);
    } catch (err) {
      console.error("fetchTasks error:", err);
      setTasks([]);
      setFilteredTasks([]);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    socket.on("taskCreated", () => fetchTasks());
    socket.on("taskUpdated", () => fetchTasks());
    socket.on("taskDeleted", () => fetchTasks());

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.taskTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    setFilteredTasks(filtered);
  }, [searchTerm, filterStatus, tasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/tasks", form);
      setMessage("✓ Task added successfully!");
      setForm({
        caseId: "",
        taskTitle: "",
        dueDate: "",
        status: "Pending",
        completionPercentage: 0
      });
      setShowForm(false);
      setTimeout(() => setMessage(""), 3000);
      fetchTasks();
    } catch (err) {
      setMessage("✗ Error adding task");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/api/tasks/${id}`);
        setMessage("✓ Task deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
        fetchTasks();
      } catch (err) {
        setMessage("✗ Error deleting task");
      }
    }
  };

  const getCaseName = (caseId) => {
    const caseItem = cases.find(c => c._id === caseId);
    return caseItem ? caseItem.caseTitle : "Unknown Case";
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading Tasks</div></div>;
  }

  const completedCount = tasks.filter(t => t.status === "Completed").length;
  const completionRate = tasks.length > 0 ? ((completedCount / tasks.length) * 100).toFixed(1) : 0;

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          ✓ Tasks Management
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
            style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
          >
            {showForm ? "Cancel" : "➕ Add New Task"}
          </button>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-label">Total Tasks</div>
          <div className="stat-value">{tasks.length}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{completedCount}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{tasks.filter(t => t.status === "Pending").length}</div>
        </div>
        <div className="stat-card" style={{ background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)" }}>
          <div className="stat-label">Completion Rate</div>
          <div className="stat-value">{completionRate}%</div>
        </div>
      </div>

      {message && (
        <div className={message.includes("✓") ? "success-message" : "error"}>
          {message}
        </div>
      )}

      {/* Add Task Form */}
      {showForm && (
        <div className="card" style={{ background: "#f9f9f9", borderLeft: "4px solid #3498db" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "1.5rem" }}>Add New Task</h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <select
              className="filter-select"
              value={form.caseId}
              onChange={(e) => setForm({ ...form, caseId: e.target.value })}
              required
            >
              <option value="">Select a Case</option>
              {cases.map(c => (
                <option key={c._id} value={c._id}>{c.caseTitle}</option>
              ))}
            </select>
            <input
              className="search-input"
              type="text"
              placeholder="Task Title"
              value={form.taskTitle}
              onChange={(e) => setForm({ ...form, taskTitle: e.target.value })}
              required
            />
            <input
              className="search-input"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              required
            />
            <select
              className="filter-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <input
              className="search-input"
              type="number"
              min="0"
              max="100"
              placeholder="Completion %"
              value={form.completionPercentage}
              onChange={(e) =>
                setForm({ ...form, completionPercentage: parseInt(e.target.value) || 0 })
              }
            />
            <button type="submit" className="btn btn-success" style={{ gridColumn: "1 / -1" }}>
              ✓ Add Task
            </button>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="search-filter-container">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <span style={{ color: "#7f8c8d", whiteSpace: "nowrap" }}>
          {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>

      {/* Tasks Table */}
      {filteredTasks.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <div className="empty-state-text">No tasks found</div>
            <p style={{ color: "#7f8c8d" }}>Try adjusting your search or filters</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Case</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Progress</th>
                  <th>Completion %</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task._id}>
                    <td style={{ fontWeight: "500" }}>{task.taskTitle}</td>
                    <td style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>
                      {getCaseName(task.caseId)}
                    </td>
                    <td>
                      <span className={`badge badge-${task.status.toLowerCase()}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td>
                      <div className="progress-bar-container" style={{ width: "150px" }}>
                        <div
                          className="progress-bar"
                          style={{ width: `${task.completionPercentage}%` }}
                        />
                      </div>
                    </td>
                    <td style={{ fontWeight: "bold", color: "#3498db" }}>
                      {task.completionPercentage}%
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(task._id)}
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;