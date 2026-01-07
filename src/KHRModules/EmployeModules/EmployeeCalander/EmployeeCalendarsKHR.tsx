import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
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
  borderColor: string;
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
      let rawData: CalendarEventAPI[] = [];

      if (response.data?.data && Array.isArray(response.data.data)) {
        rawData = response.data.data;
      } else if (
        response.data?.data &&
        typeof response.data.data === "object"
      ) {
        rawData = [response.data.data];
      }

      const mappedEvents: FCEvent[] = rawData.map((item) => {
        const startDate = moment(item.start, "YYYY-MM-DD HH:mm:ss").toDate();
        const endDate = moment(item.stop, "YYYY-MM-DD HH:mm:ss").toDate();

        // Color coding based on Privacy
        let bgColor = "#EDF2F4";
        let txtColor = "#0C4B5E";
        let brdColor = "#D1D9DD"; // Added border color variable

        if (item.privacy === "private") {
          bgColor = "#FFE0E0"; // Slightly richer background
          txtColor = "#D32F2F"; // Darker red text
          brdColor = "#FFCDCD"; // Border matching theme
        } else {
          bgColor = "#E0E4E8"; // Slightly richer gray
          txtColor = "#1F2937"; // Dark gray text
          brdColor = "#CED4DA"; // Border matching theme
        }

        return {
          id: String(item.event_id),
          title: item.name,
          start: startDate,
          end: endDate,
          // Removed 'badge', added bold, padding, border, and shadow for visibility
          className: "fw-bold px-2 py-1 border shadow-sm rounded text-truncate",
          backgroundColor: bgColor,
          borderColor: brdColor,
          textColor: txtColor,
          extendedProps: {
            location: item.location,
            description: item.description,
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
          {/* Main FullCalendar */}
          <div className="col-12">
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
                  // Increase height slightly to prevent crunching if needed
                  height="auto"
                  dayMaxEventRows={true} // Allow "more" link if too many events
                />
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

          {/* Description */}
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
        onSuccess={fetchEvents}
      />
    </div>
  );
};

export default EmployeeCalendarsKHR;
