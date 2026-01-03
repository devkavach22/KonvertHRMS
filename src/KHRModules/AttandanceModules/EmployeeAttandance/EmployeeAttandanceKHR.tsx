import { Link } from "react-router-dom";
import { all_routes } from "@/router/all_routes";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import attendanceData from "./empoloyeeAttendanceCard.json";

import { useEffect, useState } from "react";
import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";
import SummaryCards from "@/CommonComponent/CommonAttendanceStatus/SummaryCards";
import WorkStatsWithTimeline from "./WorksWithTimeline";
import AttendanceQueryModal from "./AttendanceQueryModal";
import {
  AdminWorkingHours,
  CheckinCheckout,
  EmployeeAttendanceApi,
  TBSelector,
  updateState,
} from "@/Store/Reducers/TBSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

interface AttendanceAdminData {
  EndDate: any;
  StartDate: any;
  attendance_id: number;
  Employee: string;
  Image: string;
  Role: string;
  Status: string;
  CheckIn: string;
  CheckOut: string;
  Break: string;
  Late: string;
  ProductionHours: string;
  employeeId: number;
}

// Define a type for employee attendance
interface EmployeeAttendance {
  id: string;
  key: string;
  Employee_Name: string;
  Attendance_Date: string;
  Created_Date: string;
  Status: string;
}

const EmployeeAttendanceKHR = () => {
  const routes = all_routes;

  // const [data, setData] = useState<EmployeeAttendance[]>([]);
  const [data, setData] = useState<AttendanceAdminData[]>([]);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [summaryCards, setSummaryCards] = useState<any[]>([]);

  const {
    isEmployeeAttendanceApi,
    isEmployeeAttendanceApiFetching,
    EmployeeAttendanceApiData,
    AdminWorkingHoursData,
    isAdminWorkingHours,
  } = useSelector(TBSelector);

  const [selectedAttendancee, setSelectedAttendancee] = useState<any>(null);

  const [selectedAttendance, setSelectedAttendance] =
    useState<EmployeeAttendance | null>(null);

  const { CheckinCheckoutData, isCheckinCheckoutFetching } =
    useSelector(TBSelector);

  if (!CheckinCheckoutData) return null;

  const isCheckedIn = CheckinCheckoutData.status === "CheckedIn";
  const datass = CheckinCheckoutData.data;

  console.log(datass, "datatat");

  const formatDateOnly = (dateTime: string | false) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime.replace(" ", "T"));
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const formatTime = (dateTime: string | false) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime.replace(" ", "T"));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  console.log(AdminWorkingHoursData, "AdminWorkingHoursData");
  const formatDate = (dateStr: string) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString([], {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

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

  useEffect(() => {
    dispatch(AdminWorkingHours());
    dispatch(EmployeeAttendanceApi());
  }, []);
  useEffect(() => {
    if (isEmployeeAttendanceApi) {
      setEmployeeId(EmployeeAttendanceApiData?.meta?.employee_id || null);

      const mappedData: AttendanceAdminData[] =
        EmployeeAttendanceApiData?.data?.map((item: any) => {
          return {
            Image: item.employee?.avatar || "avatar-1.jpg",
            Role: item.employee?.role || "Employee",
            Status: item.check_in ? "Present" : "Absent",
            StartDate: formatDateOnly(item.check_in),
            EndDate: item.check_out ? formatDateOnly(item.check_out) : "-",
            CheckIn: formatTime(item.check_in),
            CheckOut: formatTime(item.check_out),
            LateTime: item.late_time_display,
            Late: item.is_late_in ? "Yes" : "No",
            Overtime:
              typeof item.overtime_hours === "number"
                ? item.overtime_hours.toFixed(2)
                : item.overtime_hours
                ? String(item.overtime_hours)
                : "0",
            ProductionHours:
              typeof item.worked_hours === "number"
                ? item.worked_hours.toFixed(2)
                : item.worked_hours
                ? String(item.worked_hours)
                : "0",
          };
        });
      setData(mappedData);
      dispatch(updateState({ isEmployeeAttendanceApi: false }));
    }
  }, [isEmployeeAttendanceApi, isEmployeeAttendanceApiFetching]);

  useEffect(() => {
    if (!isAdminWorkingHours || !AdminWorkingHoursData?.data) return;

    const { today, week, month } = AdminWorkingHoursData.data;

    const cards = [
      {
        icon: "ti ti-clock-stop",
        bg: "primary",
        title: "Total Hours Today",
        value: today.worked_hours.toFixed(2),
        total: today.allowed_hours.toString(),
        trend: `${today.percentage}% Today`,
        trendType: today.percentage >= 0 ? "up" : "down",
      },
      {
        icon: "ti ti-clock-up",
        bg: "dark",
        title: "Total Hours This Week",
        value: week.worked_hours.toFixed(2),
        total: week.allowed_hours.toString(),
        trend: `${week.percentage}% This Week`,
        trendType: week.percentage >= 0 ? "up" : "down",
      },
      {
        icon: "ti ti-calendar-up",
        bg: "info",
        title: "Total Hours This Month",
        value: month.worked_hours.toFixed(2),
        total: month.allowed_hours.toString(),
        trend: `${month.percentage}% This Month`,
        trendType: month.percentage >= 0 ? "up" : "down",
      },
      {
        icon: "ti ti-calendar-star",
        bg: "pink",
        title: "Break Hours This Month",
        value: month.total_break_hours?.toFixed(2) || "0",
        total: month.allowed_hours.toString(),
        trend: "Break Usage",
        trendType: "down",
      },
    ];

    setSummaryCards(cards);

    dispatch(updateState({ isAdminWorkingHours: false }));
  }, [isAdminWorkingHours]);

  const columns = [
    {
      title: "Start Date",
      dataIndex: "StartDate",
      sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
        a.StartDate.localeCompare(b.StartDate),
    },
    {
      title: "End Date",
      dataIndex: "EndDate",
      sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
        a.EndDate.localeCompare(b.EndDate),
    },

    {
      title: "Check In",
      dataIndex: "CheckIn",
      sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
        a.CheckIn.length - b.CheckIn.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string, record: AttendanceAdminData) => (
        <span
          className={`badge ${
            text === "Present"
              ? "badge-success-transparent"
              : "badge-danger-transparent"
          } d-inline-flex align-items-center`}
        >
          <i className="ti ti-point-filled me-1" />
          {record.Status}
        </span>
      ),
      sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
        a.Status.length - b.Status.length,
    },
    {
      title: "Check Out",
      dataIndex: "CheckOut",
      sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
        a.CheckOut.length - b.CheckOut.length,
    },
    {
      title: "Late",
      dataIndex: "Late",
      sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
        a.Late.length - b.Late.length,
    },
    {
      title: "Late Time",
      dataIndex: "LateTime",
      // sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
      // a.Late Time.length - b.Late Time.length,
    },
    {
      title: "Overtime",
      dataIndex: "Overtime",
      // sorter: (a: AttendanceAdminData, b: AttendanceAdminData) => a.Overtime.length - b.Overtime.length,
    },

    {
      title: "Production Hours",
      dataIndex: "ProductionHours",
      render: (_text: string, record: AttendanceAdminData) => (
        <span
          className={`badge d-inline-flex align-items-center badge-sm ${
            parseFloat(record.ProductionHours) < 8
              ? "badge-danger"
              : parseFloat(record.ProductionHours) >= 8 &&
                parseFloat(record.ProductionHours) <= 9
              ? "badge-success"
              : "badge-info"
          }`}
        >
          <i className="ti ti-clock-hour-11 me-1"></i>
          {record.ProductionHours}
        </span>
      ),
      sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
        a.ProductionHours.length - b.ProductionHours.length,
    },
    {
      title: "",
      dataIndex: "actions",
      render: () => (
        <div className="action-icon d-inline-flex">
          <button
            type="button"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#edit_attendance"
            aria-label="Edit attendance"
          >
            <i className="ti ti-edit" />
          </button>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_: any, record: AttendanceAdminData) => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => {
            setSelectedAttendancee(record);
            setShowQueryModal(true);
          }}
        >
          Raise Query
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => setSelectedAttendance(null)}>
            <CommonHeader
              title="Employee Attendance"
              parentMenu="Employee"
              activeMenu="Employee Attendance"
              routes={routes}
              rightActions={
                <>
                  {/* View Switch */}
                  <div className="d-flex border bg-white rounded p-1">
                    <Link
                      to={all_routes.attendaceEmployeeKHR}
                      className="btn btn-icon btn-sm me-1"
                    >
                      <i className="ti ti-brand-days-counter" />
                    </Link>
                    <Link
                      to={all_routes.attendanceAdminKHR}
                      className="btn btn-icon btn-sm active bg-primary text-white"
                    >
                      <i className="ti ti-calendar-event" />
                    </Link>
                  </div>

                  {/* Export */}
                  <div className="dropdown">
                    <button
                      className="btn btn-white dropdown-toggle d-flex align-items-center"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-file-export me-1" />
                      Export
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end p-3">
                      <li>
                        <button className="dropdown-item">
                          <i className="ti ti-file-type-pdf me-1" /> PDF
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item">
                          <i className="ti ti-file-type-xls me-1" /> Excel
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Report */}
                  <button
                    className="btn btn-primary d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#attendance_report"
                  >
                    <i className="ti ti-file-analytics me-2" />
                    Report
                  </button>
                </>
              }
            />
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="mb-3 text-center">
                    <h6 className="fw-medium text-gray-5 mb-2">
                      {CheckinCheckoutData.user?.greeting},{" "}
                      {CheckinCheckoutData.user?.name}
                    </h6>

                    <h4>
                      {datass?.check_in_time
                        ? formatTime(datass.check_in_time)
                        : "--:--"}
                    </h4>
                    <small>
                      {datass?.check_in_time
                        ? formatDate(datass.check_in_time)
                        : "Not Checked In Yet"}
                    </small>
                  </div>

                  <div
                    className="attendance-circle-progress mx-auto mb-3"
                    data-value={65}
                  >
                    <span className="progress-left">
                      <span className="progress-bar border-success" />
                    </span>
                    <span className="progress-right">
                      <span className="progress-bar border-success" />
                    </span>
                    <div className="avatar avatar-xxl avatar-rounded">
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-23.jpg"
                        alt="Logo"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="badge badge-md badge-primary mb-3">
                      Production:{" "}
                      {datass?.worked_hours ||
                        (CheckinCheckoutData?.status === "CheckedIn"
                          ? "In Progress"
                          : "0.00")}{" "}
                      hrs
                    </div>

                    <h6 className="fw-medium d-flex align-items-center justify-content-center mb-3">
                      <i className="ti ti-fingerprint text-primary me-1" />
                      {datass?.check_out_time
                        ? `Checked Out at ${formatTime(datass.check_out_time)}`
                        : datass?.check_in_time
                        ? `Punch In at ${formatTime(datass.check_in_time)}`
                        : "Not Checked In Yet"}
                    </h6>

                    <button
                      className={`btn w-100 ${
                        isCheckedIn ? "btn-warning" : "btn-success"
                      }`}
                      onClick={handleAction}
                      disabled={isCheckinCheckoutFetching}
                    >
                      {isCheckinCheckoutFetching
                        ? isCheckedIn
                          ? "Checking Out..."
                          : "Checking In..."
                        : isCheckedIn
                        ? "Punch Out ↪"
                        : "Punch In"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-8 d-flex">
              <div className="row flex-fill">
                {/* <SummaryCards
cards={attendanceData.summaryCards.map((card: any) => ({
...card,
trendType: card.trendType === "up" ? "up" : "down",
}))}
/> */}
                <SummaryCards cards={summaryCards} />

                <WorkStatsWithTimeline stats={attendanceData.workStats} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body p-0">
              {" "}
              {isEmployeeAttendanceApiFetching ? (
                <div className="text-center p-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                  <div className="mt-2">Loading Attendence...</div>
                </div>
              ) : (
                <DatatableKHR data={data} columns={columns} selection={true} />
              )}
            </div>
          </div>
        </div>
      </div>

      {showQueryModal && selectedAttendancee && (
        <AttendanceQueryModal
          attendance={selectedAttendancee}
          employeeId={employeeId}
          onClose={() => setShowQueryModal(false)}
        />
      )}
    </>
  );
};

export default EmployeeAttendanceKHR;
