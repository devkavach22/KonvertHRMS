// import { attendance_admin_details } from '../../../core/data/json/attendanceadmin';

// import { all_routes } from '../../../router/all_routes';
import { all_routes } from "@/router/all_routes";
// import PredefinedDateRanges from '../../../core/common/datePicker';
// import Table from "../../../core/common/dataTable/index";
// import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import ImageWithBasePath from "@/core/common/imageWithBasePath";
// import CommonSelect from '../../../core/common/commonSelect';
// import CollapseHeader from '../../../core/common/collapse-header/collapse-header';
import { toast } from "react-toastify";
import attendanceData from "./CommonAttendanceStatus.json";

import { useEffect, useState } from "react";
import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";

import { getAdminAttendance } from "./AdminAttandanceServices";
import Link from "antd/es/typography/Link";
import CommonAttendanceStatus from "@/CommonComponent/CommonAttendanceStatus/CommonAttendanceStatus";
import EditAttendanceModal from "./EditAdminAttendance";
import { useDispatch, useSelector } from "react-redux";
import {
  AttendancesGetApi,
  TBSelector,
  updateState,
} from "@/Store/Reducers/TBSlice";

// Define a type for attendance admin data
interface AttendanceAdminData {
  id: number;
  Employee: string;
  Image: string;
  Role: string;
  Status: string;
  CheckIn: string;
  CheckOut: string;
  Break: string;
  Late: string;
  ProductionHours: string;
}

// Define a type for AttendanceCard
type AttendanceCard = {
  id: number;
  title: string;
  count: number;
  badgeType: string;
  icon: string;
  percentage: string;
};

const AdminAttandanceKHR = () => {
  const routes = all_routes;

  // const [data, setData] = useState<EmployeeAttendance[]>([]);
  const [data, setData] = useState<AttendanceAdminData[]>([]);
  const [attendanceCards, setAttendanceCards] = useState<any[]>([]);
  const {
    isAttendancesGetApi,
    isAttendancesGetApiFetching,
    AttendancesGetApiData,
    AdminWorkingHoursData,
  } = useSelector(TBSelector);
  const [selectedAttendanceeEditModal, setSelectedAttendanceeEditModal] =
    useState<any>(null);
  const dispatch = useDispatch();

  const formatTime = (dateTime: string | false) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime.replace(" ", "T"));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAttendance, setSelectedAttendance] =
    useState<EmployeeAttendance | null>(null);

  // Define EmployeeAttendance type if not imported
  type EmployeeAttendance = {
    id: string;
    key: string;
    Employee_Name: string;
    Attendance_Date: string;
    Created_Date: string;
    Status: string;
  };

  // 1. Fetch & Map Data
  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const response: any = await getAdminAttendance();

  //     console.log(response, "dddddffff");

  //     // Safety Check: Backend might return { data: [...] } or just [...]
  //     const rawArray = Array.isArray(response)
  //       ? response
  //       : response?.data && Array.isArray(response.data)
  //         ? response.data
  //         : [];

  //     // const mappedData: AttendanceAdminData[] = rawArray.map((item: any) => ({
  //     //   Employee: Array.isArray(item.employee_id) ? item.employee_id[1] : "Employee",
  //     //   Image: item.employee?.avatar || "avatar-1.jpg",
  //     //   Role: item.job_name || "Employee",
  //     //   Status: item.check_in ? "Present" : "Absent",
  //     //   CheckIn: formatTime(item.check_in),
  //     //   CheckOut: formatTime(item.check_out),
  //     //   Break: item.break_time_display || "-",
  //     //   Late: item.is_late_in ? "Yes" : "No",
  //     //   ProductionHours:
  //     //     typeof item.worked_hours === "number"
  //     //       ? item.worked_hours.toFixed(2)
  //     //       : item.worked_hours
  //     //         ? String(item.worked_hours)
  //     //         : "0",
  //     // }));

  //     const mappedData: AttendanceAdminData[] = rawArray.map((item: any) => {
  //       const isPresent = !!item.check_in;

  //       return {
  //         id: item.id,
  //         Employee: Array.isArray(item.employee_id)
  //           ? item.employee_id[1]
  //           : "Employee",

  //         // Image: item.employee?.avatar || "avatar-1.jpg",

  //         Role: item.job_name || "Employee",
  //         Break: item.break_hours || "-",

  //         Status: isPresent ? "Present" : "Absent",

  //         CheckIn: isPresent ? formatTime(item.check_in) : "-",

  //         CheckOut: isPresent ? formatTime(item.check_out) : "-",

  //         Break: isPresent ? item.break_time_display || "-" : "-",

  //         Late: isPresent ? (item.late_time_display ? item.late_time_display : "-") : "-",

  //         ProductionHours: isPresent
  //           ? typeof item.worked_hours === "number"
  //             ? item.worked_hours.toFixed(2)
  //             : item.worked_hours
  //               ? String(item.worked_hours)
  //               : "0"
  //           : "0",
  //       };
  //     });

  //     setData(mappedData);

  //     const meta = response?.meta;

  //     if (meta) {
  //       const cards: AttendanceCard[] = [
  //         {
  //           id: 1,
  //           title: "Total Employees",
  //           count: meta.TotalEmployee ?? 0,
  //           badgeType: "info",
  //           icon: "ti-users",
  //           percentage: "",
  //         },
  //         {
  //           id: 2,
  //           title: "Present Today",
  //           count: meta.Presentemployee ?? 0,
  //           badgeType: "success",
  //           icon: "ti-arrow-wave-right-down",
  //           percentage: "",
  //         },
  //         {
  //           id: 3,
  //           title: "Absent Today",
  //           count: meta.TodayAbsetEmployee ?? 0,
  //           badgeType: "danger",
  //           icon: "ti-arrow-wave-right-down",
  //           percentage: "",
  //         },
  //         {
  //           id: 4,
  //           title: "Late Login",
  //           count: meta.TotalLateemployee ?? 0,
  //           badgeType: "danger",
  //           icon: "ti-arrow-wave-right-down",
  //           percentage: "",
  //         },
  //         {
  //           id: 5,
  //           title: "Ununiformed",
  //           count: meta.Ununiformendemployee ?? 0,
  //           badgeType: "danger",
  //           icon: "ti-arrow-wave-right-down",
  //           percentage: "",
  //         },
  //       ];

  //       setAttendanceCards(cards);
  //     }
  //   } catch (error) {
  //     console.error("Failed to load employee attendance", error);
  //     toast.error("Failed to load employee attendance list");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (isAttendancesGetApi) {
      const mappedData: AttendanceAdminData[] =
        AttendancesGetApiData?.data?.map((item: any) => {
          const isPresent = !!item.check_in;

          return {
            id: item.id,
            Employee: Array.isArray(item.employee_id)
              ? item.employee_id[1]
              : "Employee",

            // Image: item.employee?.avatar || "avatar-1.jpg",

            Role: item.job_name || "Employee",
            Break: item.break_hours || "-",

            Status: isPresent ? "Present" : "Absent",

            CheckIn: isPresent ? formatTime(item.check_in) : "-",

            CheckOut: isPresent ? formatTime(item.check_out) : "-",

            Break: isPresent ? item.break_time_display || "-" : "-",

            Late: isPresent
              ? item.late_time_display
                ? item.late_time_display
                : "-"
              : "-",

            ProductionHours: isPresent
              ? typeof item.worked_hours === "number"
                ? item.worked_hours.toFixed(2)
                : item.worked_hours
                ? String(item.worked_hours)
                : "0"
              : "0",
          };
        });
      console.log(mappedData, "mappeee");

      setData(mappedData);

      const meta = AttendancesGetApiData?.meta;

      if (meta) {
        const cards: AttendanceCard[] = [
          {
            id: 1,
            title: "Total Employees",
            count: meta.TotalEmployee ?? 0,
            badgeType: "info",
            icon: "ti-users",
            percentage: "",
          },
          {
            id: 2,
            title: "Present Today",
            count: meta.Presentemployee ?? 0,
            badgeType: "success",
            icon: "ti-arrow-wave-right-down",
            percentage: "",
          },
          {
            id: 3,
            title: "Absent Today",
            count: meta.TodayAbsetEmployee ?? 0,
            badgeType: "danger",
            icon: "ti-arrow-wave-right-down",
            percentage: "",
          },
          {
            id: 4,
            title: "Late Login",
            count: meta.TotalLateemployee ?? 0,
            badgeType: "danger",
            icon: "ti-arrow-wave-right-down",
            percentage: "",
          },
          {
            id: 5,
            title: "Ununiformed",
            count: meta.Ununiformendemployee ?? 0,
            badgeType: "danger",
            icon: "ti-arrow-wave-right-down",
            percentage: "",
          },
        ];

        setAttendanceCards(cards);
      }

      dispatch(updateState({ isAttendancesGetApi: false }));
    }
  }, [isAttendancesGetApi, isAttendancesGetApiFetching]);

  useEffect(() => {
    // fetchData();
    dispatch(AttendancesGetApi());
  }, []);

  const columns = [
    {
      title: "Employee",
      dataIndex: "Employee",
      render: (_text: string, record: AttendanceAdminData) => (
        <div className="d-flex align-items-center file-name-icon">
          <div className="ms-2">
            <h6 className="fw-medium">{record.Employee}</h6>
            <span className="fs-12 fw-normal ">{record.Role}</span>
          </div>
        </div>
      ),
      sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
        a.Employee.length - b.Employee.length,
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
      title: "Check In",
      dataIndex: "CheckIn",
      sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
        a.CheckIn.length - b.CheckIn.length,
    },
    {
      title: "Check Out",
      dataIndex: "CheckOut",
      sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
        a.CheckOut.length - b.CheckOut.length,
    },
    {
      title: "Break",
      dataIndex: "Break",
      sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
        a.Break.length - b.Break.length,
    },
    {
      title: "Late",
      dataIndex: "Late",
      sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
        a.Late.length - b.Late.length,
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
      render: (_: any, record: AttendanceAdminData) => {
        const canEdit = record.Status === "Present" && record.id;

        if (!canEdit) return null;

        return (
          <div className="action-icon d-inline-flex">
            <button
              type="button"
              className="me-2"
              data-bs-toggle="modal"
              data-bs-target="#edit_attendance"
              aria-label="Edit attendance"
              onClick={() => {
                setSelectedAttendanceeEditModal(record);
              }}
            >
              <i className="ti ti-edit" />
            </button>
          </div>
        );
      },
    },
  ];

  const statusChoose = [
    { value: "Select", label: "Select" },
    { value: "Present", label: "Present" },
    { value: "Absent", label: "Absent" },
  ];

  const getModalContainer = () => {
    const modalElement = document.getElementById("modal-datepicker");
    return modalElement ? modalElement : document.body;
  };
  const getModalContainer2 = () => {
    const modalElement = document.getElementById("modal_datepicker");
    return modalElement ? modalElement : document.body;
  };

  return (
    <>
      {/* Page Wrapper */}

      {/* /Page Wrapper */}

      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => setSelectedAttendance(null)}>
            <CommonHeader
              title="Admin Attendance"
              parentMenu="Employee"
              activeMenu="Admin Attendance"
              routes={routes}
              rightActions={
                <>
                  <div className="d-flex border bg-white rounded p-1">
                    <Link
                      // to={all_routes.attendanceemployee}
                      className="btn btn-icon btn-sm me-1"
                    >
                      <i className="ti ti-brand-days-counter" />
                    </Link>
                    <Link
                      // to={all_routes.attendanceadmin}
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
          <div className="card border-0">
            <div className="card-body">
              <div className="row align-items-center mb-4">
                <div className="col-md-5">
                  <div className="mb-3 mb-md-0">
                    <h4 className="mb-1">Attendance Details Today</h4>
                    <p>Data from the 800+ total no of employees</p>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="d-flex align-items-center justify-content-md-end">
                    <h6>Total Absenties today</h6>
                    <div className="avatar-list-stacked avatar-group-sm ms-4">
                      <span className="avatar avatar-rounded">
                        <ImageWithBasePath
                          className="border border-white"
                          src="assets/img/profiles/avatar-02.jpg"
                          alt="avatar"
                        />
                      </span>
                      <span className="avatar avatar-rounded">
                        <ImageWithBasePath
                          className="border border-white"
                          src="assets/img/profiles/avatar-03.jpg"
                          alt="avatar"
                        />
                      </span>
                      <span className="avatar avatar-rounded">
                        <ImageWithBasePath
                          className="border border-white"
                          src="assets/img/profiles/avatar-05.jpg"
                          alt="avatar"
                        />
                      </span>
                      <span className="avatar avatar-rounded">
                        <ImageWithBasePath
                          className="border border-white"
                          src="assets/img/profiles/avatar-06.jpg"
                          alt="avatar"
                        />
                      </span>
                      <span className="avatar avatar-rounded">
                        <ImageWithBasePath
                          className="border border-white"
                          src="assets/img/profiles/avatar-07.jpg"
                          alt="avatar"
                        />
                      </span>
                      <Link
                        className="avatar bg-primary avatar-rounded text-fixed-white fs-12"
                        // to="#"
                      >
                        +1
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border rounded">
                <div className="row flex-fill">
                  <CommonAttendanceStatus cards={attendanceCards} />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body p-0">
              {" "}
              {isAttendancesGetApiFetching ? (
                <div className="text-center p-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                  <div className="mt-2">
                    Loading All Employees Attendence...
                  </div>
                </div>
              ) : (
                <DatatableKHR
                  data={data}
                  columns={columns}
                  selection={true}
                  // Ensure these keys match what DatatableKHR expects
                  // textKey="Department_Name"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      {/* <AddDepartmentModal onSuccess={fetchData} data={selectedDepartment} /> */}

      {selectedAttendanceeEditModal && (
        <EditAttendanceModal
          attendance={selectedAttendanceeEditModal}
          onClose={() => setSelectedAttendanceeEditModal(null)}
          onSuccess={() => {
            setSelectedAttendanceeEditModal(null);
            fetchData();
          }}
        />
      )}
    </>
  );
};

export default AdminAttandanceKHR;
