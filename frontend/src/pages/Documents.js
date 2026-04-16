import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [form, setForm] = useState({
    caseId: "",
    documentName: "",
    documentType: "",
    status: "Pending"
  });
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const [docsRes, casesRes] = await Promise.all([
        API.get("/api/documents"),
        API.get("/api/cases")
      ]);
      setDocuments(docsRes.data);
      setFilteredDocuments(docsRes.data);
      setCases(casesRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();

    socket.on("documentCreated", () => fetchDocuments());
    socket.on("documentUpdated", () => fetchDocuments());
    socket.on("documentDeleted", () => fetchDocuments());

    return () => {
      socket.off("documentCreated");
      socket.off("documentUpdated");
      socket.off("documentDeleted");
    };
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.documentType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(d => d.status === filterStatus);
    }

    if (filterType) {
      filtered = filtered.filter(d => d.documentType === filterType);
    }

    setFilteredDocuments(filtered);
  }, [searchTerm, filterStatus, filterType, documents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/documents", form);
      setMessage("✓ Document added successfully!");
      setForm({
        caseId: "",
        documentName: "",
        documentType: "",
        status: "Pending"
      });
      setShowForm(false);
      setTimeout(() => setMessage(""), 3000);
      fetchDocuments();
    } catch (err) {
      setMessage("✗ Error adding document");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await API.delete(`/documents/${id}`);
        setMessage("✓ Document deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
        fetchDocuments();
      } catch (err) {
        setMessage("✗ Error deleting document");
      }
    }
  };

  const getCaseName = (caseId) => {
    const caseItem = cases.find(c => c._id === caseId);
    return caseItem ? caseItem.caseTitle : "Unknown Case";
  };

  const documentTypes = [...new Set(documents.map(d => d.documentType))].sort();

  if (loading) {
    return <div className="container"><div className="loading">Loading Documents</div></div>;
  }

  const statusBreakdown = {
    pending: documents.filter(d => d.status === "Pending").length,
    reviewed: documents.filter(d => d.status === "Reviewed").length,
    approved: documents.filter(d => d.status === "Approved").length
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          📄 Documents
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
            style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
          >
            {showForm ? "Cancel" : "➕ Add New Document"}
          </button>
        </div>
      </div>

      {/* Document Statistics */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-label">Total Documents</div>
          <div className="stat-value">{documents.length}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Approved</div>
          <div className="stat-value">{statusBreakdown.approved}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-label">Reviewed</div>
          <div className="stat-value">{statusBreakdown.reviewed}</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{statusBreakdown.pending}</div>
        </div>
      </div>

      {message && (
        <div className={message.includes("✓") ? "success-message" : "error"}>
          {message}
        </div>
      )}

      {/* Add Document Form */}
      {showForm && (
        <div className="card" style={{ background: "#f9f9f9", borderLeft: "4px solid #3498db" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "1.5rem" }}>Add New Document</h3>
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
              placeholder="Document Name"
              value={form.documentName}
              onChange={(e) =>
                setForm({ ...form, documentName: e.target.value })
              }
              required
            />
            <input
              className="search-input"
              type="text"
              placeholder="Document Type (e.g., Contract, Report)"
              value={form.documentType}
              onChange={(e) =>
                setForm({ ...form, documentType: e.target.value })
              }
              required
            />
            <select
              className="filter-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Approved">Approved</option>
            </select>
            <button type="submit" className="btn btn-success" style={{ gridColumn: "1 / -1" }}>
              ✓ Add Document
            </button>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="search-filter-container">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search by name or type..."
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
          <option value="Reviewed">Reviewed</option>
          <option value="Approved">Approved</option>
        </select>
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {documentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <span style={{ color: "#7f8c8d", whiteSpace: "nowrap" }}>
          {filteredDocuments.length} of {documents.length} documents
        </span>
      </div>

      {/* Documents Grid View */}
      {filteredDocuments.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <div className="empty-state-text">No documents found</div>
            <p style={{ color: "#7f8c8d" }}>Try adjusting your search or filters</p>
          </div>
        </div>
      ) : (
        <>
          <div className="list-grid">
            {filteredDocuments.map((doc) => (
              <div key={doc._id} className="list-item" style={{ borderLeftColor: 
                doc.status === "Approved" ? "#2ecc71" : 
                doc.status === "Reviewed" ? "#3498db" : "#f39c12"
              }}>
                <div className="list-item-title">📄 {doc.documentName}</div>
                <div className="list-item-meta">
                  <div style={{ marginBottom: "0.5rem" }}>
                    <strong>Type:</strong> {doc.documentType}
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <strong>Case:</strong> <br />
                    {getCaseName(doc.caseId)}
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <strong>Status:</strong> <br />
                    <span className={`badge badge-${doc.status.toLowerCase()}`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(doc._id)}
                  style={{ width: "100%" }}
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>

          {/* Documents Table View */}
          <div className="card" style={{ marginTop: "2rem" }}>
            <div className="card-header" style={{ fontSize: "1.1rem" }}>Detailed View</div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Type</th>
                    <th>Case</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc._id}>
                      <td style={{ fontWeight: "500" }}>📄 {doc.documentName}</td>
                      <td>{doc.documentType}</td>
                      <td style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>
                        {getCaseName(doc.caseId)}
                      </td>
                      <td>
                        <span className={`badge badge-${doc.status.toLowerCase()}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(doc._id)}
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
        </>
      )}
    </div>
  );
}

export default Documents;