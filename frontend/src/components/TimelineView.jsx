import React, { useEffect, useState } from "react";
import axios from "axios";

const TimelineView = () => {
  const [tasks, setTasks] = useState([]);
  const [GanttModule, setGanttModule] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // fetch deadlines
    axios.get("/api/deadlines")
      .then(res => {
        // make sure we only transform well-formed deadline objects
        const formattedTasks = (res.data || [])
          .filter(item => item && item.date && item.createdAt)
          .map((item, index) => ({
            start: new Date(item.createdAt),
            end: new Date(item.date),
            name: item.title,
            id: index.toString(),
            type: "task",
            progress: item.status === "Completed" ? 100 : 50,
            isDisabled: false
        }));
        setTasks(formattedTasks);
      })
      .catch(() => setTasks([]));

    // dynamically import gantt module and CSS to avoid dev crash when package missing
    (async () => {
      try {
        const mod = await import('gantt-task-react');
        // import CSS separately
        try {
          await import('gantt-task-react/dist/index.css');
        } catch (e) {
          // css import failed, continue — only visual styling missing
          console.warn('gantt css not loaded:', e.message);
        }
        setGanttModule(mod);
      } catch (err) {
        console.error('Failed to load gantt-task-react:', err.message || err);
        setLoadError(true);
      }
    })();
  }, []);

  const Gantt = GanttModule ? GanttModule.Gantt : null;

  // fallback simple horizontal timeline if gantt not available
  const SimpleTimeline = ({ items }) => {
    if (!items || items.length === 0) return <div>No timeline data</div>;
    const dates = items.map(i => new Date(i.date));
    const min = Math.min(...dates);
    const max = Math.max(...dates);
    const range = Math.max(1, max - min);
    return (
      <div className="timeline" style={{ padding: '1rem 0' }}>
        {items.map(it => {
          const left = ((new Date(it.date) - min) / range) * 100;
          return (
            <div key={it._id} className="timeline-item" style={{ left: `${left}%` }} title={`${it.title} - ${new Date(it.date).toLocaleDateString()}`}>
              <div className="timeline-dot" />
              <div className="timeline-label">{it.title}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header">Case Timeline</div>
      <div style={{ padding: '1rem' }}>
        {/* only render the gantt chart when we have at least one task; otherwise fall back */}
      {Gantt && tasks && tasks.length > 0 ? <Gantt tasks={tasks} /> : <SimpleTimeline items={tasks} />}
      </div>
    </div>
  );
};

export default TimelineView;