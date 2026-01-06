import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { DatePicker, TimePicker } from "antd";
import { toast } from "react-toastify";
import { createCalendarEvent, CreateEventPayload } from "./CalendarService";

// 1. Import Dayjs and the Duration plugin
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";

// 2. Extend Dayjs plugins
dayjs.extend(duration);
dayjs.extend(customParseFormat);

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const AddEditEmployeeCalendarsKHRModal: React.FC<Props> = ({
  show,
  onHide,
  onSuccess,
}) => {
  // Form State
  const [name, setName] = useState("");

  // 3. State types set to Dayjs | null to match Ant Design V5
  const [eventDate, setEventDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);

  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<"private" | "public">("private");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fix for Ant Design popup scrolling issues inside Bootstrap modal
  const getModalContainer = () =>
    document.getElementById("add_event_modal_content") || document.body;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!name || !eventDate || !startTime || !endTime) {
      toast.error("Please fill in all required fields (Name, Date, Times)");
      return;
    }

    // Validate End Time is after Start Time (comparing just the time components)
    // We create temporary objects on the same day to compare times accurately
    const tempStart = dayjs().hour(startTime.hour()).minute(startTime.minute());
    const tempEnd = dayjs().hour(endTime.hour()).minute(endTime.minute());

    if (tempEnd.isBefore(tempStart)) {
      toast.error("End time must be after start time");
      return;
    }

    setIsSubmitting(true);

    try {
      // 4. Construct Start and End DateTime objects
      // Dayjs is immutable, so we chain methods to create new instances
      const startDateTime = eventDate
        .hour(startTime.hour())
        .minute(startTime.minute())
        .second(0);

      const endDateTime = eventDate
        .hour(endTime.hour())
        .minute(endTime.minute())
        .second(0);

      // 5. Calculate Duration
      const diff = endDateTime.diff(startDateTime);
      const durationHours = dayjs.duration(diff).asHours();

      // 6. Create Payload with specific format "DD/MM/YYYY HH:mm:ss"
      const payload: CreateEventPayload = {
        name: name,
        start: startDateTime.format("DD/MM/YYYY HH:mm:ss"),
        stop: endDateTime.format("DD/MM/YYYY HH:mm:ss"),
        location: location,
        duration: Number(durationHours.toFixed(2)), // e.g., 1.5
        description: description,
        privacy: privacy,
      };

      await createCalendarEvent(payload);

      toast.success("Event created successfully");
      resetForm();
      onSuccess(); // Refresh the parent calendar
      onHide(); // Close modal
    } catch (error) {
      console.error("Error creating event", error);
      toast.error("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEventDate(null);
    setStartTime(null);
    setEndTime(null);
    setLocation("");
    setDescription("");
    setPrivacy("private");
  };

  return (
    <Modal show={show} onHide={onHide} centered id="add_event_modal">
      <div id="add_event_modal_content">
        <div className="modal-header">
          <h4 className="modal-title">Add New Event</h4>
          <button type="button" className="btn-close" onClick={onHide}></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="row">
              {/* Event Name */}
              <div className="col-12 mb-3">
                <label className="form-label">
                  Event Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Meeting with Team"
                />
              </div>

              {/* Event Date */}
              <div className="col-12 mb-3">
                <label className="form-label">
                  Event Date <span className="text-danger">*</span>
                </label>
                <div className="input-icon-end position-relative">
                  <DatePicker
                    className="form-control w-100"
                    format="DD-MM-YYYY"
                    value={eventDate}
                    onChange={(date) => setEventDate(date)}
                    getPopupContainer={getModalContainer}
                    placeholder="Select Date"
                  />
                  <span className="input-icon-addon">
                    <i className="ti ti-calendar text-gray-7" />
                  </span>
                </div>
              </div>

              {/* Start Time */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Start Time <span className="text-danger">*</span>
                </label>
                <div className="input-icon-end position-relative">
                  <TimePicker
                    className="form-control w-100"
                    format="h:mm A"
                    use12Hours
                    value={startTime}
                    onChange={(time) => setStartTime(time)}
                    getPopupContainer={getModalContainer}
                    placeholder="Select Start Time"
                  />
                  <span className="input-icon-addon">
                    <i className="ti ti-clock text-gray-7" />
                  </span>
                </div>
              </div>

              {/* End Time */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  End Time <span className="text-danger">*</span>
                </label>
                <div className="input-icon-end position-relative">
                  <TimePicker
                    className="form-control w-100"
                    format="h:mm A"
                    use12Hours
                    value={endTime}
                    onChange={(time) => setEndTime(time)}
                    getPopupContainer={getModalContainer}
                    placeholder="Select End Time"
                  />
                  <span className="input-icon-addon">
                    <i className="ti ti-clock text-gray-7" />
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="col-12 mb-3">
                <label className="form-label">Event Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Conference Room"
                />
              </div>

              {/* Privacy */}
              <div className="col-12 mb-3">
                <label className="form-label">Privacy</label>
                <select
                  className="form-select"
                  value={privacy}
                  onChange={(e) =>
                    setPrivacy(e.target.value as "private" | "public")
                  }
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>

              {/* Description */}
              <div className="col-12 mb-0">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter event details..."
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light me-2"
              onClick={onHide}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Add Event"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddEditEmployeeCalendarsKHRModal;
