let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const eventModal = document.getElementById('eventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const startTimeInput = document.getElementById('startTimeInput');
const endTimeInput = document.getElementById('endTimeInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

async function openModal(date) { // Open event window pop-up when a calendar square is clicked
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {
        document.getElementById('modalTitle').innerText = "Edit Event";
        eventTitleInput.value = eventForDay.title;
        startTimeInput.value = eventForDay.startTime;
        endTimeInput.value = eventForDay.endTime;
        document.getElementById('deleteButton').style.visibility = 'visible';
    } else {
        document.getElementById('modalTitle').innerText = "New Event";
        document.getElementById('deleteButton').style.visibility = 'hidden';
    }

    eventModal.style.display = 'block';
    backDrop.style.display = 'block';
}

async function load() { // Load calendar onto view
    const dt = new Date();
    console.log(events);

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
            const eventForDay = events.find(e => e.date === dayString);

            if (i - paddingDays === day && nav === 0) { // Highlight current day
                daySquare.id = 'currentDay';
            }

            if (eventForDay) { // If event exists, load in its date
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                eventDiv.addEventListener('click', () => { 
                    openModal(dayString);
                });
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

async function closeModal() { // Closing event window pop-up and resetting values
    eventTitleInput.classList.remove('error');
    startTimeInput.classList.remove('error');
    endTimeInput.classList.remove('error');
    eventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    startTimeInput.value = '';
    endTimeInput.value = '';
    flag = 0;
    replaced = false;
    clicked = null;
    load();
}

async function saveEvent() {
    if (eventTitleInput.value && startTimeInput.value && endTimeInput.value) {
        events = events.filter(e => e.date !== clicked);
        eventTitleInput.classList.remove('error');
        startTimeInput.classList.remove('error');
        endTimeInput.classList.remove('error');
        events.push({
            date: clicked,
            title: eventTitleInput.value,
            startTime: startTimeInput.value,
            endTime: endTimeInput.value
        });

        localStorage.setItem('events', JSON.stringify(events));
        closeModal();
    } else {
        if (!eventTitleInput.value) {
            eventTitleInput.classList.add('error');
        }
        if (!startTimeInput.value) {
            startTimeInput.classList.add('error');
        }
        if (!endTimeInput.value) {
            endTimeInput.classList.add('error');
        }
    }
}

async function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
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

initButtons();
load();