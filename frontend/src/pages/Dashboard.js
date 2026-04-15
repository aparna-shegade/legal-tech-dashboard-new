import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import TimelineView from '../components/TimelineView';
import NotificationPanel from '../components/NotificationPanel';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

const COLORS = ["#3498db", "#2ecc71", "#e74c3c", "#f39c12"];

function Dashboard() {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calendarView, setCalendarView] = useState('dayGridMonth');
  const [toast, setToast] = useState(null);

  // fetch/seeding helper used both on mount and after modifications
  const seedAndFetch = async () => {
    try {
      // attempt to seed the database only if it's empty
      try {
        const { data } = await API.get('/cases');
        if (!data || data.length === 0) {
          await API.post("/seed/seed");
        }
      } catch (seedCheckErr) {
        // if even the GET fails, still try to seed
        console.warn("Seed check failed, attempting reseed:", seedCheckErr.message || seedCheckErr);
        try {
          await API.post("/seed/seed");
        } catch (_) {}
      }

      const [casesRes, clientsRes, tasksRes, docsRes] = await Promise.all([
        API.get("/cases").catch(() => ({ data: [] })),
        API.get("/clients").catch(() => ({ data: [] })),
        API.get("/tasks").catch(() => ({ data: [] })),
        API.get("/documents").catch(() => ({ data: [] }))
      ]);
      setCases(casesRes.data || []);
      setClients(clientsRes.data || []);
      setTasks(tasksRes.data || []);
      setDocuments(docsRes.data || []);
      const dlRes = await API.get('/deadlines/upcoming?days=30').catch(() => ({ data: [] }));
      setDeadlines(dlRes.data || []);
    } catch (err) {
      console.error("Error during seedAndFetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    seedAndFetch();

    // subscribe to real-time changes
    socket.on("caseCreated", () => seedAndFetch());
    socket.on("caseUpdated", () => seedAndFetch());
    socket.on("caseDeleted", () => seedAndFetch());
    socket.on("documentCreated", () => seedAndFetch());
    socket.on("documentUpdated", () => seedAndFetch());
    socket.on("documentDeleted", () => seedAndFetch());
    socket.on("taskCreated", () => seedAndFetch());
    socket.on("taskUpdated", () => seedAndFetch());
    socket.on("taskDeleted", () => seedAndFetch());
    socket.on("clientCreated", () => seedAndFetch());
    socket.on("clientUpdated", () => seedAndFetch());
    socket.on("clientDeleted", () => seedAndFetch());
    socket.on('deadlineCreated', () => seedAndFetch());
    socket.on('deadlineUpdated', () => seedAndFetch());
    socket.on('deadlineDeleted', () => seedAndFetch());
    socket.on('deadlineReminder', (items) => {
      if (items && items.length > 0) {
        setToast({ id: Date.now(), message: `${items.length} upcoming deadline(s) within 24 hours.` });
        setTimeout(() => setToast(null), 8000);
      }
    });

    return () => {
      socket.off();
    };
  }, []);

  if (loading) {
    return <div className="container"><div className="loading">Loading Dashboard</div></div>;
  }

  // Calculate statistics
  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.status === "Ongoing").length;
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const pendingDocuments = documents.filter(d => d.status === "Pending").length;

  // Case Status Distribution
  const caseStatusData = [
    { name: "Pending", value: cases.filter(c => c.status === "Pending").length },
    { name: "Ongoing", value: cases.filter(c => c.status === "Ongoing").length },
    { name: "Closed", value: cases.filter(c => c.status === "Closed").length }
  ];

  // Document Status Distribution
  const docStatusData = [
    { name: "Pending", value: documents.filter(d => d.status === "Pending").length },
    { name: "Reviewed", value: documents.filter(d => d.status === "Reviewed").length },
    { name: "Approved", value: documents.filter(d => d.status === "Approved").length }
  ];

  // Case Type Distribution
  const caseTypeData = cases.reduce((acc, c) => {
    const existing = acc.find(item => item.name === c.caseType);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: c.caseType, value: 1 });
    }
    return acc;
  }, []);

  // Priority Distribution
  const priorityData = cases.reduce((acc, c) => {
    const existing = acc.find(item => item.name === c.priority);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: c.priority, value: 1 });
    }
    return acc;
  }, []);

  // Task Completion Rate
  const taskCompletionData = [
    { name: "Completed", value: tasks.filter(t => t.status === "Completed").length },
    { name: "Pending", value: tasks.filter(t => t.status === "Pending").length }
  ];

  // FullCalendar events from deadlines (colored by type)
  const calendarEvents = deadlines.map(d => ({
    id: d._id,
    title: `${d.title}`,
    start: d.date,
    backgroundColor: d.type === 'Court Date' ? '#e74c3c' : d.type === 'Reminder' ? '#f39c12' : '#3498db',
    borderColor: 'transparent',
    textColor: '#fff',
    extendedProps: { caseId: d.caseId, type: d.type }
  }));

  // Export deadlines to Excel
  const exportDeadlinesExcel = () => {
    const data = deadlines.map(d => ({
      Title: d.title,
      Description: d.description || '',
      Type: d.type || '',
      Date: new Date(d.date).toLocaleString(),
      Status: d.status
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Deadlines');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'deadlines.xlsx');
  };

  // Export a section as PDF (snapshot of upcoming list)
  const exportDeadlinesPDF = async () => {
    const el = document.getElementById('upcoming-deadlines-export');
    if (!el) return;
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(el, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('deadlines.pdf');
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF export requires additional frontend packages. Run `npm install jspdf html2canvas` in the frontend folder and restart the dev server.');
    }
  };

  // TimelineView component (richer Gantt when available)

  return (
    <div className="container">
      <div className="card">
        <div className="card-header" style={{ borderBottom: "3px solid #3498db" }}>
          📊 Legal Tech Dashboard
          <span style={{ fontSize: "0.8rem", color: "#7f8c8d" }}>
            Last updated: {new Date().toLocaleString()}
          </span>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-label">Total Cases</div>
          <div className="stat-value">{totalCases}</div>
          <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>All Legal Cases</div>
        </div>

        <div className="stat-card success">
          <div className="stat-label">Active Cases</div>
          <div className="stat-value">{activeCases}</div>
          <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Currently Ongoing</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-label">Completed Tasks</div>
          <div className="stat-value">{completedTasks}</div>
          <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Out of {tasks.length}</div>
        </div>

        <div className="stat-card danger">
          <div className="stat-label">Pending Documents</div>
          <div className="stat-value">{pendingDocuments}</div>
          <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Awaiting Review</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Case Status Pie Chart */}
        <div className="chart-container">
          <div className="chart-title">📈 Case Status Distribution</div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={caseStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {caseStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Document Status Pie Chart */}
        <div className="chart-container">
          <div className="chart-title">📄 Document Status Distribution</div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={docStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#82ca9d"
                dataKey="value"
              >
                {docStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Case Type Bar Chart */}
        <div className="chart-container">
          <div className="chart-title">📋 Cases by Type</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={caseTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution Bar Chart */}
        <div className="chart-container">
          <div className="chart-title">🎯 Cases by Priority</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#e74c3c" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task Completion Rate */}
        <div className="chart-container">
          <div className="chart-title">✅ Task Completion Rate</div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskCompletionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {taskCompletionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "#2ecc71" : "#f39c12"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Clients Overview */}
        <div className="chart-container">
          <div className="chart-title">👥 Client Statistics</div>
          <div style={{ padding: "1rem" }}>
            <div className="stat-card" style={{ marginBottom: "0.5rem" }}>
              <div className="stat-label">Total Clients</div>
              <div className="stat-value">{clients.length}</div>
            </div>
            <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#7f8c8d" }}>
              <p>Active clients served</p>
              <p>Across all case types</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar & Deadlines */}
      <div className="card">
        <div className="card-header">📆 Calendar & Deadlines</div>
        <div style={{ padding: '1rem' }}>
          <div className="calendar-controls" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <button className={`btn ${calendarView === 'dayGridDay' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCalendarView('dayGridDay')}>Day</button>
            <button className={`btn ${calendarView === 'timeGridWeek' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCalendarView('timeGridWeek')}>Week</button>
            <button className={`btn ${calendarView === 'dayGridMonth' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCalendarView('dayGridMonth')}>Month</button>
            <button className="btn btn-primary" onClick={exportDeadlinesExcel}>Export Excel</button>
            <button className="btn btn-primary" onClick={exportDeadlinesPDF}>Export PDF</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.3fr', gap: '1rem', alignItems: 'start' }}>
            <div style={{ minHeight: 360 }}>
              <FullCalendar
                key={calendarView}
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                initialView={calendarView}
                headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
                events={calendarEvents}
                height={360}
                dateClick={async info => {
                  const title = window.prompt('Enter deadline title (leave blank to cancel)');
                  if (!title) return;
                  const type = window.prompt('Type (Court Date / Deadline / Reminder)', 'Deadline');
                  try {
                    await API.post('/deadlines', { title, date: info.dateStr, type });
                    seedAndFetch();
                    setToast({ id: Date.now(), message: 'Deadline created' });
                    setTimeout(() => setToast(null), 5000);
                  } catch (e) {
                    console.error(e);
                    alert('Failed to create deadline');
                  }
                }}
                eventClick={info => {
                  const evt = info.event;
                  const detail = `Title: ${evt.title}\nDate: ${evt.start.toLocaleString()}\nType: ${evt.extendedProps.type}`;
                  window.alert(detail);
                }}
              />
            </div>

            <div className="right-sidebar" style={{ maxWidth: '100%' }}>
              <div style={{ marginBottom: '1rem' }}>
                <NotificationPanel socket={socket} />
              </div>

              <div id="upcoming-deadlines-export">
                <h4>Upcoming Deadlines (30 days)</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {deadlines.map(d => (
                    <li key={d._id} style={{ marginBottom: '0.6rem' }}>
                      <strong>{d.title}</strong>
                      <div style={{ fontSize: '0.9rem', color: '#555' }}>{new Date(d.date).toLocaleString()}</div>
                      <div style={{ fontSize: '0.85rem', color: '#777' }}>{d.type} — {d.status}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <h4>Case Timeline</h4>
                <div style={{ marginTop: '0.5rem' }}>
                  <TimelineView />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card">
        <div className="card-header">📅 Recent Cases</div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Case Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {cases.slice(0, 5).map(caseItem => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="card" style={{ marginTop: "2rem" }}>
        <div className="card-header">📊 Summary Statistics</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          <div>
            <h4 style={{ color: "#3498db", marginBottom: "0.5rem" }}>Case Overview</h4>
            <p>Total Cases: <strong>{totalCases}</strong></p>
            <p>Active Cases: <strong>{activeCases}</strong></p>
            <p>Pending Cases: <strong>{cases.filter(c => c.status === "Pending").length}</strong></p>
            <p>Closed Cases: <strong>{cases.filter(c => c.status === "Closed").length}</strong></p>
          </div>
          <div>
            <h4 style={{ color: "#2ecc71", marginBottom: "0.5rem" }}>Task Status</h4>
            <p>Total Tasks: <strong>{tasks.length}</strong></p>
            <p>Completed: <strong>{completedTasks}</strong></p>
            <p>Pending: <strong>{tasks.filter(t => t.status === "Pending").length}</strong></p>
            <p>Completion Rate: <strong>{((completedTasks / tasks.length) * 100).toFixed(1)}%</strong></p>
          </div>
          <div>
            <h4 style={{ color: "#e74c3c", marginBottom: "0.5rem" }}>Document Status</h4>
            <p>Total Documents: <strong>{documents.length}</strong></p>
            <p>Approved: <strong>{documents.filter(d => d.status === "Approved").length}</strong></p>
            <p>Reviewed: <strong>{documents.filter(d => d.status === "Reviewed").length}</strong></p>
            <p>Pending: <strong>{pendingDocuments}</strong></p>
          </div>
          <div>
            <h4 style={{ color: "#f39c12", marginBottom: "0.5rem" }}>Case Distribution</h4>
            <p>Clients: <strong>{clients.length}</strong></p>
            <p>High Priority: <strong>{cases.filter(c => c.priority === "High").length}</strong></p>
            <p>Medium Priority: <strong>{cases.filter(c => c.priority === "Medium").length}</strong></p>
            <p>Low Priority: <strong>{cases.filter(c => c.priority === "Low").length}</strong></p>
          </div>
        </div>
      </div>
      {/* Toast container */}
      <div className="toast-container">
        {toast && (
          <div className="toast">
            <span>{toast.message}</span>
            <span className="close" onClick={() => setToast(null)}>✕</span>
          </div>
        )}
      </div>

      {/* Notifications panel moved into the calendar right column (see above) */}
    </div>
  );
}

export default Dashboard;
