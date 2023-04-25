import React, { useState } from 'react';

export const ViewEventModal = ({ onClose, eventDate, eventTitle, eventStartTime, eventEndTime, eventLocation, eventColor }) => {

    function formattedDate(dateInput) {
        const date = new Date(dateInput);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function formattedTime(militaryTime) {
        const date = new Date();
        date.setHours(parseInt(militaryTime.split(':')[0], 10));
        date.setMinutes(parseInt(militaryTime.split(':')[1], 10));

        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        return date.toLocaleTimeString('en-US', options);
    }

    return(
        <>
            <div id="viewEventModal">
                <div className="viewEventColor" style={{ backgroundColor: eventColor }} />
                <h2>{eventTitle}</h2>

                <p>Date: {formattedDate(eventDate)}</p>
                <p>Time: {formattedTime(eventStartTime)} - {formattedTime(eventEndTime)}</p>
                <p className='viewLocation'>Location: {eventLocation}</p>

                <button 
                onClick={() => {
                    onClose()
                }}
                id="cancelButton">Close</button>
            </div>

            <div id="modalBackDrop"></div>
        </>
    );
};