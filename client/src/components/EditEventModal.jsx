import React, { useState } from 'react';

export const EditEventModal = ({ onSave, onDelete, onClose, eventText, eventStartTime, eventEndTime, eventLocation, eventColor, setCurrentColor }) => {
    const [eventTitleInput, setEventTitleInput] = useState(eventText);
    const [startTimeInput, setStartTimeInput] = useState(eventStartTime);
    const [endTimeInput, setEndTimeInput] = useState(eventEndTime);
    const [locationInput, setLocationInput] = useState(eventLocation);
    const [colorInput, setColorInput] = useState(eventColor);
    const [eventError, setEventError] = useState(false);
    const [startTimeError, setStartTimeError] = useState(false);
    const [endTimeError, setEndTimeError] = useState(false);
    const [locationError, setLocationError] = useState(false);

    return(
        <>
            <div id="eventModal">
                <h2>Edit Event</h2>

                <input 
                    className={eventError ? 'error' : ''}
                    value={eventTitleInput} 
                    onChange={e => setEventTitleInput(e.target.value)} 
                    id="eventTitleInput"
                    placeholder="Event Title"
                />

                <input 
                    className={startTimeError ? 'error' : ''}
                    value={startTimeInput} 
                    onChange={e => setStartTimeInput(e.target.value)} 
                    id="startTimeInput"
                    type = 'time'
                />
                -
                <input 
                    className={endTimeError ? 'error' : ''}
                    value={endTimeInput} 
                    onChange={e => setEndTimeInput(e.target.value)} 
                    id="endTimeInput"
                    type = 'time'
                />
                <input 
                    value={colorInput} 
                    onChange={e => setColorInput(e.target.value)} 
                    id="colorInput"
                    type="color"
                />
                <br></br>

                <input 
                    className={locationError ? 'error' : ''}
                    value={locationInput} 
                    onChange={e => setLocationInput(e.target.value)} 
                    id="locationInput"
                    placeholder="Location"
                />

                <button 
                onClick={() => {
                    if (eventTitleInput && startTimeInput && endTimeInput && locationInput) {
                        setEventError(false)
                        setStartTimeError(false)
                        setEndTimeError(false)
                        setLocationError(false)
                        onSave(eventTitleInput, startTimeInput, endTimeInput, locationInput, colorInput)
                    } else {
                        if (!eventTitleInput) {
                            setEventError(true)
                        } else {
                            setEventError(false)
                        }
                        if (!startTimeInput) {
                            setStartTimeError(true)
                        } else {
                            setStartTimeError(false)
                        }
                        if (!endTimeInput) {
                            setEndTimeError(true)
                        } else {
                            setEndTimeError(false)
                        }
                        if (!locationInput) {
                            setLocationError(true)
                        } else {
                            setLocationError(false)
                        }
                    }
                }} 
                id="saveButton">Save</button>
                <button onClick={onDelete} id="deleteButton">Delete</button>

                <button 
                onClick={() => {
                    setCurrentColor(colorInput)
                    onClose()
                }}
                id="cancelButton">Cancel</button>
            </div>

            <div id="modalBackDrop"></div>
        </>
    );
};