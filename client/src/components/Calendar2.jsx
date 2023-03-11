import React from 'react'
import Script from '../js/script'

const Calendar2 = () => {
    return (
        <div id="calendar-body">
            <div id="calendar-container">
                <div id="calendar-header">
                    <div id="monthDisplay"></div>
                    <div>
                        <button id="backButton">Back</button>
                        <button id="nextButton">Next</button>
                    </div>
                </div>

                <div id="weekdays">
                    <div>Sunday</div>
                    <div>Monday</div>
                    <div>Tuesday</div>
                    <div>Wednesday</div>
                    <div>Thursday</div>
                    <div>Friday</div>
                    <div>Saturday</div>
                </div>

                <div id="calendar"></div>
            </div>

            <div id="eventModal">
                <h2 id="modalTitle">New Event</h2>

                <input id="eventTitleInput" placeholder="Event Title" />
                <input id="startTimeInput" placeholder="Start Time" /> - <input id="endTimeInput" placeholder="End Time" />
                <label for="colorInput"></label>
                <input id="colorInput" type="color" value="#58bae4"/>
                <br></br>

                <button id="saveButton">Save</button>
                <button id="deleteButton">Delete</button>
                <button id="cancelButton">Cancel</button>
            </div>

            <div id="modalBackDrop"></div>
            <script src="../js/script.js"></script>
        </div>
    )
}

Script()

export default Calendar