let nav = 0;
let clicked = null;
let events = [];
let eventId = null;
let flag = 0;
let update = false;


const calendar = document.getElementById('calendar');
const eventModal = document.getElementById('eventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const startTimeInput = document.getElementById('startTimeInput');
const endTimeInput = document.getElementById('endTimeInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Open event window pop-up when a calendar date is clicked
async function openModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if (flag !== 0) {
        document.getElementById('modalTitle').innerText = "Edit Event";
        eventId = eventForDay._id
        eventTitleInput.value = eventForDay.title;
        startTimeInput.value = eventForDay.startTime;
        endTimeInput.value = eventForDay.endTime;
        update = true;
        document.getElementById('deleteButton').style.visibility = 'visible';
    } else {
        document.getElementById('modalTitle').innerText = "New Event";
        document.getElementById('deleteButton').style.visibility = 'hidden';
        update = false;
    }

    eventModal.style.display = 'block';
    backDrop.style.display = 'block';
}

// Get events from the database (Read)
async function getEvents() {
    fetch('/events')
        .then(response => response.json())
        .then(data => {
            events = data;
            load();
        })
        .catch(error => console.error(error));
}

// Get an event from the database (Read)
async function openModalById(id) {
    document.getElementById('modalTitle').innerText = "Edit Event";

    fetch('/events/' + id)
        .then(response => response.json())
        .then(event => {
            eventId = event._id
            eventTitleInput.value = event.title;
            startTimeInput.value = event.startTime;
            endTimeInput.value = event.endTime;
            console.log('Selected event:', event);
        })
        .catch(error => console.error(error));

    update = true;
    document.getElementById('deleteButton').style.visibility = 'visible';
    eventModal.style.display = 'block';
    backDrop.style.display = 'block';
}

// (Create) and add an event to the database
async function createEvent(event) {
    fetch('/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      })
        .then(response => response.json())
        .then(data => { 
            console.log('Created event:', data);
            getEvents();
         })
        .catch(error => console.error(error));
}

// (Update) an event from the database
async function updateEvent(id, updatedEvent) {
    fetch(`/events/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
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

// (Delete) an event from the database
async function deleteEventById(id) {
    fetch('/events/' + id, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          console.log('Event deleted:', data);
          getEvents();
        })
        .catch(error => {
          console.error('Error deleting event:', error);
        });
}

// Load calendar onto view
async function load() {
    const dt = new Date();

    console.log('Events:', events);

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerText = 
        `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

    calendar.innerHTML = '';

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;

        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;

            const eventsForDay = events.filter(event => event.date.indexOf(dayString) !== -1);

            if (i - paddingDays === day && nav === 0) { // Highlight current day
                daySquare.id = 'currentDay';
            }

            for (e of eventsForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = e.title;
                eventDiv.addEventListener('click', (function(id) {
                    return function() {
                        flag++;
                        openModalById(id);
                    }
                })(e._id));
                daySquare.appendChild(eventDiv);
            }

            daySquare.addEventListener('click', () => { 
                openModal(dayString);
            });
        } else {
            daySquare.classList.add('padding');
        }

        calendar.appendChild(daySquare);
    }
}

// Closing event window pop-up and resetting values
async function closeModal() {
    eventTitleInput.classList.remove('error');
    startTimeInput.classList.remove('error');
    endTimeInput.classList.remove('error');
    eventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    startTimeInput.value = '';
    endTimeInput.value = '';
    flag = 0;
    clicked = null;
}

// Saves event by creating if new or updating if created prior (clicking on 'Save' button)
async function saveEvent() {
    if (eventTitleInput.value && startTimeInput.value && endTimeInput.value) {
        events = events.filter(e => e.date !== clicked);
        eventTitleInput.classList.remove('error');
        startTimeInput.classList.remove('error');
        endTimeInput.classList.remove('error');
        const event = {
            date: clicked,
            title: eventTitleInput.value,
            startTime: startTimeInput.value,
            endTime: endTimeInput.value
        };

        if (update === true) {
            updateEvent(eventId, event);
        } else {
            createEvent(event);
        }
        closeModal();

    } else {
        if (!eventTitleInput.value) {
            eventTitleInput.classList.add('error');
        } else {
            eventTitleInput.classList.remove('error');
        }
        if (!startTimeInput.value) {
            startTimeInput.classList.add('error');
        } else {
            startTimeInput.classList.remove('error');
        }
        if (!endTimeInput.value) {
            endTimeInput.classList.add('error');
        } else {
            endTimeInput.classList.remove('error');
        }
    }
}

// Deletes an event when clicking on the 'Delete' button
async function deleteEvent() {
    deleteEventById(eventId);
    closeModal();
}

async function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });

    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });

    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
}

getEvents();
initButtons();
load();