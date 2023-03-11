import React, { useState } from 'react';

export const EditEventModal = ({ onSave, onDelete, onClose, eventText, eventStartTime, eventEndTime, eventColor, setCurrentColor }) => {
    const [eventTitleInput, setEventTitleInput] = useState(eventText);
    const [startTimeInput, setStartTimeInput] = useState(eventStartTime);
    const [endTimeInput, setEndTimeInput] = useState(eventEndTime);
    const [colorInput, setColorInput] = useState(eventColor);
    const [eventError, setEventError] = useState(false);
    const [startTimeError, setStartTimeError] = useState(false);
    const [endTimeError, setEndTimeError] = useState(false);

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
                    placeholder="Start Time"
                />
                -
                <input 
                    className={endTimeError ? 'error' : ''}
                    value={endTimeInput} 
                    onChange={e => setEndTimeInput(e.target.value)} 
                    id="endTimeInput"
                    placeholder="End Time"
                />

                <input 
                    value={colorInput} 
                    onChange={e => setColorInput(e.target.value)} 
                    id="colorInput"
                    type="color"
                />
                <br></br>

                <button 
                onClick={() => {
                    if (eventTitleInput && startTimeInput && endTimeInput) {
                        setEventError(false)
                        setStartTimeError(false)
                        setEndTimeError(false)
                        onSave(eventTitleInput, startTimeInput, endTimeInput, colorInput)
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