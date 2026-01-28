import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditWorkingSchedulesModal from "./AddEditWorkingSchedulesModal";
import { toast } from "react-toastify";
import {
  getWorkingSchedules,
  deleteWorkingSchedule,
  WorkingSchedule,
  AttendanceItem,
} from "./WorkingSchedulesServices";

const WorkingSchedules = () => {
  const routes = all_routes;
  const [data, setData] = useState<WorkingSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSchedule, setSelectedSchedule] =
    useState<WorkingSchedule | null>(null);

  const dayMap: { [key: string]: string } = {
    "0": "Mon",
    "1": "Tue",
    "2": "Wed",
    "3": "Thu",
    "4": "Fri",
    "5": "Sat",
    "6": "Sun",
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getWorkingSchedules();
      setData(result);
    } catch (error) {
      toast.error("Failed to load working schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await deleteWorkingSchedule(id);
        toast.success("Deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  // --- LOGIC ---
  const formatTime = (num: number) => {
    const hrs = Math.floor(num);
    const mins = Math.round((num - hrs) * 60);
    const ampm = hrs >= 12 ? "PM" : "AM";
    const displayHrs = hrs % 12 || 12;
    return `${displayHrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")} ${ampm}`;
  };

  const getDailyTimeSignature = (slots: AttendanceItem[]) => {
    if (slots.length === 0) return "";
    const sorted = [...slots].sort((a, b) => a.hour_from - b.hour_from);
    const merged: { start: number; end: number }[] = [];
    if (sorted.length > 0) {
      let current = { start: sorted[0].hour_from, end: sorted[0].hour_to };
      for (let i = 1; i < sorted.length; i++) {
        const next = sorted[i];
        if (next.hour_from <= current.end) {
          current.end = Math.max(current.end, next.hour_to);
        } else {
          merged.push(current);
          current = { start: next.hour_from, end: next.hour_to };
        }
      }
      merged.push(current);
    }
    return merged
      .map((m) => `${formatTime(m.start)} - ${formatTime(m.end)}`)
      .join(", ");
  };

  const renderScheduleSummary = (attendances: AttendanceItem[]) => {
    if (!attendances || attendances.length === 0)
      return (
        <div className="text-muted small fst-italic">
          No specific time slots defined.
        </div>
      );

    const dayGroups: { [key: string]: AttendanceItem[] } = {};
    attendances.forEach((item) => {
      const d = String(item.dayofweek);
      if (!dayGroups[d]) dayGroups[d] = [];
      dayGroups[d].push(item);
    });

    const scheduleSignatures: { [signature: string]: string[] } = {};
    Object.keys(dayGroups).forEach((dayKey) => {
      const signature = getDailyTimeSignature(dayGroups[dayKey]);
      if (!scheduleSignatures[signature]) scheduleSignatures[signature] = [];
      scheduleSignatures[signature].push(dayKey);
    });

    return (
      <div className="d-flex flex-column gap-2 mt-3">
        {Object.entries(scheduleSignatures)
          .slice(0, 3)
          .map(([timings, days], idx) => {
            days.sort((a, b) => Number(a) - Number(b));
            let dayLabel = "";
            const isConsecutive = days.every(
              (d, i) => i === 0 || Number(d) === Number(days[i - 1]) + 1,
            );
            if (days.length > 2 && isConsecutive) {
              dayLabel = `${dayMap[days[0]]} - ${dayMap[days[days.length - 1]]}`;
            } else {
              dayLabel = days.map((d) => dayMap[d]).join(", ");
            }

            return (
              <div
                key={idx}
                className="d-flex justify-content-between align-items-center bg-white bg-opacity-75 px-3 py-2 rounded border border-light shadow-sm"
              >
                <span className="fw-bold text-dark small">{dayLabel}</span>
                <span className="text-primary fw-bold small">{timings}</span>
              </div>
            );
          })}
        {Object.keys(scheduleSignatures).length > 3 && (
          <div className="text-center text-muted small mt-1">
            + {Object.keys(scheduleSignatures).length - 3} more variations
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div onClick={() => setSelectedSchedule(null)}>
          <CommonHeader
            title="Working Schedules"
            parentMenu="HR"
            activeMenu="Schedules"
            routes={routes}
            buttonText="Add Schedule"
            modalTarget="#add_working_schedule"
          />
        </div>

        {loading ? (
          <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          // RESPONSIVE GRID CONFIGURATION
          // col-12: 1 per row (Mobile)
          // col-md-6: 2 per row (Tablet)
          // col-lg-4: 3 per row (Small Laptop)
          // col-xxl-3: 4 per row (Large Monitor)
          <div className="row g-3 g-xl-4">
            {data.map((schedule) => {
              const isFlexible = schedule.flexible_hours;
              const accentColor = isFlexible ? "#00d27a" : "#4361ee";

              return (
                <div
                  className="col-12 col-md-6 col-lg-4 col-xxl-3"
                  key={schedule.id}
                >
                  <div
                    className="card h-100 border-0 shadow-sm position-relative hover-card"
                    style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                  >
                    {/* Overflow Hidden Container for Decorations */}
                    <div
                      className="position-absolute w-100 h-100 start-0 top-0 overflow-hidden rounded"
                      style={{ pointerEvents: "none" }}
                    >
                      <i
                        className={`ti ${isFlexible ? "ti-calendar-time" : "ti-calendar-stats"} position-absolute text-muted opacity-10`}
                        style={{
                          fontSize: "10rem",
                          right: "-30px",
                          top: "-20px",
                          opacity: 0.05,
                          transform: "rotate(10deg)",
                        }}
                      ></i>
                      <div
                        className="position-absolute start-0 top-0 bottom-0"
                        style={{ width: "5px", background: accentColor }}
                      ></div>
                    </div>

                    <div className="card-body p-3 p-xl-4 position-relative">
                      {/* Header */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div style={{ maxWidth: "80%" }}>
                          <h5
                            className="fw-bold text-dark mb-2 text-truncate"
                            title={schedule.name}
                          >
                            {schedule.name}
                          </h5>
                          <div className="d-flex flex-wrap gap-2">
                            {isFlexible ? (
                              <span className="badge bg-soft-success text-success border border-success border-opacity-25 px-2 py-1">
                                <i className="ti ti-infinity me-1"></i>Flexible
                              </span>
                            ) : (
                              <span className="badge bg-soft-primary text-primary border border-primary border-opacity-25 px-2 py-1">
                                <i className="ti ti-clock me-1"></i>Fixed
                              </span>
                            )}
                            {schedule.is_night_shift && (
                              <span className="badge bg-dark text-white px-2 py-1">
                                <i className="ti ti-moon-stars me-1"></i>Night
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Menu Actions */}
                        <div className="dropdown">
                          <button
                            className="btn btn-icon btn-sm rounded-circle hover-bg-light"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{
                              width: "32px",
                              height: "32px",
                              padding: 0,
                              border: "none",
                            }}
                          >
                            <i className="ti ti-dots-vertical fs-3 text-dark"></i>
                          </button>

                          {/* Dropdown Menu */}
                          <ul className="dropdown-menu dropdown-menu-end shadow border-0 p-2">
                            <li>
                              <Link
                                className="dropdown-item py-2 rounded d-flex align-items-center hover-primary"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#add_working_schedule"
                                onClick={() => setSelectedSchedule(schedule)}
                              >
                                <i
                                  className="ti ti-edit me-2 text-primary"
                                  style={{ fontSize: "22px" }}
                                ></i>
                                <span className="fw-medium">Edit</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item py-2 rounded text-danger d-flex align-items-center mt-1 hover-danger"
                                to="#"
                                onClick={() => handleDelete(schedule.id!)}
                              >
                                <i
                                  className="ti ti-trash me-2"
                                  style={{ fontSize: "22px" }}
                                ></i>
                                <span className="fw-medium">Delete</span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="row g-2 g-xl-3 mb-4 mt-2">
                        <div className="col-6">
                          <div className="d-flex align-items-center p-3 rounded bg-light border border-light h-100">
                            <div
                              className="avatar bg-white shadow-sm rounded flex-shrink-0 me-3 d-flex align-items-center justify-content-center"
                              style={{ width: "45px", height: "45px" }}
                            >
                              <i className="ti ti-clock-hour-4 text-primary fs-3"></i>
                            </div>
                            <div>
                              <span
                                className="d-block text-muted small text-uppercase fw-bold"
                                style={{ fontSize: "10px" }}
                              >
                                Weekly
                              </span>
                              <span className="fw-bold text-dark fs-14">
                                {schedule.full_time_required_hours} Hours
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center p-3 rounded bg-light border border-light h-100">
                            <div
                              className="avatar bg-white shadow-sm rounded flex-shrink-0 me-3 d-flex align-items-center justify-content-center"
                              style={{ width: "45px", height: "45px" }}
                            >
                              <i className="ti ti-world text-info fs-3"></i>
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <span
                                className="d-block text-muted small text-uppercase fw-bold"
                                style={{ fontSize: "10px" }}
                              >
                                Zone
                              </span>
                              <span
                                className="fw-bold text-dark fs-14 text-truncate d-block"
                                title={schedule.tz}
                              >
                                {schedule.tz.split("/")[1] || schedule.tz}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Details Box */}
                      <div
                        className="bg-soft-secondary bg-opacity-25 rounded p-3 position-relative"
                        style={{ minHeight: "80px" }}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span
                            className="text-uppercase fw-bold text-muted small"
                            style={{ letterSpacing: "0.5px" }}
                          >
                            Shift Pattern
                          </span>
                        </div>

                        {isFlexible ? (
                          <div className="d-flex align-items-center py-3">
                            <span className="text-success fw-bold d-flex align-items-center fs-13">
                              <i className="ti ti-circle-check-filled me-2 fs-4"></i>{" "}
                              No fixed slots required
                            </span>
                          </div>
                        ) : (
                          renderScheduleSummary(schedule.attendances)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .hover-bg-light:hover {
            background-color: #f8f9fa !important;
        }
      `}</style>

      <AddEditWorkingSchedulesModal
        onSuccess={fetchData}
        onClose={() => setSelectedSchedule(null)}
        data={selectedSchedule}
      />
    </div>
  );
};

export default WorkingSchedules;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { all_routes } from "../../../router/all_routes";
// import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// import AddEditWorkingSchedulesModal from "./AddEditWorkingSchedulesModal";

// import {
//   getWorkingSchedules,
//   deleteWorkingSchedule,
//   WorkingSchedule as WorkingScheduleType,
//   APIWorkingSchedule,
// } from "./WorkingSchedulesServices";

// const WorkingSchedules = () => {
//   const routes = all_routes;
//   const [data, setData] = useState<WorkingScheduleType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedSchedule, setSelectedSchedule] =
//     useState<WorkingScheduleType | null>(null);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const result = await getWorkingSchedules();
//       const safeResult = Array.isArray(result) ? result : [];

//       console.log("API Result:", safeResult); // Debugging log

//       const mappedData: WorkingScheduleType[] = safeResult.map(
//         (item: APIWorkingSchedule) => {
//           // Extract the first attendance line for the Edit Modal (if available)
//           const firstDetail =
//             item.attendance_ids && item.attendance_ids.length > 0
//               ? item.attendance_ids[0]
//               : null;

//           return {
//             id: String(item.id),
//             key: String(item.id),
//             name: typeof item.name === "string" ? item.name : "-",
//             flexible_hours: item.flexible_hours || false,
//             is_night_shift: item.is_night_shift || false,
//             full_time_required_hours: item.full_time_required_hours || 0,
//             tz: typeof item.tz === "string" ? item.tz : "-",

//             // Map details for the Edit Modal
//             dayofweek: firstDetail ? String(firstDetail.dayofweek) : "0",
//             day_period: firstDetail ? firstDetail.day_period : "morning",
//             hour_from: firstDetail ? firstDetail.hour_from : 8.0,
//             hour_to: firstDetail ? firstDetail.hour_to : 17.0,
//             // Assuming duration/work_entry_type might be missing in JSON, provide defaults
//             duration_days: 1.0,
//             work_entry_type_id: 0,
//           };
//         }
//       );

//       setData(mappedData);
//     } catch (error) {
//       console.error("Failed to load schedules", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (window.confirm("Are you sure you want to delete this schedule?")) {
//       await deleteWorkingSchedule(id);
//       fetchData();
//     }
//   };

//   const openModal = (record: WorkingScheduleType | null) => {
//     setSelectedSchedule(record);
//     const modal = document.getElementById("add_working_schedule");
//     // @ts-ignore
//     if (modal && window.bootstrap) {
//       // @ts-ignore
//       const modalInstance = new window.bootstrap.Modal(modal);
//       modalInstance.show();
//     }
//   };

//   const columns = [
//     {
//       title: "Schedule Name",
//       dataIndex: "name",
//       render: (text: string) => <h6 className="fs-14 fw-medium">{text}</h6>,
//       sorter: (a: WorkingScheduleType, b: WorkingScheduleType) =>
//         a.name.length - b.name.length,
//     },
//     {
//       title: "Avg Hours",
//       dataIndex: "full_time_required_hours",
//     },
//     {
//       title: "Flexible?",
//       dataIndex: "flexible_hours",
//       render: (val: boolean) => (
//         <span
//           className={`badge ${val ? "bg-success-light" : "bg-danger-light"}`}
//         >
//           {val ? "Yes" : "No"}
//         </span>
//       ),
//     },
//     {
//       title: "Timezone",
//       dataIndex: "tz",
//     },
//     {
//       title: "Actions",
//       dataIndex: "id",
//       render: (_: any, record: WorkingScheduleType) => (
//         <div className="action-icon d-inline-flex">
//           {/* Using simple Link with onClick to handle Modal state properly */}
//           <Link
//             to="#"
//             className="me-2"
//             data-bs-toggle="modal"
//             data-bs-target="#add_working_schedule"
//             onClick={() => setSelectedSchedule(record)}
//           >
//             <i className="ti ti-edit text-blue" />
//           </Link>
//           <Link to="#" onClick={() => handleDelete(record.id!)}>
//             <i className="ti ti-trash text-danger" />
//           </Link>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="main-wrapper">
//         <div className="page-wrapper">
//           <div className="content">
//             <div onClick={() => setSelectedSchedule(null)}>
//               <CommonHeader
//                 title="Working Schedules"
//                 parentMenu="HR"
//                 activeMenu="Schedules"
//                 routes={routes}
//                 buttonText="Add Schedule"
//                 modalTarget="#add_working_schedule"
//               />
//             </div>
//             <div className="card">
//               <div className="card-body">
//                 {loading ? (
//                   <div className="d-flex justify-content-center p-5">
//                     <div className="spinner-border text-primary" role="status">
//                       <span className="visually-hidden">Loading...</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <DatatableKHR
//                     data={data}
//                     columns={columns}
//                     selection={true}
//                     textKey="name"
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         <AddEditWorkingSchedulesModal
//           onSuccess={fetchData}
//           data={selectedSchedule}
//         />
//       </div>
//     </>
//   );
// };

// export default WorkingSchedules;
