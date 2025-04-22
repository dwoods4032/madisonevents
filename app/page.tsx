"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Event = {
  id: string;
  title: string;
  link: string;
  venue: string;
  type: string;
  genre: string;
  price: string;
  date: string;
};

export default function MadisonEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetch("/events.json")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Failed to load events:", err));
  }, []);

  const selectedDateStr = selectedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const filteredEvents = events.filter(
    (event) => event.date === selectedDateStr
  );

  const displayValue = (value: string) =>
    value && value !== "Unknown" ? value : "";

  const generateGoogleMapsLink = (venue: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      venue + ", Madison WI"
    )}`;

  const tileClassName = ({ date }: { date: Date }) => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const isSelected =
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();

    if (isSelected) return "selected";
    if (isToday) return "today";
    return null;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
        Madison Events Calendar
      </h1>

      <style>{`
        .react-calendar__tile.today {
          background-color: yellow !important;
        }
        .react-calendar__tile.selected {
          background-color: dodgerblue !important;
          color: white;
        }
      `}</style>

      <div style={{ marginBottom: "20px" }}>
        <Calendar
          onChange={(date) => setSelectedDate(date as Date)}
          value={selectedDate}
          tileClassName={tileClassName}
        />
      </div>

      <div>
        <h2 style={{ marginBottom: "10px" }}>
          Events for {selectedDateStr}
        </h2>

        {filteredEvents.length === 0 ? (
          <p>No events found for this date.</p>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              style={{
                marginBottom: "15px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <h3 style={{ margin: "5px 0" }}>
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  {event.title}
                </a>
              </h3>
              <p style={{ margin: 0 }}>
                {displayValue(event.type)}{" "}
                {event.venue &&
                  `at `}
                {event.venue && (
                  <a
                    href={generateGoogleMapsLink(event.venue)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {event.venue}
                  </a>
                )}
              </p>
              <p style={{ margin: 0 }}>
                {displayValue(event.genre)}{" "}
                {event.price && `· ${event.price}`}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
