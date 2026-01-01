import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { CheckinCheckout, TBSelector } from "@/Store/Reducers/TBSlice";

const StatusCheckInPopup: React.FC = () => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const { CheckinCheckoutData, isCheckinCheckoutFetching } =
    useSelector(TBSelector);

  const [open, setOpen] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [totalMinutes, setTotalMinutes] = useState(0);

  /* =====================
     DERIVED STATE
  ===================== */
  const isCheckedIn =
    CheckinCheckoutData?.status === "CheckedIn";
  console.log(CheckinCheckoutData,"lplp");
  
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
     HANDLE API RESPONSE
  ===================== */
  useEffect(() => {
    if (!CheckinCheckoutData) return;

    const { status, data } = CheckinCheckoutData;
  console.log(data,"..44");
  
    if (status === "CheckedIn") {
      setCheckInTime(new Date(data?.check_in_time));
      setOpen(true);
      toast.success("Checked in successfully");
    }

    if (status === "CheckedOut") {
      setCheckInTime(null);
      setTotalMinutes(0);
      setOpen(true);
      toast.success("Checked out successfully");
    }
  }, [CheckinCheckoutData]);

  /* =====================
     WORK TIMER
  ===================== */
  useEffect(() => {
    if (!isCheckedIn || !checkInTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor(
        (now.getTime() - checkInTime.getTime()) / 60000
      );
      setTotalMinutes(diff);
    }, 60000);

    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime]);

  /* =====================
     CHECK IN / CHECK OUT
  ===================== */

  const handleAction = () => {
  if (!navigator.geolocation) {
    toast.error("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      dispatch(
        CheckinCheckout({
          Latitude: latitude,
          Longitude: longitude,
        })
      );
    },
    (error) => {
      console.error(error);
      toast.error("Unable to get your location");
    },
    { enableHighAccuracy: true }
  );
};

  // const handleAction = () => {
  //   dispatch(
  //     CheckinCheckout({
  //       Latitude: 23.0894095,
  //       Longitude: 72.5300841,
  //     })
  //   );
  // };

  /* =====================
     FORMATTERS
  ===================== */
  const formatTime = (date: Date | null) =>
    date
      ? date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--";

  const formatTotal = (min: number) =>
    `${Math.floor(min / 60)}:${(min % 60)
      .toString()
      .padStart(2, "0")}`;

  /* =====================
     UI
  ===================== */
  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* STATUS DOT */}
      <span
        onClick={() => setOpen((p) => !p)}
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: isCheckedIn ? "#28c76f" : "#ea5455",
          cursor: "pointer",
          display: "inline-block",
          boxShadow: isCheckedIn
            ? "0 0 0 4px rgba(40,199,111,0.2)"
            : "0 0 0 4px rgba(234,84,85,0.2)",
        }}
      />

      {/* POPUP */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 0,
            width: 230,
            background: "#fff",
            borderRadius: 10,
            padding: 12,
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            zIndex: 1000,
          }}
        >
          {!isCheckedIn ? (
            <button
              className="btn btn-success w-100"
              onClick={handleAction}
              disabled={isCheckinCheckoutFetching}
            >
              {isCheckinCheckoutFetching ? "Checking In..." : "Check In"}
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

              <button
                className="btn btn-warning w-100"
                onClick={handleAction}
                disabled={isCheckinCheckoutFetching}
              >
                {isCheckinCheckoutFetching
                  ? "Checking Out..."
                  : "Check Out ↪"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusCheckInPopup;
