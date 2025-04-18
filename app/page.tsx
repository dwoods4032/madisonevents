"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function MadisonEventDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/events.json");
        const eventList = await res.json();
        setEvents(eventList);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }

    fetchEvents();
  }, []);

  const selectedIso = selectedDate.toISOString().slice(0, 10);
  const filteredEvents = events.filter(event => event.date === selectedIso);

  const generateGoogleMapsLink = (venue) => {
    const query = encodeURIComponent(`${venue}, Madison WI`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Madison Events Calendar</h1>

      <div style={{ marginBottom: "20px" }}>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
        />
      </div>

      <p><strong>Debug:</strong> {events.length} total events loaded. Selected date: {selectedIso}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        {filteredEvents.length > 0 ? filteredEvents.map(event => (
          <div key={event.id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
              <a href={event.link} target="_blank" rel="noopener noreferrer">{event.title}</a>
            </h2>
            <p>{event.type} at <a href={generateGoogleMapsLink(event.venue)} target="_blank" rel="noopener noreferrer">{event.venue}</a></p>
            <p>{event.genre} · {event.price} · {event.neighborhood}</p>
            <p>{event.date} · {event.time}</p>
          </div>
        )) : (
          <p>No events found for this date.</p>
        )}
      </div>

      <details>
        <summary>Show all event titles (debug)</summary>
        <ul>
          {events.map(ev => (
            <li key={ev.id}>{ev.date} - {ev.title}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
