import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

const CalendarView = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/deadlines")
      .then(res => {
        const formatted = res.data.map(item => ({
          title: item.title,
          date: item.date,
          color: item.type === "Court Date" ? "red" : "blue"
        }));
        setEvents(formatted);
      });
  }, []);

  return (
    <div>
      <h2>Case Deadlines Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        selectable={true}
      />
    </div>
  );
};

export default CalendarView;