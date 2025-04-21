"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Event = {
  title: string;
  link: string;
  venue: string;
  date: string;
  time: string;
  genre: string;
  buy_tickets: string;
};

export default function MadisonEventDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/events.json")
      .then((res) => res.json())
      .then((data: Event[]) => setEvents(data))
      .catch((err) => console.error("Failed to load events:", err));
  }, []);

  const selectedIso = selectedDate.toISOString().slice(0, 10);

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date).toISOString().slice(0, 10);
    return eventDate === selectedIso;
  });

  const displayValue = (value: string) =>
    value && value !== "Unknown" ? value : "";

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Madison Events Calendar</h1>

      <div style={{ marginBottom: "20px" }}>
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>

      <div>
        <p style={{ fontWeight: "bold" }}>Events for {selectedIso}:</p>
        {filteredEvents.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            {filteredEvents.map((event, idx) => (
              <div key={idx} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                  <a href={event.link} target="_blank" rel="noopener noreferrer">
                    {event.title}
                  </a>
                </h2>
                <p>{displayValue(event.venue)}</p>
                <p>{displayValue(event.time)}</p>
                <p>{displayValue(event.genre)}</p>
                {event.buy_tickets !== "N/A" && (
                  <p>
                    <a href={event.buy_tickets} target="_blank" rel="noopener noreferrer">
                      🎟 Buy Tickets
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No events found for this date.</p>
        )}
      </div>
    </div>
  );
}
