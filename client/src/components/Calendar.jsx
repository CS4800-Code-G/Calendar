import React, { useState, useEffect } from 'react'
import { CalendarHeader } from './CalendarHeader'
import { Day } from './Day'
import { NewEventModal } from './NewEventModal'
import { DeleteEventModal } from './DeleteEventModal'
import { useDate } from '../hooks/useDate'

const Calendar = () => {
    const [nav, setNav] = useState(0)
    const [clicked, setClicked] = useState()
    const [events, setEvents] = useState([])

    const eventForDate = date => events.find(e => e.date === date)

    useEffect(() => {
        localStorage.setItem('events', JSON.stringify(events))
    }, [events])

    const { days, dateDisplay } = useDate(events, nav)
    
    return (
    <>
        <div id="calendar-body">
            <div id="calendar-container">
                <CalendarHeader 
                    dateDisplay={dateDisplay}
                    onNext={() => setNav(nav + 1)}
                    onBack={() => setNav(nav - 1)}
                />

                <div id="weekdays">
                    <div>Sunday</div>
                    <div>Monday</div>
                    <div>Tuesday</div>
                    <div>Wednesday</div>
                    <div>Thursday</div>
                    <div>Friday</div>
                    <div>Saturday</div>
                </div>

                <div id="calendar">
                    {days.map((d, index) => (
                        <Day 
                            key={index}
                            day={d}
                            onClick={() => {
                                if (d.value !== 'padding') {
                                    setClicked(d.date)
                                }
                            }}
                        />
                    ))}
                </div>
            </div>

            {
                clicked && !eventForDate(clicked) &&
                <NewEventModal
                    onClose={() => setClicked(null)}
                    onSave={(title) => {
                        setEvents([ ...events, { title, date: clicked }])
                        setClicked(null)
                    }}
                />
            }

            {
                clicked && eventForDate(clicked) &&
                <DeleteEventModal 
                    eventText={eventForDate(clicked).title}
                    onSave={(title) => {
                        setEvents([ ...events, { title, date: clicked }])
                        setClicked(null)
                    }}
                    onClose={() => setClicked(null)}
                    onDelete={() => {
                        setEvents(events.filter(e => e.date !== clicked))
                        setClicked(null)
                    }}
                />
            }
        </div>
    </>
  )
}

export default Calendar