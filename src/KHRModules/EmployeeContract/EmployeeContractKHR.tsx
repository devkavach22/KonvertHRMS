import { Link } from "react-router-dom";
// import { attendance_admin_details } from '../../../core/data/json/attendanceadmin';

// import { all_routes } from '../../../router/all_routes';
import { all_routes } from "@/router/all_routes";
// import PredefinedDateRanges from '../../../core/common/datePicker';
// import Table from "../../../core/common/dataTable/index";
// import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import ImageWithBasePath from "@/core/common/imageWithBasePath";
// import CommonSelect from '../../../core/common/commonSelect';
import { DatePicker, TimePicker } from "antd";
// import CollapseHeader from '../../../core/common/collapse-header/collapse-header';
import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";
import SummaryCards from "@/CommonComponent/CommonAttendanceStatus/SummaryCards";
// import { all } from 'node_modules/axios/index.d.cts';
import { attendance_admin_details } from "@/core/data/json/attendanceadmin";
import { attendance_employee_details } from "@/core/data/json/attendanceemployee";
import { getAttendance } from "../AttandanceModules/EmployeeAttandance/EmployeeAttandanceServices";
import AddEmployeeContractModal from "./AddEmployeeContractModal";

// Define a type for attendance admin data
interface AttendanceAdminData {
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

// Define a type for employee attendance
interface EmployeeAttendance {
  id: string;
  key: string;
  Employee_Name: string;
  Attendance_Date: string;
  Created_Date: string;
  Status: string;
}

const EmployeeContractKHR = () => {
  // const attendanceTableDummyData: AttendanceAdminData[] = [
  //   {
  //     Employee: "John Doe",
  //     Image: "avatar-1.jpg",
  //     Role: "Developer",
  //     Status: "Present",
  //     CheckIn: "09:30 AM",
  //     CheckOut: "06:30 PM",
  //     Break: "45 min",
  //     Late: "No",
  //     ProductionHours: "8.5",
  //   },
  //   {
  //     Employee: "Sarah Smith",
  //     Image: "avatar-2.jpg",
  //     Role: "Designer",
  //     Status: "Absent",
  //     CheckIn: "-",
  //     CheckOut: "-",
  //     Break: "-",
  //     Late: "Yes",
  //     ProductionHours: "0",
  //   },
  //   {
  //     Employee: "Rahul Patel",
  //     Image: "avatar-3.jpg",
  //     Role: "HR",
  //     Status: "Present",
  //     CheckIn: "10:00 AM",
  //     CheckOut: "07:00 PM",
  //     Break: "30 min",
  //     Late: "No",
  //     ProductionHours: "9",
  //   },
  // ];

  const routes = all_routes;

  // const [data, setData] = useState<EmployeeAttendance[]>([]);
  const [data, setData] = useState<AttendanceAdminData[]>([]);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [selectedAttendancee, setSelectedAttendancee] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEmployeeContract, setSelectedEmployeeContract] =
    useState<EmployeeAttendance | null>(null);

  // Dummy async function for fetching employee attendance



  const formatTime = (dateTime: string | false) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime.replace(" ", "T"));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // 1. Fetch & Map Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getAttendance();
      console.log(response, "responce");

      // Support both: service returning the array directly, or an object with `.data`
      const attendanceArray = Array.isArray(response)
        ? response
        : Array.isArray(response.data)
          ? response.data
          : [];

      // const meta = response?.meta || response?.data?.meta || {};

      const mappedData: AttendanceAdminData[] = attendanceArray.map((item: any) => ({
        // Employee: meta?.employee_name || "Employee",
        Image: item.employee?.avatar || "avatar-1.jpg",
        Role: item.employee?.role || "Employee",
        Status: item.status_code ? "Present" : "Absent",
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
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load employee attendance", error);
      toast.error("Failed to load employee attendance list");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    // {
    //   title: "Employee",
    //   dataIndex: "Employee",
    //   render: (_text: string, record: AttendanceAdminData) => (
    //     <div className="d-flex align-items-center file-name-icon">
    //       <span className="avatar avatar-md border avatar-rounded">
    //         <ImageWithBasePath
    //           src={`assets/img/users/${record.Image}`}
    //           className="img-fluid"
    //           alt={`${record.Employee} Profile`}
    //         />
    //       </span>
    //       <div className="ms-2">
    //         <h6 className="fw-medium">{record.Employee}</h6>
    //         <span className="fs-12 fw-normal ">{record.Role}</span>
    //       </div>
    //     </div>
    //   ),
    //   sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
    //     a.Employee.length - b.Employee.length,
    // },

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
          className={`badge ${text === "Present"
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
      //   a.Late Time.length - b.Late Time.length,
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
          className={`badge d-inline-flex align-items-center badge-sm ${parseFloat(record.ProductionHours) < 8
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
    }
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
          <div onClick={() => setSelectedEmployeeContract(null)}>
            

              <CommonHeader
              title="Employee Contract"
              parentMenu="Employee"
              activeMenu="Employee Contract"
              routes={routes}
              buttonText="Add Employee Contract"
              modalTarget="#add_employee_contract"
            />
          </div>
       

          <div className="card">
            <div className="card-body p-0">
              {" "}
              {loading ? (
                <div className="text-center p-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                  <div className="mt-2">Loading Employee Contract...</div>
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
      <AddEmployeeContractModal onSuccess={fetchData} data={selectedEmployeeContract} />

      

    </>
  );
};

export default EmployeeContractKHR;
