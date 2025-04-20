
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [debugMode, setDebugMode] = useState(true);

  useEffect(() => {
    fetch("events.json")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Failed to load events:", err));
  }, []);

  const selectedISO = selectedDate.toISOString().split("T")[0];

  const filteredEvents = events.filter((event) => event.date === selectedISO);

  return (
    <div className="App">
      <h1>🎉 Madison Events Calendar</h1>
      <div className="calendar-container">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
        />
      </div>

      <div className="event-info">
        <p><strong>Debug:</strong> {events.length} total events loaded. Selected date: {selectedISO}</p>
        {filteredEvents.length === 0 ? (
          <p>No events found for this date.</p>
        ) : (
          <div className="event-list">
            {filteredEvents.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Type:</strong> {event.type}</p>
                <p><strong>Genre:</strong> {event.genre}</p>
                <p><strong>Buy Tickets:</strong> {event.price ? <a href={event.price} target="_blank" rel="noopener noreferrer">Link</a> : "N/A"}</p>
                <p><a href={event.link} target="_blank" rel="noopener noreferrer">More info</a></p>
              </div>
            ))}
          </div>
        )}

        {debugMode && (
          <div className="debug-section">
            <details>
              <summary>▼ Show all event titles (debug)</summary>
              <ul>
                {events.map((e) => (
                  <li key={e.id}>
                    {e.date} - {e.title}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
