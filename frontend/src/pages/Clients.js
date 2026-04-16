import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";

function Clients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/clients");
      setClients(res.data || []);
      setFilteredClients(res.data || []);
    } catch (err) {
      console.error("fetchClients error:", err);
      setClients([]);
      setFilteredClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();

    socket.on("clientCreated", () => fetchClients());
    socket.on("clientUpdated", () => fetchClients());
    socket.on("clientDeleted", () => fetchClients());

    return () => {
      socket.off("clientCreated");
      socket.off("clientUpdated");
      socket.off("clientDeleted");
    };
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
      );
    }

    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/clients", form);
      setMessage("✓ Client added successfully!");
      setForm({ name: "", email: "", phone: "", address: "" });
      setShowForm(false);
      setTimeout(() => setMessage(""), 3000);
      fetchClients();
    } catch (err) {
      setMessage("✗ Error adding client");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await API.delete(`/clients/${id}`);
        setMessage("✓ Client deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
        fetchClients();
      } catch (err) {
        setMessage("✗ Error deleting client");
      }
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading Clients</div></div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          👥 Clients
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
            style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
          >
            {showForm ? "Cancel" : "➕ Add New Client"}
          </button>
        </div>
      </div>

      {message && (
        <div className={message.includes("✓") ? "success-message" : "error"}>
          {message}
        </div>
      )}

      {/* Add Client Form */}
      {showForm && (
        <div className="card" style={{ background: "#f9f9f9", borderLeft: "4px solid #3498db" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "1.5rem" }}>Add New Client</h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <input
              className="search-input"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="search-input"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              className="search-input"
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="search-input"
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              style={{ gridColumn: "1 / -1" }}
            />
            <button type="submit" className="btn btn-success" style={{ gridColumn: "1 / -1" }}>
              ✓ Add Client
            </button>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="search-filter-container">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span style={{ color: "#7f8c8d", whiteSpace: "nowrap" }}>
          {filteredClients.length} of {clients.length} clients
        </span>
      </div>

      {/* Clients Grid View */}
      {filteredClients.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <div className="empty-state-text">No clients found</div>
            <p style={{ color: "#7f8c8d" }}>Try adjusting your search terms</p>
          </div>
        </div>
      ) : (
        <div className="list-grid">
          {filteredClients.map((client) => (
            <div key={client._id} className="list-item">
              <div className="list-item-title">👤 {client.name}</div>
              <div className="list-item-meta">
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>Email:</strong> <br />
                  <a href={`mailto:${client.email}`} style={{ color: "#3498db", textDecoration: "none" }}>
                    {client.email}
                  </a>
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>Phone:</strong> <br />
                  <a href={`tel:${client.phone}`} style={{ color: "#3498db", textDecoration: "none" }}>
                    {client.phone}
                  </a>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <strong>Address:</strong> <br />
                  {client.address}
                </div>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(client._id)}
                style={{ width: "100%" }}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Clients Table View */}
      {filteredClients.length > 0 && (
        <div className="card" style={{ marginTop: "2rem" }}>
          <div className="card-header" style={{ fontSize: "1.1rem" }}>Detailed View</div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client._id}>
                    <td style={{ fontWeight: "500" }}>{client.name}</td>
                    <td>
                      <a href={`mailto:${client.email}`} style={{ color: "#3498db", textDecoration: "none" }}>
                        {client.email}
                      </a>
                    </td>
                    <td>
                      <a href={`tel:${client.phone}`} style={{ color: "#3498db", textDecoration: "none" }}>
                        {client.phone}
                      </a>
                    </td>
                    <td>{client.address}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(client._id)}
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

export default Clients;