import React, { useState, useEffect } from "react";
import { useChatContext } from "stream-chat-react";
import { CalendarHeader } from "./CalendarHeader";
import { Day } from "./Day";
import { NewEventModal } from "./NewEventModal";
import { useDate } from "../hooks/useDate";

//Base_Url
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Calendar = (user) => {
  const [nav, setNav] = useState(0);
  const [clicked, setClicked] = useState();
  const [events, setEvents] = useState([]);
  const [eventFlag, setEventFlag] = useState(false);
  const [currentColor, setCurrentColor] = useState("#58bae4");
  const { channel } = useChatContext();
  const members = Object.values(channel?.state?.members || {});
  const usernames = members
    .map(({ user }) => user.name)
    .filter((user) => user !== "Personal");
  if (usernames.length === 0) {
    usernames.push(user.data.username);
  }

  useEffect(() => {
    if (channel && user.data.username !== "Personal") {
      getEvents();
    }

    const eventSource = new EventSource(`${API_BASE_URL}/stream-events`);

    eventSource.addEventListener("update", () => {
      getEvents();
    });

    return () => {
      eventSource.close();
    };
  }, [channel]);

  async function getEvents() {
    fetch(`${API_BASE_URL}/events`)
      .then((response) => response.json())
      .then((data) => {
        setEvents(
          data
            .filter((event) =>
              event.attendees.some((attendeeName) =>
                usernames.includes(attendeeName)
              )
            )
            .filter(
              (event) =>
                event.attendees.some(
                  (attendeeName) => attendeeName === user.data.username
                ) ^
                (event.attendees.every(
                  (attendeeName) => attendeeName !== user.data.username
                ) && !event._private)
            )
        );
        //console.log("Events: " + data);
      })
      .catch((error) => console.error(error));
  }

  async function createEvent(event) {
    fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })
      .then((response) => {
        response.json();
      })
      .then((data) => {
        console.log("Created event:", event);
        getEvents();
      })
      .catch((error) => console.error(error));
  }

  const { days, dateDisplay } = useDate(events, nav);

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
                events={events}
                currentColor={currentColor}
                setCurrentColor={setCurrentColor}
                onClick={() => {
                  if (d.value !== "padding") {
                    setClicked(d.date);
                    //console.log(user.data.username)
                    //console.log(usernames);
                    if (eventFlag === true) {
                      setClicked(null);
                    }
                  }
                }}
                eventFlag={eventFlag}
                setEventFlag={setEventFlag}
                getEvents={getEvents}
                username={user.data.username}
              />
            ))}
          </div>
        </div>

        {eventFlag === false && clicked && (
          <NewEventModal
            onClose={() => {
              setClicked(null);
            }}
            onSave={(
              eventTitleInput,
              startTimeInput,
              endTimeInput,
              locationInput,
              privateInput,
              colorInput
            ) => {
              const event = {
                date: clicked,
                title: eventTitleInput,
                startTime: startTimeInput,
                endTime: endTimeInput,
                location: locationInput,
                _private: privateInput,
                color: colorInput,
                attendees: usernames,
              };
              createEvent(event);
              setClicked(null);
            }}
            currentColor={currentColor}
            setCurrentColor={setCurrentColor}
          />
        )}
      </div>
    </>
  );
};

export default Calendar;
