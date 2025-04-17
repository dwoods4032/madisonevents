"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function MadisonEventDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);
  const [filters, setFilters] = useState({
    type: "",
    venue: "",
    genre: "",
    price: "",
    neighborhood: ""
  });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/isthmus");
        const xmlText = await res.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        const eventList = Array.from(items).map((item, index) => {
          const title = item.querySelector("title")?.textContent || "";
          const link = item.querySelector("link")?.textContent || "";
          const pubDateText = item.querySelector("pubDate")?.textContent || "";
          const description = item.querySelector("description")?.textContent || "";

          const match = description.match(/\b(?:\w+day|\w+\s\d{1,2},\s\d{4})\b.*?(\d{1,2}:\d{2}\s?[ap]m)?/i);

          let eventDate = new Date(pubDateText); // fallback
          if (match) {
            try {
              const timestamp = Date.parse(match[0]);
              if (!isNaN(timestamp)) {
                eventDate = new Date(timestamp);
              }
            } catch (_) {}
          }

          const date = eventDate.toISOString().slice(0, 10);
          const time = eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return {
            id: index,
            title,
            link,
            date,
            time,
            type: "Mixed",
            venue: "Unknown",
            genre: "",
            price: "",
            neighborhood: ""
          };
        });

        setEvents(eventList);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const dateMatch = event.date === selectedDate;
    const matchesFilters = Object.entries(filters).every(([key, value]) => !value || (event[key] && event[key].toLowerCase().includes(value.toLowerCase())));
    return dateMatch && matchesFilters;
  });

  const generateGoogleMapsLink = (venue: string) => {
    const query = encodeURIComponent(`${venue}, Madison WI`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Madison Events Calendar</h1>

      <div style={{ marginBottom: "20px" }}>
        <Calendar
          onChange={(date) => {
            const iso = new Date(date as Date).toISOString().slice(0, 10);
            setSelectedDate(iso);
          }}
          value={new Date(selectedDate)}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "20px" }}>
        <input placeholder="Event Type" onChange={(e) => setFilters({ ...filters, type: e.target.value })} />
        <input placeholder="Venue Type" onChange={(e) => setFilters({ ...filters, venue: e.target.value })} />
        <input placeholder="Genre" onChange={(e) => setFilters({ ...filters, genre: e.target.value })} />
        <input placeholder="Price" onChange={(e) => setFilters({ ...filters, price: e.target.value })} />
        <input placeholder="Neighborhood" onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })} />
      </div>

      <p><strong>Debug:</strong> {events.length} total events loaded. Selected date: {selectedDate}</p>

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
          <p>No events found for this date and filters.</p>
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
