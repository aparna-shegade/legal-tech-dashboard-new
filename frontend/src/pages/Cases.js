import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket"; // realtime updates

function Cases() {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterType, setFilterType] = useState("");
  const [form, setForm] = useState({
    caseTitle: "",
    caseType: "",
    status: "Pending",
    priority: "Low",
    description: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null means create
  const [message, setMessage] = useState("");

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await API.get("/cases").catch(() => ({ data: [] }));
      setCases(res.data || []);
      setFilteredCases(res.data || []);
    } catch (err) {
      console.error("fetchCases error:", err);
      // keep state empty so UI shows zero counts rather than crashing
      setCases([]);
      setFilteredCases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();

    // socket listeners for real-time updates
    socket.on("caseCreated", () => fetchCases());
    socket.on("caseUpdated", () => fetchCases());
    socket.on("caseDeleted", () => fetchCases());

    return () => {
      socket.off("caseCreated");
      socket.off("caseUpdated");
      socket.off("caseDeleted");
    };
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = cases;

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    if (filterPriority) {
      filtered = filtered.filter(c => c.priority === filterPriority);
    }

    if (filterType) {
      filtered = filtered.filter(c => c.caseType === filterType);
    }

    setFilteredCases(filtered);
  }, [searchTerm, filterStatus, filterPriority, filterType, cases]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/cases/${editingId}`, form);
        setMessage("✓ Case updated successfully!");
      } else {
        await API.post("/cases", form);
        setMessage("✓ Case added successfully!");
      }
      setForm({
        caseTitle: "",
        caseType: "",
        status: "Pending",
        priority: "Low",
        description: ""
      });
      setShowForm(false);
      setEditingId(null);
      setTimeout(() => setMessage(""), 3000);
      fetchCases();
    } catch (err) {
      setMessage(editingId ? "✗ Error updating case" : "✗ Error adding case");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      try {
        await API.delete(`/cases/${id}`);
        setMessage("✓ Case deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
        fetchCases();
      } catch (err) {
        setMessage("✗ Error deleting case");
      }
    }
  };

  const caseTypes = [...new Set(cases.map(c => c.caseType))].sort();

  if (loading) {
    return <div className="container"><div className="loading">Loading Cases</div></div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          📋 Legal Cases
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
            style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
          >
            {showForm ? "Cancel" : "➕ Add New Case"}
          </button>
        </div>
      </div>

      {message && (
        <div className={message.includes("✓") ? "success-message" : "error"}>
          {message}
        </div>
      )}

      {/* Add Case Form */}
      {showForm && (
        <div className="card" style={{ background: "#f9f9f9", borderLeft: "4px solid #3498db" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "1.5rem" }}>
            {editingId ? "Edit Case" : "Add New Case"}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <input
              className="search-input"
              type="text"
              placeholder="Case Title"
              value={form.caseTitle}
              onChange={(e) => setForm({ ...form, caseTitle: e.target.value })}
              required
            />
            <input
              className="search-input"
              type="text"
              placeholder="Case Type"
              value={form.caseType}
              onChange={(e) => setForm({ ...form, caseType: e.target.value })}
              required
            />
            <select
              className="filter-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Closed">Closed</option>
            </select>
            <select
              className="filter-select"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <textarea
              className="search-input"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ gridColumn: "1 / -1", minHeight: "80px", fontFamily: "inherit" }}
            />
            <button type="submit" className="btn btn-success" style={{ gridColumn: "1 / -1" }}>
              {editingId ? "✓ Update Case" : "✓ Add Case"}
            </button>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="search-filter-container">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search cases by title, type, or description..."
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
          <option value="Ongoing">Ongoing</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          className="filter-select"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {caseTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <span style={{ color: "#7f8c8d", whiteSpace: "nowrap" }}>
          {filteredCases.length} of {cases.length} cases
        </span>
      </div>

      {/* Cases Table */}
      <div className="card">
        {filteredCases.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📂</div>
            <div className="empty-state-text">No cases found</div>
            <p style={{ color: "#7f8c8d" }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Case Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Start Date</th>
                  <th>Next Hearing</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((caseItem) => (
                  <tr key={caseItem._id}>
                    <td style={{ fontWeight: "500" }}>{caseItem.caseTitle}</td>
                    <td>{caseItem.caseType}</td>
                    <td>
                      <span className={`badge badge-${caseItem.status.toLowerCase()}`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${caseItem.priority.toLowerCase()}`}>
                        {caseItem.priority}
                      </span>
                    </td>
                    <td>{new Date(caseItem.startDate).toLocaleDateString()}</td>
                    <td>{new Date(caseItem.nextHearingDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-warning"
                        onClick={() => {
                          setForm({
                            caseTitle: caseItem.caseTitle,
                            caseType: caseItem.caseType,
                            status: caseItem.status,
                            priority: caseItem.priority,
                            description: caseItem.description
                          });
                          setEditingId(caseItem._id);
                          setShowForm(true);
                        }}
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", marginRight: "0.5rem" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(caseItem._id)}
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
        )}
      </div>
    </div>
  );
}

export default Cases;