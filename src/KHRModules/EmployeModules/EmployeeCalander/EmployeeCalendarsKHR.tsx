import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Calendar } from "primereact/calendar";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import type { Nullable } from "primereact/ts-helpers";
import Modal from "react-bootstrap/Modal";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";
import moment from "moment";

// Import Service and Modal
import { getCalendarEvents, CalendarEventAPI } from "./CalendarService";
import AddEditEmployeeCalendarsKHRModal from "./AddEditEmployeeCalendarsKHRModal";

// --- Interfaces for FullCalendar ---
interface FCEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  className: string;
  backgroundColor: string;
  textColor: string;
  extendedProps: {
    location?: string;
    description?: string;
    privacy?: string;
    organizer?: string;
  };
}

const EmployeeCalendarsKHR = () => {
  const routes = all_routes;
  const calendarRef = useRef<FullCalendar | null>(null);

  // State
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [events, setEvents] = useState<FCEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Event Details Modal State
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // --- 1. Fetch Data & Map to UI ---
  const fetchEvents = async () => {
    try {
      const response = await getCalendarEvents();

      // Check if data is inside response.data.data (List) or just response.data (Single Object wrapper)
      // Adapting to your structure where data might be a list
      let rawData: CalendarEventAPI[] = [];

      if (response.data?.data && Array.isArray(response.data.data)) {
        rawData = response.data.data;
      } else if (
        response.data?.data &&
        typeof response.data.data === "object"
      ) {
        // If API returns a single object instead of array, wrap it
        rawData = [response.data.data];
      }

      const mappedEvents: FCEvent[] = rawData.map((item) => {
        // Parse API Date Format: "2026-01-10 14:00:00"
        const startDate = moment(item.start, "YYYY-MM-DD HH:mm:ss").toDate();
        const endDate = moment(item.stop, "YYYY-MM-DD HH:mm:ss").toDate();

        // Color coding based on Privacy
        let bgColor = "#EDF2F4"; // Default
        let txtColor = "#0C4B5E";

        if (item.privacy === "private") {
          bgColor = "#FAE7E7"; // Reddish for private
          txtColor = "#E70D0D";
        } else {
          bgColor = "#E8E9EA"; // Gray for public
          txtColor = "#212529";
        }

        return {
          id: String(item.event_id), // Map 'event_id' -> 'id'
          title: item.name, // Map 'name' -> 'title'
          start: startDate,
          end: endDate,
          className: "badge", // Bootstrap badge class base
          backgroundColor: bgColor,
          textColor: txtColor,
          extendedProps: {
            location: item.location,
            description: item.description, // HTML content
            privacy: item.privacy,
            organizer: item.user_id?.name,
          },
        };
      });

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Failed to load calendar events", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // --- Handlers ---
  const handleEventClick = (info: any) => {
    // Extract data for the modal
    const eventObj = {
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      location: info.event.extendedProps.location,
      description: info.event.extendedProps.description,
      privacy: info.event.extendedProps.privacy,
      organizer: info.event.extendedProps.organizer,
    };
    setSelectedEvent(eventObj);
    setShowEventDetailsModal(true);
  };

  const handleDateSelect = (date: Date) => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.gotoDate(date);
    }
    setDate(date);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Breadcrumb & Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="my-auto mb-2">
            <h2 className="mb-1">Calendar</h2>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>
                    <i className="ti ti-smart-home" />
                  </Link>
                </li>
                <li className="breadcrumb-item">Application</li>
                <li className="breadcrumb-item active">Calendar</li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
            <div className="mb-2">
              <button
                className="btn btn-primary d-flex align-items-center"
                onClick={() => setShowAddModal(true)}
              >
                <i className="ti ti-circle-plus me-2" /> Create Event
              </button>
            </div>
            <div className="ms-2 head-icons">
              <CollapseHeader />
            </div>
          </div>
        </div>

        <div className="row">
          {/* Small Calendar Sidebar */}
          <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
            <div className="stickybar">
              <div className="card">
                <div className="card-body p-3">
                  <div className="border-bottom pb-2 mb-4">
                    <Calendar
                      className="datepickers mb-4"
                      value={date}
                      onChange={(e) => handleDateSelect(e.value as Date)}
                      inline={true}
                    />
                  </div>
                  <div className="border-bottom pb-4 mb-4">
                    <h5>Upcoming Events</h5>
                    {/* You can filter 'events' state here to show a list of upcoming items if needed */}
                    <p className="text-muted fs-12">
                      Click dates on the calendar to navigate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main FullCalendar */}
          <div className="col-xxl-9 col-xl-8 theiaStickySidebar">
            <div className="stickybar">
              <div className="card border-0">
                <div className="card-body">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    headerToolbar={{
                      start: "today,prev,next",
                      center: "title",
                      end: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    eventClick={handleEventClick}
                    ref={calendarRef}
                    eventTimeFormat={{
                      hour: "numeric",
                      minute: "2-digit",
                      meridiem: "short",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 1. Event Details Modal --- */}
      <Modal
        show={showEventDetailsModal}
        onHide={() => setShowEventDetailsModal(false)}
        centered
      >
        <div className="modal-header bg-dark modal-bg">
          <div className="modal-title text-white">
            <span id="eventTitle" className="fw-bold">
              {selectedEvent?.title}
            </span>
            {selectedEvent?.privacy && (
              <span
                className={`badge ms-2 ${
                  selectedEvent.privacy === "private"
                    ? "bg-danger"
                    : "bg-success"
                }`}
              >
                {selectedEvent.privacy}
              </span>
            )}
          </div>
          <button
            type="button"
            className="btn-close custom-btn-close"
            onClick={() => setShowEventDetailsModal(false)}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="modal-body">
          {/* Date & Time */}
          <div className="d-flex align-items-center mb-3">
            <i className="ti ti-calendar-check text-primary fs-5 me-2" />
            <div>
              <span className="fw-medium text-black">
                {selectedEvent?.start
                  ? moment(selectedEvent.start).format("DD MMM, YYYY")
                  : ""}
              </span>
              <div className="text-muted small">
                {selectedEvent?.start
                  ? moment(selectedEvent.start).format("h:mm A")
                  : ""}{" "}
                -
                {selectedEvent?.end
                  ? moment(selectedEvent.end).format("h:mm A")
                  : ""}
              </div>
            </div>
          </div>

          {/* Location */}
          {selectedEvent?.location && (
            <div className="d-flex align-items-center mb-3">
              <i className="ti ti-map-pin text-primary fs-5 me-2" />
              <span className="fw-medium text-black">
                {selectedEvent.location}
              </span>
            </div>
          )}

          {/* Organizer */}
          {selectedEvent?.organizer && (
            <div className="d-flex align-items-center mb-3">
              <i className="ti ti-user text-primary fs-5 me-2" />
              <span className="text-black">
                Organizer: {selectedEvent.organizer}
              </span>
            </div>
          )}

          <hr />

          {/* Description (Rendering HTML safely) */}
          {selectedEvent?.description && (
            <div>
              <label className="fw-bold text-muted mb-1">Description</label>
              <div
                className="text-black"
                dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
              />
            </div>
          )}
        </div>
      </Modal>

      {/* --- 2. Create Event Modal --- */}
      <AddEditEmployeeCalendarsKHRModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSuccess={fetchEvents} // Refresh calendar after adding
      />
    </div>
  );
};

export default EmployeeCalendarsKHR;
