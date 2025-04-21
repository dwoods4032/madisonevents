"use client";

import { useEffect, useState } from "react";

type Event = {
  id: string;
  title: string;
  link: string;
  venue: string;
  genre: string;
  date: string;
  time: string;
  buy_tickets?: string;
};

export default function MadisonEventDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    fetch("/events.json")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

  const eventDates = Array.from(new Set(events.map((e) => e.date))).sort();

  const filteredEvents = selectedDate
    ? events.filter((event) => event.date === selectedDate)
    : [];

  const generateGoogleMapsLink = (venue: string) =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue + ", Madison WI")}`;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Madison Events Calendar</h1>

      <label htmlFor="date-select" style={{ marginRight: "10px", fontWeight: "bold" }}>
        Select a date:
      </label>
      <select
        id="date-select"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{ padding: "8px", fontSize: "16px" }}
      >
        <option value="">-- Choose a date --</option>
        {eventDates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>

      {filteredEvents.length > 0 ? (
        <div style={{ marginTop: "20px" }}>
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "12px",
                margin: "10px 0",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>
                <a href={event.link} target="_blank" rel="noopener noreferrer">
                  {event.title}
                </a>
              </h2>
              <p>
                <strong>Venue:</strong>{" "}
                <a
                  href={generateGoogleMapsLink(event.venue)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {event.venue}
                </a>
              </p>
              <p>
                <strong>Time:</strong> {event.time}
              </p>
              <p>
                <strong>🎵 Genre:</strong> {event.genre}
              </p>
              {event.buy_tickets && event.buy_tickets !== "N/A" && (
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
        selectedDate && <p style={{ marginTop: "20px" }}>No events found for this date.</p>
      )}
    </div>
  );
}
