import { useState, useRef } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Calendar } from "primereact/calendar";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import { DatePicker, TimePicker } from "antd";
import type { Nullable } from "primereact/ts-helpers";
import PredefinedDateRanges from "../../../core/common/datePicker";
import Modal from 'react-bootstrap/Modal';
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import React from "react";

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error if needed
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong. Please try again later.</div>;
    }
    return this.props.children;
  }
}

// Event interface
interface CalendarEvent {
  title: string;
  className: string;
  backgroundColor: string;
  textColor: string;
  start: string;
  end?: string;
}

const Calendars = () => {
  const routes = all_routes;

  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [eventDetails, setEventDetails] = useState<string>("");

  const getModalContainer = () => {
    const modalElement = document.getElementById('modal-datepicker');
    return modalElement ? modalElement : document.body;
  };
  const getModalContainer2 = () => {
    const modalElement = document.getElementById('modal_datepicker');
    return modalElement ? modalElement : document.body;
  };
  const calendarRef = useRef< | null>(null);
  const [date, setDate] = useState<Nullable<Date>>(null);

  const handleEventClick = (info: any) => {
    setEventDetails(info.event.title);
    setShowEventDetailsModal(true);
  };

  const handleEventDetailsClose = () => setShowEventDetailsModal(false);

  const events: CalendarEvent[] = [
    {
      title: 'Meeting with Team Dev',
      className: 'badge badge-pink-transparent',
      backgroundColor: '#FFEDF6',
      textColor: "#FD3995",
      start: new Date(Date.now() - 168000000).toJSON().slice(0, 10),
      end: new Date(Date.now() - 168000000).toJSON().slice(0, 10),
    },
    {
      title: 'UI/UX Team...',
      className: 'badge badge-secondary-transparent',
      backgroundColor: '#EDF2F4',
      textColor: "#0C4B5E",
      start: new Date(Date.now() + 338000000).toJSON().slice(0, 10)
    },
    {
      title: 'Data Update...',
      className: 'badge badge-purple-transparent',
      backgroundColor: '#F7EEF9',
      textColor: "#AB47BC",
      start: new Date(Date.now() - 338000000).toJSON().slice(0, 10)
    },
    {
      title: 'Meeting with Team Dev',
      className: 'badge badge-dark-transparent',
      backgroundColor: '#E8E9EA',
      textColor: "#212529",
      start: new Date(Date.now() + 68000000).toJSON().slice(0, 10)
    },
    {
      title: 'Design System',
      className: 'badge badge-danger-transparent',
      backgroundColor: '#FAE7E7',
      textColor: "#E70D0D",
      start: new Date(Date.now() + 88000000).toJSON().slice(0, 10)
    },
  ];

  return (
    <ErrorBoundary fallback={<div>Failed to load calendar. Please refresh the page.</div>}>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
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
                  <li className="breadcrumb-item active" aria-current="page">
                    Calendar
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              <div className="me-2 mb-2">
                <div className="input-icon-end position-relative">
                  <PredefinedDateRanges />
                  <span className="input-icon-addon">
                    <i className="ti ti-chevron-down" />
                  </span>
                </div>
              </div>
              <div className="me-2 mb-2">
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-file-export me-1" />
                    Export
                  </Link>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        <i className="ti ti-file-type-pdf me-1" />
                        Export as PDF
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        <i className="ti ti-file-type-xls me-1" />
                        Export as Excel{" "}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mb-2">
                <Link
                  to="#"
                  data-bs-toggle="modal" data-inert={true}
                  data-bs-target="#add_event"
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-circle-plus me-2" />
                  Create
                </Link>
              </div>
              <div className="ms-2 head-icons">
                <CollapseHeader />
              </div>
            </div>
          </div>
          <div className="row">
            {/* Calendar Sidebar */}
            <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
             
            </div>
            {/* /Calendar Sidebar */}
            <div className="col-xxl-9 col-xl-8 theiaStickySidebar">
              <div className="stickybar">
               
              </div>
            </div>
          </div>
        </div>
        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0">2014 - 2025 © SmartHR.</p>
          <p>
            Designed &amp; Developed By{" "}
            <Link to="#" className="text-primary">
              Dreams
            </Link>
          </p>
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Event */}
      <Modal show={showEventDetailsModal} onHide={handleEventDetailsClose}>
        <div className="modal-header bg-dark modal-bg">
          <div className="modal-title text-white">
            <span id="eventTitle">{eventDetails}</span>
          </div>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={handleEventDetailsClose}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="modal-body">
          <p className="d-flex align-items-center fw-medium text-black mb-3">
            <i className="ti ti-calendar-check text-default me-2" />
            26 Jul,2024 to 31 Jul,2024
          </p>
          <p className="d-flex align-items-center fw-medium text-black mb-3">
            <i className="ti ti-calendar-check text-default me-2" />
            11:00 AM to 12:15 PM
          </p>
          <p className="d-flex align-items-center fw-medium text-black mb-3">
            <i className="ti ti-map-pin-bolt text-default me-2" />
            Las Vegas, US
          </p>
          <p className="d-flex align-items-center fw-medium text-black mb-0">
            <i className="ti ti-calendar-check text-default me-2" />A recurring
            or repeating event is simply any event that you will occur more than
            once on your calendar.
          </p>
        </div>
      </Modal>
      {/* /Event */}

      {/* Add New Event */}
      <div className="modal fade" id="add_event">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add New Event</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Event Name</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Event Date</label>
                      <div className="input-icon-end position-relative">
                        <DatePicker
                          className="form-control datetimepicker"
                          format={{
                            format: "DD-MM-YYYY",
                            type: "mask",
                          }}
                          getPopupContainer={getModalContainer}
                          placeholder="DD-MM-YYYY"
                        />
                        <span className="input-icon-addon">
                          <i className="ti ti-calendar text-gray-7" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Start Time</label>
                      <div className="input-icon-end position-relative">
                        <TimePicker getPopupContainer={getModalContainer2} use12Hours placeholder="Choose" format="h:mm A" className="form-control timepicker" />
                        <span className="input-icon-addon">
                          <i className="ti ti-clock text-gray-7" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">End Time</label>
                      <div className="input-icon-end position-relative">
                        <TimePicker getPopupContainer={getModalContainer2} use12Hours placeholder="Choose" format="h:mm A" className="form-control timepicker" />
                        <span className="input-icon-addon">
                          <i className="ti ti-clock text-gray-7" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Event Location</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="mb-0">
                      <label className="form-label">Descriptions</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add New Event */}
    </ErrorBoundary>
  );
};

export default Calendars;
