import React, { useState, useEffect, useRef } from "react";

const StatusCheckInPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  // Close popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: any;

    if (isCheckedIn && checkInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor(
          (now.getTime() - checkInTime.getTime()) / 60000
        );
        setTotalMinutes(diff);
      }, 60000);
    }

    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime]);

  // API calls
  const handleCheckIn = async () => {
    try {
      await fetch("/api/check-in", { method: "POST" });
      const now = new Date();
      setCheckInTime(now);
      setIsCheckedIn(true);
    } catch (err) {
      console.error("Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await fetch("/api/check-out", { method: "POST" });
      setIsCheckedIn(false);
    } catch (err) {
      console.error("Check-out failed");
    }
  };

  const formatTime = (date: Date | null) =>
    date
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "--:--";

  const formatTotal = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}:${m.toString().padStart(2, "0")}`;
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Green Dot */}
      <span
        onClick={() => setOpen(!open)}
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "#28c76f",
          cursor: "pointer",
          display: "inline-block",
          boxShadow: "0 0 0 4px rgba(40,199,111,0.2)",
        }}
      />

      {/* Popup */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "18px",
            right: 0,
            width: "230px",
            background: "#fff",
            borderRadius: "10px",
            padding: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            zIndex: 1000,
          }}
        >
          {!isCheckedIn ? (
            <button
              className="btn btn-success w-100"
              onClick={handleCheckIn}
            >
              Check In
            </button>
          ) : (
            <>
              <div className="d-flex justify-content-between mb-2">
                <div>
                  <small className="text-muted">Before</small>
                  <div className="fw-bold">{formatTime(checkInTime)}</div>
                </div>
                <div>
                  <small className="text-muted">Since</small>
                  <div className="fw-bold">{formatTotal(totalMinutes)}</div>
                </div>
              </div>

              <div className="mb-2">
                <small className="text-muted">Total today</small>
                <div className="fs-5 fw-bold">
                  {formatTotal(totalMinutes)}
                </div>
              </div>

              <button
                className="btn btn-warning w-100"
                onClick={handleCheckOut}
              >
                Check Out ↪
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusCheckInPopup;
