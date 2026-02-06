import { all_routes } from "@/router/all_routes";
import ImageWithBasePath from "@/core/common/imageWithBasePath";

import { useEffect, useState } from "react";
import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";

import { exportAttendanceToExcel, exportAttendanceToPdf } from "./AdminAttandanceServices";
// import { toast } from "react-toastify";
import Link from "antd/es/typography/Link";
import CommonAttendanceStatus from "@/CommonComponent/CommonAttendanceStatus/CommonAttendanceStatus";
import EditAttendanceModal from "./EditAdminAttendance";
import { useDispatch, useSelector } from "react-redux";
import {
  ApiAuth,
  AttendancesGetApi,
  getEmployeesBasicInfo,
  TBSelector,
  updateState,
} from "@/Store/Reducers/TBSlice";
import { AppDispatch } from "@/Store";
import CONFIG from "@/Config";

// Define a type for attendance admin data
interface AttendanceAdminData {
  id: number;
  Employee: string;
  Image: string;
  Role: string;
  Status: string;
  Date: string;
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

// Define Employee interface
interface Employee {
  id: number;
  name: string;
  email: string;
  department?: string;
  designation?: string;
}

// Define GroupedData interface
interface GroupedData {
  groupName: string;
  items: AttendanceAdminData[];
  count: number;
  isGroup: boolean;
}

const AdminAttandanceKHR = () => {
  const routes = all_routes;

  // const [data, setData] = useState<EmployeeAttendance[]>([]);
  const [data, setData] = useState<AttendanceAdminData[]>([]);
  const [attendanceCards, setAttendanceCards] = useState<any[]>([]);
  
  // Group by functionality
  const [groupBy, setGroupBy] = useState<string>('none');
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  // Employee selector
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  
  const {
    isAttendancesGetApi,
    isAttendancesGetApiFetching,
    AttendancesGetApiData,
    AdminWorkingHoursData,
    isApiAuth,
    isGetEmployeesBasicInfo,
    isGetEmployeesBasicInfoFetching,
    getEmployeesBasicInfoData,
  } = useSelector(TBSelector);
  const [selectedAttendanceeEditModal, setSelectedAttendanceeEditModal] =
    useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();

  const [isExporting, setIsExporting] = useState(false);

  // Group by functionality
  const groupByOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'status', label: 'Group by Status' },
    { value: 'role', label: 'Group by Role' },
    { value: 'department', label: 'Group by Department' },
    { value: 'date', label: 'Group by Date' },
    { value: 'late', label: 'Group by Late Status' },
    { value: 'production_hours', label: 'Group by Production Hours' },
    { value: 'last_month', label: 'Last Month Only' },
    { value: 'last_3_months', label: 'Last 3 Months' },
    { value: 'last_6_months', label: 'Last 6 Months' }
  ];

  // Helper functions for time-based filtering
  const getLastMonthDateRange = () => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    return {
      date_from: lastMonth.toISOString().split('T')[0],
      date_to: lastDayOfLastMonth.toISOString().split('T')[0],
      label: lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
  };

  const getLastNMonthsDateRange = (n: number) => {
    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth() - n, 1);
    const endMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    return {
      date_from: startMonth.toISOString().split('T')[0],
      date_to: endMonth.toISOString().split('T')[0],
      label: `${startMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} to ${endMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    };
  };

  // Function to fetch employees
  const fetchEmployees = () => {
    dispatch(getEmployeesBasicInfo({}) as any);
  };

  // Get employees from Redux state
  const employees: Employee[] = getEmployeesBasicInfoData?.data?.map((emp: any) => ({
    id: emp.id,
    name: emp.name || emp.employee_name || 'Unknown',
    email: emp.email || '',
    department: emp.department || '',
    designation: emp.designation || emp.job_title || ''
  })) || [];

  // Function to fetch attendance with employee filter
  const fetchAttendanceWithEmployee = (employeeId?: string) => {
    const params: any = {};
    if (employeeId) {
      params.employee_id = employeeId;
    }
    dispatch(AttendancesGetApi(params) as any);
  };

  // Function to fetch attendance for date range
  const fetchAttendanceForDateRange = async (date_from: string, date_to: string, employeeId?: string) => {
    try {
      console.log(`Fetching attendance data from ${date_from} to ${date_to}${employeeId ? ` for employee ${employeeId}` : ''}`);
      const params: any = { date_from, date_to };
      if (employeeId) {
        params.employee_id = employeeId;
      }
      dispatch(AttendancesGetApi(params) as any);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  // Group data by field
  const groupDataByField = (data: AttendanceAdminData[], field: string): GroupedData[] => {
    if (field === 'none') return [];

    const grouped = data.reduce((acc: any, item) => {
      let groupKey = '';
      
      switch (field) {
        case 'status':
          groupKey = item.Status;
          break;
        case 'role':
          groupKey = item.Role;
          break;
        case 'department':
          groupKey = item.Role; // Using Role as department for now
          break;
        case 'date':
          groupKey = item.Date;
          break;
        case 'late':
          groupKey = item.Late === 'Yes' ? 'Late Arrivals' : 'On Time';
          break;
        case 'production_hours':
          const hours = parseFloat(item.ProductionHours);
          if (hours < 4) groupKey = 'Under 4 Hours';
          else if (hours < 8) groupKey = '4-8 Hours';
          else if (hours <= 9) groupKey = '8-9 Hours';
          else groupKey = 'Over 9 Hours';
          break;
        case 'last_month':
        case 'last_3_months':
        case 'last_6_months':
          groupKey = item.Status; // Group by status for time-based filters
          break;
        default:
          groupKey = 'All Records';
      }

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([groupName, items]: [string, any]): GroupedData => ({
      groupName,
      items,
      count: items.length,
      isGroup: true
    }));
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  // Toggle all groups
  const toggleAllGroups = (expand: boolean) => {
    if (expand) {
      setExpandedGroups(new Set(groupedData.map(group => group.groupName)));
    } else {
      setExpandedGroups(new Set());
    }
  };

  // Handle group by change
  const handleGroupByChange = async (value: string) => {
    setGroupBy(value);
    
    if (value === 'none') {
      setGroupedData([]);
      setExpandedGroups(new Set());
      // Fetch current data without date filters
      fetchAttendanceWithEmployee(selectedEmployeeId);
      return;
    }

    // Handle time-based grouping options
    if (['last_month', 'last_3_months', 'last_6_months'].includes(value)) {
      try {
        switch (value) {
          case 'last_month':
            const lastMonthRange = getLastMonthDateRange();
            console.log('Fetching last month data:', lastMonthRange.label);
            await fetchAttendanceForDateRange(lastMonthRange.date_from, lastMonthRange.date_to, selectedEmployeeId);
            break;
          
          case 'last_3_months':
            const last3MonthsRange = getLastNMonthsDateRange(3);
            console.log(`Fetching last 3 months: ${last3MonthsRange.label}`);
            await fetchAttendanceForDateRange(last3MonthsRange.date_from, last3MonthsRange.date_to, selectedEmployeeId);
            break;
          
          case 'last_6_months':
            const last6MonthsRange = getLastNMonthsDateRange(6);
            console.log(`Fetching last 6 months: ${last6MonthsRange.label}`);
            await fetchAttendanceForDateRange(last6MonthsRange.date_from, last6MonthsRange.date_to, selectedEmployeeId);
            break;
        }
        return;
      } catch (error) {
        console.error('Error fetching time-based data:', error);
      }
    }

    // Handle regular grouping (non-time-based)
    const grouped = groupDataByField(data, value);
    setGroupedData(grouped);
    
    // Expand first group by default
    if (grouped.length > 0) {
      setExpandedGroups(new Set([grouped[0].groupName]));
    }
  };

  // Handle employee selection
  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    
    // Reset grouping when employee changes
    if (groupBy !== 'none') {
      setGroupBy('none');
      setGroupedData([]);
      setExpandedGroups(new Set());
    }
    
    // Fetch attendance for selected employee
    fetchAttendanceWithEmployee(employeeId);
  };

  // Render grouped table
  const renderGroupedTable = () => {
    if (groupBy === 'none') {
      return <DatatableKHR data={data} columns={columns} selection={true} />;
    }

    return (
      <div className="grouped-table">
        {groupedData.map((group: GroupedData, groupIndex: number) => (
          <div 
            key={`group-${groupIndex}-${group.groupName}`} 
            className="group-section mb-4" 
            style={{
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            {/* Group Header */}
            <div 
              className="group-header bg-light p-3 border rounded cursor-pointer d-flex justify-content-between align-items-center"
              onClick={() => toggleGroupExpansion(group.groupName)}
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid #e9ecef'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
            >
              <div className="d-flex align-items-center">
                <i className={`ti ${expandedGroups.has(group.groupName) ? 'ti-chevron-down' : 'ti-chevron-right'} me-2`}></i>
                <h6 className="mb-0 fw-bold">{group.groupName}</h6>
                <span className="badge badge-primary ms-2">{group.count} records</span>
              </div>
              <div className="group-stats">
                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="ti ti-users me-1"></i>
                    Total: <strong>{group.count}</strong>
                  </small>
                  <small className="text-success">
                    <i className="ti ti-check me-1"></i>
                    Present: <strong>{group.items.filter((item: AttendanceAdminData) => item.Status === 'Present').length}</strong>
                  </small>
                  <small className="text-danger">
                    <i className="ti ti-x me-1"></i>
                    Absent: <strong>{group.items.filter((item: AttendanceAdminData) => item.Status === 'Absent').length}</strong>
                  </small>
                  <small className="text-warning">
                    <i className="ti ti-clock me-1"></i>
                    Late: <strong>{group.items.filter((item: AttendanceAdminData) => item.Late === 'Yes').length}</strong>
                  </small>
                </div>
              </div>
            </div>

            {/* Group Content */}
            {expandedGroups.has(group.groupName) && (
              <div className="group-content mt-2" style={{ borderTop: '1px solid #e9ecef' }}>
                <DatatableKHR 
                  data={group.items} 
                  columns={columns} 
                  selection={true}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Get today's date and 7 days ago for default export range
  const getDefaultDateRange = () => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    
    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    return {
      dateFrom: formatDate(weekAgo),
      dateTo: formatDate(today),
    };
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const { dateFrom, dateTo } = getDefaultDateRange();
      await exportAttendanceToExcel(dateFrom, dateTo);
      // toast.success("Excel exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      // toast.error("Failed to export Excel file");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const { dateFrom, dateTo } = getDefaultDateRange();
      await exportAttendanceToPdf(dateFrom, dateTo);
      // toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      // toast.error("Failed to export PDF file");
    } finally {
      setIsExporting(false);
    }
  };

  const formatTime = (dateTime: string | false) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime.replace(" ", "T"));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateTime: string | false) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime.replace(" ", "T"));
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    });
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

            Status: isPresent ? "Present" : "Absent",

            Date: formatDate(item.check_in),

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
            title: "Uninformed",
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

  }, []);
  
  // Update grouped data when main data changes
  useEffect(() => {
    if (data.length > 0 && groupBy !== 'none') {
      const grouped = groupDataByField(data, groupBy);
      setGroupedData(grouped);
      
      // Expand first group by default
      if (grouped.length > 0) {
        setExpandedGroups(new Set([grouped[0].groupName]));
      }
    }
  }, [data, groupBy]);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle employee data loading
  useEffect(() => {
    if (isGetEmployeesBasicInfo) {
      console.log('Employees loaded:', getEmployeesBasicInfoData);
      dispatch(updateState({ isGetEmployeesBasicInfo: false }));
    }
  }, [isGetEmployeesBasicInfo, getEmployeesBasicInfoData, dispatch]);
  useEffect(() => {
    // fetchData();
    if (isApiAuth) {
      dispatch(AttendancesGetApi({}) as any);
      dispatch(updateState({ isApiAuth: false }))
    }
  }, [dispatch, isApiAuth]);
  useEffect(() => {
    // fetchData();
    dispatch(ApiAuth());

  }, [dispatch]);
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
      title: "Date",
      dataIndex: "Date",
      render: (text: string) => (
        <span className="fw-medium text-dark">{text}</span>
      ),
      sorter: (a: AttendanceAdminData, b: AttendanceAdminData) =>
        a.Date.localeCompare(b.Date),
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
                  {/* Employee Selector */}
                  <div className="dropdown me-2">
                    <button
                      className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-user me-1" />
                      {selectedEmployeeId ? 
                        employees.find(emp => emp.id.toString() === selectedEmployeeId)?.name || 'Select Employee'
                        : 'All Employees'
                      }
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      <li>
                        <button
                          className={`dropdown-item ${selectedEmployeeId === '' ? 'active' : ''}`}
                          onClick={() => handleEmployeeChange('')}
                        >
                          <i className="ti ti-users me-2" />
                          All Employees
                        </button>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      {isGetEmployeesBasicInfoFetching ? (
                        <li className="dropdown-item-text">
                          <div className="d-flex align-items-center">
                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                            Loading employees...
                          </div>
                        </li>
                      ) : employees.length === 0 ? (
                        <li className="dropdown-item-text text-muted">
                          <i className="ti ti-info-circle me-2" />
                          No employees found
                        </li>
                      ) : (
                        employees.map((employee) => (
                          <li key={employee.id}>
                            <button
                              className={`dropdown-item ${selectedEmployeeId === employee.id.toString() ? 'active' : ''}`}
                              onClick={() => handleEmployeeChange(employee.id.toString())}
                            >
                              <i className="ti ti-user me-2" />
                              <div>
                                <div>{employee.name}</div>
                                {employee.designation && (
                                  <small className="text-muted">{employee.designation}</small>
                                )}
                              </div>
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  {/* Group By Dropdown */}
                  <div className="dropdown me-2">
                    <button
                      className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-layout-grid me-1" />
                      {groupByOptions.find(opt => opt.value === groupBy)?.label || 'Group By'}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      {groupByOptions.map((option) => (
                        <li key={option.value}>
                          <button
                            className={`dropdown-item ${groupBy === option.value ? 'active' : ''}`}
                            onClick={() => handleGroupByChange(option.value)}
                          >
                            <i className={`ti ${groupBy === option.value ? 'ti-check' : 'ti-point'} me-2`} />
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

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
                        <button 
                          className="dropdown-item"
                          onClick={handleExportPdf}
                          disabled={isExporting}
                        >
                          <i className="ti ti-file-type-pdf me-1" /> 
                          {isExporting ? "Exporting..." : "PDF"}
                        </button>
                      </li>
                      <li>
                        <button 
                          className="dropdown-item"
                          onClick={handleExportExcel}
                          disabled={isExporting}
                        >
                          <i className="ti ti-file-type-xls me-1" /> 
                          {isExporting ? "Exporting..." : "Excel"}
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
                    <h4 className="mb-1">
                      Attendance Details 
                      {selectedEmployeeId ? (
                        <span className="text-primary">
                          - {employees.find(emp => emp.id.toString() === selectedEmployeeId)?.name}
                        </span>
                      ) : (
                        ' Today'
                      )}
                    </h4>
                    <p>
                      {selectedEmployeeId 
                        ? `Individual employee attendance data`
                        : `Data from the 800+ total no of employees`
                      }
                    </p>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="d-flex align-items-center justify-content-md-end">
                    <h6>
                      {selectedEmployeeId 
                        ? 'Employee Status'
                        : 'Total Absenties today'
                      }
                    </h6>
                    {!selectedEmployeeId && (
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
                    )}
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
                <>
                  {/* Group By Info */}
                  {groupBy !== 'none' && (
                    <div className="alert alert-info m-3 mb-0 d-flex justify-content-between align-items-center">
                      <div>
                        <i className="ti ti-info-circle me-2"></i>
                        <strong>Grouped by:</strong> {groupByOptions.find(opt => opt.value === groupBy)?.label}
                        <span className="ms-2">
                          ({groupedData.length} groups, {data.length} total records)
                        </span>
                        {selectedEmployeeId && (
                          <span className="ms-2 badge badge-secondary">
                            <i className="ti ti-user me-1"></i>
                            Employee: {employees.find(emp => emp.id.toString() === selectedEmployeeId)?.name}
                          </span>
                        )}
                        {['last_month', 'last_3_months', 'last_6_months'].includes(groupBy) && (
                          <span className="ms-2 badge badge-info">
                            <i className="ti ti-calendar me-1"></i>
                            {groupBy === 'last_month' && 'Previous Month Only'}
                            {groupBy === 'last_3_months' && 'Previous 3 Months'}
                            {groupBy === 'last_6_months' && 'Previous 6 Months'}
                          </span>
                        )}
                      </div>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => toggleAllGroups(true)}
                          title="Expand All Groups"
                        >
                          <i className="ti ti-chevrons-down me-1"></i>
                          Expand All
                        </button>
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => toggleAllGroups(false)}
                          title="Collapse All Groups"
                        >
                          <i className="ti ti-chevrons-up me-1"></i>
                          Collapse All
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Render Table or Grouped Table */}
                  <div className="p-3">
                    {renderGroupedTable()}
                  </div>
                </>
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
            // fetchData();
          }}
        />
      )}
    </>
  );
};

export default AdminAttandanceKHR;
