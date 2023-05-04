import React, { useState } from 'react';
import { EditEventModal } from './EditEventModal'
import { ViewEventModal } from './ViewEventModal';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const Day = ({ day, onClick, events, setCurrentColor, getEvents, eventFlag, setEventFlag, username }) => {
    const className = `day ${day.value === 'padding' ? 'padding' : ''} ${day.isCurrentDay ? 'currentDay' : ''}`
    const [eventClicked, setEventClicked] = useState()
    let eventsForDay = []
    if (day.value !== 'padding') {
        eventsForDay = events.filter(event => event.date.indexOf(day.date) !== -1)
    }

    async function updateEvent(id, updatedEvent) {
        fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEvent)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update event');
                }
                return response.json();
            })
            .then(updatedEvent => {
                console.log('Updated event:', updatedEvent);
                getEvents();
            })
            .catch(error => {
                console.error(error);
            });
    }

    async function deleteEventById(id) {
        fetch(`${API_BASE_URL}/events/` + id, {
          method: 'DELETE',
        })
          .then(response => response.json())
          .then(data => {
            console.log('Deleted event:', data);
            getEvents();
          })
          .catch(error => {
            console.error('Error deleting event:', error)
          })
    }

    return (
        <div className={className} onClick={onClick}>
            {day.value === 'padding' ? '' : day.value}

            {eventsForDay.map(event => (
                <div className="event" style={{ backgroundColor: event.color }} key={event._id} onClick={() => {
                    console.log('Selected event:', event);
                    setEventClicked(event)
                    setEventFlag(true)
                }}>
                    {event.title}
                </div>
            ))}

            {
                eventClicked && eventFlag === true && (
                    eventClicked.attendees.includes(username) ?
                        <EditEventModal 
                            eventTitle={eventClicked.title}
                            eventStartTime={eventClicked.startTime}
                            eventEndTime={eventClicked.endTime}
                            eventLocation={eventClicked.location}
                            eventPrivate={eventClicked._private}
                            eventColor={eventClicked.color}
                            setCurrentColor={setCurrentColor}
                            onSave={(eventTitleInput, startTimeInput, endTimeInput, locationInput, privateInput, colorInput) => {
                                const event = {
                                    date: eventClicked.date,
                                    title: eventTitleInput,
                                    startTime: startTimeInput,
                                    endTime: endTimeInput,
                                    location: locationInput,
                                    _private: privateInput,
                                    color: colorInput
                                };
                                updateEvent(eventClicked._id, event)
                                setEventClicked(null)
                                setEventFlag(false)
                            }}
                            onClose={() => {
                                setEventClicked(null)
                                setEventFlag(false)
                            }}
                            onDelete={() => {
                                deleteEventById(eventClicked._id)
                                setEventClicked(null)
                                setEventFlag(false)
                            }}
                        /> :
                        <ViewEventModal
                            eventDate={eventClicked.date}
                            eventTitle={eventClicked.title}
                            eventStartTime={eventClicked.startTime}
                            eventEndTime={eventClicked.endTime}
                            eventLocation={eventClicked.location}
                            eventColor={eventClicked.color}
                            onClose={() => {
                                setEventClicked(null)
                                setEventFlag(false)
                            }}
                        />
                )
            }
        </div>
    )
}