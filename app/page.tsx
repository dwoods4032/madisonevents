'use client'

import { useState, useEffect } from 'react'
import { format, parse } from 'date-fns'

type Event = {
  title: string
  link: string
  venue: string
  date: string
  time: string
  genre: string
  buy_tickets: string
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    format(new Date(), 'yyyy-MM-dd')
  )

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/events.json')
      const data: Event[] = await res.json()
      setEvents(data)
    }

    fetchEvents()
  }, [])

  const eventsByDate: Record<string, Event[]> = {}
  events.forEach(event => {
    const parsed = parse(event.date, 'MMM d, yyyy', new Date())
    const key = format(parsed, 'yyyy-MM-dd')
    if (!eventsByDate[key]) eventsByDate[key] = []
    eventsByDate[key].push(event)
  })

  const renderEventsForSelectedDate = () => {
    const eventsForDay = eventsByDate[selectedDate] || []
    if (eventsForDay.length === 0) {
      return <p>No events found for this date.</p>
    }

    return (
      <ul className="space-y-4">
        {eventsForDay.map((event, index) => (
          <li key={index} className="border-b pb-2">
            <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold">
              {event.title}
            </a>
            <div className="text-sm">{event.venue}</div>
            <div className="text-sm">{event.time}</div>
            <div className="text-sm">{event.genre}</div>
            {event.buy_tickets !== 'N/A' && (
              <div>
                <a
                  href={event.buy_tickets}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 underline text-sm"
                >
                  Buy Tickets
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    )
  }

  const renderCalendar = () => {
    const now = new Date()
    const days = Array.from({ length: 31 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth(), i + 1)
      const key = format(date, 'yyyy-MM-dd')
      return (
        <button
          key={key}
          onClick={() => setSelectedDate(key)}
          className={`w-8 h-8 border rounded ${selectedDate === key ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
        >
          {i + 1}
        </button>
      )
    })

    return (
      <div className="grid grid-cols-7 gap-1 max-w-xs mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-medium text-center">
            {day}
          </div>
        ))}
        {days}
      </div>
    )
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Madison Events Calendar</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div>{renderCalendar()}</div>
        <div className="flex-1">
          <p className="mb-2 text-sm font-medium">
            <strong>Selected date:</strong> {selectedDate}
          </p>
          {renderEventsForSelectedDate()}
        </div>
      </div>
    </main>
  )
}
