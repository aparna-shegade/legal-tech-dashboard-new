import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import Clients from "./pages/Clients";
import Tasks from "./pages/Tasks";
import Documents from "./pages/Documents";
import Navbar from "./components/Navbar";
import CalendarView from "./components/CalenderView.jsx";
import TimelineView from "./components/TimelineView.jsx";
import "./styles.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/timeline" element={<TimelineView />} />
      </Routes>
    </Router>
  );
}

export default App;