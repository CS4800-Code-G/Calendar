import React, { useState } from 'react';

export const NewEventModal = ({ onSave, onClose, currentColor, setCurrentColor }) => {
    const [eventTitleInput, setEventTitleInput] = useState('');
    const [startTimeInput, setStartTimeInput] = useState('');
    const [endTimeInput, setEndTimeInput] = useState('');
    const [colorInput, setColorInput] = useState(currentColor);
    const [eventError, setEventError] = useState(false);
    const [startTimeError, setStartTimeError] = useState(false);
    const [endTimeError, setEndTimeError] = useState(false);

    return(
        <>
            <div id="eventModal">
                <h2>New Event</h2>

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