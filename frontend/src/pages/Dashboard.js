import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";

function Dashboard() {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  const seedAndFetch = async () => {
    try {
      try {
        const { data } = await API.get("/api/cases");
        if (!data || data.length === 0) {
          await API.post("/api/seed/seed");
        }
      } catch {
        await API.post("/api/seed/seed");
      }

      const [casesRes, clientsRes, tasksRes, docsRes] = await Promise.all([
        API.get("/api/cases").catch(() => ({ data: [] })),
        API.get("/api/clients").catch(() => ({ data: [] })),
        API.get("/api/tasks").catch(() => ({ data: [] })),
        API.get("/api/documents").catch(() => ({ data: [] }))
      ]);

      setCases(casesRes.data || []);
      setClients(clientsRes.data || []);
      setTasks(tasksRes.data || []);
      setDocuments(docsRes.data || []);

      const dlRes = await API.get("/api/deadlines/upcoming?days=30")
        .catch(() => ({ data: [] }));

      setDeadlines(dlRes.data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    seedAndFetch();

    socket.on("caseCreated", seedAndFetch);
    socket.on("caseUpdated", seedAndFetch);
    socket.on("caseDeleted", seedAndFetch);

    return () => socket.off();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1>Legal Tech Dashboard</h1>

      <h3>Total Cases: {cases.length}</h3>
      <h3>Clients: {clients.length}</h3>
      <h3>Tasks: {tasks.length}</h3>
      <h3>Documents: {documents.length}</h3>
      <h3>Deadlines: {deadlines.length}</h3>
    </div>
  );
}

export default Dashboard;