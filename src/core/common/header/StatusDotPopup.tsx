import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { submitAttendance } from "./checkinCheckOutService";

const StatusCheckInPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  /* =====================
     CLOSE ON OUTSIDE CLICK
  ===================== */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* =====================
     TIMER LOGIC
  ===================== */
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

  /* =====================
     GET CURRENT LOCATION
  ===================== */
  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true }
      );
    });
  };

  /* =====================
     CHECK-IN
  ===================== */
  const handleCheckIn = async () => {
    try {
      const { latitude, longitude } = await getCurrentLocation();
      console.log(latitude, longitude,"Submitting attendance...");
      
      // await submitAttendance(latitude, longitude);
      await submitAttendance(23.089409500000, 72.530084100000);


      setCheckInTime(new Date());
      setIsCheckedIn(true);
      toast.success("Checked in successfully");
    } catch (err) {
      console.error(err);
      toast.error("Check-in failed");
    }
  };

  /* =====================
     CHECK-OUT
  ===================== */
  const handleCheckOut = async () => {
    try {
      const { latitude, longitude } = await getCurrentLocation();
      // await submitAttendance(latitude, longitude);
      await submitAttendance(23.089409500000, 72.530084100000);


      setIsCheckedIn(false);
      setCheckInTime(null);
      setTotalMinutes(0);
      toast.success("Checked out successfully");
    } catch (err) {
      console.error(err);
      toast.error("Check-out failed");
    }
  };

  /* =====================
     FORMATTERS
  ===================== */
  const formatTime = (date: Date | null) =>
    date
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "--:--";

  const formatTotal = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}:${m.toString().padStart(2, "0")}`;
  };

  /* =====================
     UI
  ===================== */
  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* STATUS DOT */}
      <span
        onClick={() => setOpen(!open)}
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: isCheckedIn ? "#28c76f" : "#ea5455",
          cursor: "pointer",
          display: "inline-block",
          boxShadow: "0 0 0 4px rgba(40,199,111,0.2)",
        }}
      />

      {/* POPUP */}
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
                  <small className="text-muted">Check-in</small>
                  <div className="fw-bold">
                    {formatTime(checkInTime)}
                  </div>
                </div>
                <div>
                  <small className="text-muted">Since</small>
                  <div className="fw-bold">
                    {formatTotal(totalMinutes)}
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <small className="text-muted">Total today</small>
                <div className=" fw-bold">
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
