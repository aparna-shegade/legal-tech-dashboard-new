import React, { useEffect, useState } from 'react';

export default function NotificationPanel({ socket }) {
  const [notifications, setNotifications] = useState([]);
  // no email preferences now; only in‑app notifications

  // no backend preference anymore
  useEffect(() => {}, []);

  useEffect(() => {
    if (!socket) return;
    const push = (n) => setNotifications(prev => [ { id: Date.now(), time: new Date().toISOString(), text: n }, ...prev ]);
    socket.on('deadlineReminder', (items) => {
      if (items && items.length) push(`${items.length} upcoming deadline(s) within 24 hours`);
    });
    socket.on('deadlineCreated', (d) => push(`Deadline created: ${d.title}`));
    socket.on('deadlineUpdated', (d) => push(`Deadline updated: ${d.title}`));
    socket.on('deadlineDeleted', (d) => push(`Deadline removed: ${d.title || d._id}`));

    return () => socket.off('deadlineReminder');
  }, [socket]);


  return (
    <div className="card">
      <div className="card-header">🔔 Notifications</div>
      <div style={{ padding: '1rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={() => {
            setNotifications(prev => [ { id: Date.now(), time: new Date().toISOString(), text: 'Manual test notification' }, ...prev ]);
          }}>Test Notification</button>
        </div>
        <div style={{ maxHeight: '220px', overflow: 'auto' }}>
          {notifications.length === 0 && <div className="empty-state">No notifications yet</div>}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {notifications.map(n => (
              <li key={n.id} style={{ padding: '0.6rem', marginBottom: '0.5rem', background: '#fff', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '0.85rem', color: '#333' }}>{n.text}</div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>{new Date(n.time).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
