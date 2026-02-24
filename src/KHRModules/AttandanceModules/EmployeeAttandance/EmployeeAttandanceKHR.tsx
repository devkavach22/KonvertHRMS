import { Link } from "react-router-dom";
import { all_routes } from "@/router/all_routes";
import ImageWithBasePath from "@/core/common/imageWithBasePath";

import { useEffect, useState } from "react";
import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";
import SummaryCards from "@/CommonComponent/CommonAttendanceStatus/SummaryCards";
import WorkStatsWithTimeline from "./WorksWithTimeline";
import AttendanceQueryModal from "./AttendanceQueryModal";
import {
  ApiAuth,
  CheckinCheckout,
  EmployeeAttendanceApi,
  EmployeeAttendanceExportExcel,
  EmployeeAttendanceExportPdf,
  getCurrentAttendanceStatus,
  getRegularizationStatus,
  TBSelector,
  updateState,
} from "@/Store/Reducers/TBSlice";
import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
import type { AppDispatch } from "@/Store";

interface GroupedData {
  groupName: string;
  items: AttendanceAdminData[];
  count: number;
  isGroup: boolean;
}

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
  regularizationStatus?: string;
  hasRegularization?: boolean;
  rejectedReason?: string;
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
  const dispatch = useDispatch<AppDispatch>();
  const [summaryCards, setSummaryCards] = useState<any[]>([]);

  // Group by functionality
  const [groupBy, setGroupBy] = useState<string>("none");
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const {
    isEmployeeAttendanceApi,
    isEmployeeAttendanceApiFetching,
    EmployeeAttendanceApiData,
    isEmployeeAttendanceExportExcelFetching,
    isEmployeeAttendanceExportPdfFetching,
    isApiAuth,
    getRegularizationStatusData,
    getCurrentAttendanceStatusData,
  } = useSelector(TBSelector);

  const [selectedAttendancee, setSelectedAttendancee] = useState<any>(null);

  const { CheckinCheckoutData, isCheckinCheckoutFetching } =
    useSelector(TBSelector);

  // Export handlers
  const handleExportExcel = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const dateFrom = firstDayOfMonth.toISOString().split("T")[0];
    const dateTo = today.toISOString().split("T")[0];

    dispatch(
      EmployeeAttendanceExportExcel({ date_from: dateFrom, date_to: dateTo }),
    );
  };

  const handleExportPdf = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const dateFrom = firstDayOfMonth.toISOString().split("T")[0];
    const dateTo = today.toISOString().split("T")[0];

    dispatch(
      EmployeeAttendanceExportPdf({ date_from: dateFrom, date_to: dateTo }),
    );
  };

  if (!CheckinCheckoutData) {
    console.warn("CheckinCheckoutData is not available");
    return <div>Loading...</div>;
  }

  console.log(CheckinCheckoutData, "CheckinCheckoutData");

  const isCheckedIn = CheckinCheckoutData.status === "CheckedIn";
  const datass = CheckinCheckoutData.data || {};

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

  const handleAction = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");

      // toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(
          CheckinCheckout({
            Latitude: latitude,
            Longitude: longitude,
          }) as any,
        );
      },
      (error) => {
        console.error(error);
        // toast.error("Unable to get your location");
      },
      { enableHighAccuracy: true },
    );
  };

  useEffect(() => {
    if (isApiAuth) {
      dispatch(EmployeeAttendanceApi({}) as any);
      dispatch(getRegularizationStatus() as any);
      dispatch(updateState({ isApiAuth: false }));
    }
  }, [dispatch, isApiAuth]);

  useEffect(() => {
    // Load attendance data and current status on page load
    dispatch(EmployeeAttendanceApi({}) as any);
    dispatch(getRegularizationStatus() as any);
    dispatch(getCurrentAttendanceStatus() as any);

    // Test date range calculations (remove in production)
    testDateRangeCalculations();
  }, [dispatch]);
  console.log(EmployeeAttendanceApiData, "EmployeeAttendanceApiData");
  console.log(employeeId, "employeeIdddd");

  useEffect(() => {
    console.log(getRegularizationStatusData, "getRegularizationStatusData");

    if (isEmployeeAttendanceApi) {
      setEmployeeId(
        EmployeeAttendanceApiData?.data?.employee?.employee_id || null,
      );

      const regularizationMap = new Map();
      if (getRegularizationStatusData?.data) {
        getRegularizationStatusData.data.forEach((reg: any) => {
          const dateKey = reg.from_date?.split(" ")[0]; // Get date part only
          // regularizationMap.set(dateKey, {
          //   status: reg.state_select,
          //   hasRegularization: true,
          //   rejectedReason: reg.RejectedReason || null
          // });
          regularizationMap.set(dateKey, {
            status:
              reg.state_select === "reject" ? "rejected" : reg.state_select,
            hasRegularization: true,
            rejectedReason: reg.RejectedReason || null,
          });
        });
      }

      const mappedData: AttendanceAdminData[] =
        EmployeeAttendanceApiData?.data?.attendance_records?.map(
          (item: any) => {
            const dateKey = formatDateOnly(item.check_in);
            const regularization = regularizationMap.get(dateKey);

            return {
              attendance_id: item.id || 0,
              Employee: item.employee?.name || "Unknown Employee",
              Image: item.employee?.avatar || "avatar-1.jpg",
              Role: item.employee?.role || "Employee",
              Status: item.check_in ? "Present" : "Absent",
              StartDate: formatDateOnly(item.check_in),
              EndDate: item.check_out ? formatDateOnly(item.check_out) : "-",
              CheckIn: formatTime(item.check_in),
              CheckOut: formatTime(item.check_out),
              Break: "0h 0m", // Default value
              LateTime: item.late_time_display || "-",
              Late: item.is_late_in ? "Yes" : "No",
              Overtime:
                typeof item.overtime_hours === "number"
                  ? item.overtime_hours.toFixed(2)
                  : item.overtime_hours
                    ? String(item.overtime_hours)
                    : "0",
              ProductionHours: formatHours(item.total_productive_hours || 0),
              employeeId: item.employee?.id || 0,
              regularizationStatus: regularization?.status || null,
              hasRegularization: regularization?.hasRegularization || false,
              rejectedReason: regularization?.rejectedReason || null,
            };
          },
        ) || []; // Add fallback empty array
      setData(mappedData);
      dispatch(updateState({ isEmployeeAttendanceApi: false }));
    }
  }, [
    isEmployeeAttendanceApi,
    isEmployeeAttendanceApiFetching,
    getRegularizationStatusData,
  ]);

  console.log(data, "mappedDatamappedData");

  useEffect(() => {
    console.log(EmployeeAttendanceApiData, "EmployeeAttendanceApiDatafff");

    if (!isEmployeeAttendanceApi || !EmployeeAttendanceApiData?.data) return;

    const workingHoursSummary =
      EmployeeAttendanceApiData?.data?.working_hours_summary;

    // Provide fallback values if working_hours_summary is not available
    const defaultSummary = {
      worked_hours: 0,
      allowed_hours: 0,
      percentage: 0,
      total_overtime_hours_worked: 0,
      total_overtime_hours_allowed: 0,
    };

    const today = workingHoursSummary?.today || defaultSummary;
    const week = workingHoursSummary?.week || defaultSummary;
    const month = workingHoursSummary?.month || defaultSummary;

    const cards = [
      {
        icon: "ti ti-clock-stop",
        bg: "primary",
        title: "Total Hours Today",
        value: today.worked_hours?.toFixed(2) || "0.00",
        total: today.allowed_hours?.toString() || "0",
        trend: `${today.percentage || 0}% Today`,
        trendType: (today.percentage || 0) >= 0 ? "up" : "down",
      },
      {
        icon: "ti ti-clock-up",
        bg: "dark",
        title: "Total Hours Week",
        value: week.worked_hours?.toFixed(2) || "0.00",
        total: week.allowed_hours?.toString() || "0",
        trend: `${week.percentage || 0}% This Week`,
        trendType: (week.percentage || 0) >= 0 ? "up" : "down",
      },
      {
        icon: "ti ti-calendar-up",
        bg: "info",
        title: "Total Hours Month",
        value: month.worked_hours?.toFixed(2) || "0.00",
        total: month.allowed_hours?.toString() || "0",
        trend: `${month.percentage || 0}% This Month`,
        trendType: (month.percentage || 0) >= 0 ? "up" : "down",
      },
      {
        icon: "ti ti-calendar-star",
        bg: "pink",
        title: "Overtime Allowed (Month)",
        value: month.total_overtime_hours_worked?.toString() || "0",
        total: month.total_overtime_hours_allowed?.toString() || "0",
        trend: "Overtime",
        trendType: "up",
      },
    ];

    setSummaryCards(cards);
  }, [isEmployeeAttendanceApi, EmployeeAttendanceApiData]);

  const [workStats, setWorkStats] = useState<any[]>([]);

  const formatHours = (hours: number | null | undefined) => {
    if (!hours || hours <= 0) return "0h 0m";

    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    return `${h}h ${m}m`;
  };

  // Group by functionality
  const groupByOptions = [
    { value: "none", label: "No Grouping" },
    { value: "status", label: "Group by Status" },
    { value: "week", label: "Group by Week" },
    { value: "last_month", label: "Last Month Only" },
    { value: "last_3_months", label: "Last 3 Months" },
    { value: "last_6_months", label: "Last 6 Months" },
  ];

  const getWeekNumber = (date: string) => {
    const d = new Date(date);
    const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
    const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const getMonthYear = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Helper function to format date range for display
  const formatDateRange = (dateRange: {
    date_from: string;
    date_to: string;
    label: string;
  }) => {
    return dateRange.label;
  };

  // Test function to verify date range calculations (can be removed in production)
  const testDateRangeCalculations = () => {
    const now = new Date();
    console.log(
      "Current date:",
      now.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        day: "numeric",
      }),
    );

    const lastMonth = getLastMonthDateRange();
    console.log(
      "Last month:",
      lastMonth.label,
      `(date_from=${lastMonth.date_from}, date_to=${lastMonth.date_to})`,
    );

    const last3Months = getLastNMonthsDateRange(3);
    console.log(
      "Last 3 months:",
      last3Months.label,
      `(date_from=${last3Months.date_from}, date_to=${last3Months.date_to})`,
    );

    const last6Months = getLastNMonthsDateRange(6);
    console.log(
      "Last 6 months:",
      last6Months.label,
      `(date_from=${last6Months.date_from}, date_to=${last6Months.date_to})`,
    );
  };

  // Helper functions for time-based filtering
  // Example: If today is February 2, 2024
  // - Last Month: January 2024 (date_from=2024-01-01, date_to=2024-01-31)
  // - Last 3 Months: January, December, November (date_from=2023-11-01, date_to=2024-01-31)
  // - Last 6 Months: January, December, November, October, September, August (date_from=2023-08-01, date_to=2024-01-31)

  const getLastMonthDateRange = () => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return {
      date_from: lastMonth.toISOString().split("T")[0], // YYYY-MM-DD
      date_to: lastDayOfLastMonth.toISOString().split("T")[0], // YYYY-MM-DD
      label: lastMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    };
  };

  const getLastNMonthsDateRange = (n: number) => {
    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth() - n, 1);

    // End at last month (last day of previous month)
    const endMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return {
      date_from: startMonth.toISOString().split("T")[0], // YYYY-MM-DD
      date_to: endMonth.toISOString().split("T")[0], // YYYY-MM-DD
      label: `${startMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })} to ${endMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
    };
  };

  // Function to fetch attendance data for specific date range
  const fetchAttendanceForDateRange = async (
    date_from: string,
    date_to: string,
  ) => {
    try {
      console.log(`Fetching attendance data from ${date_from} to ${date_to}`);
      dispatch(EmployeeAttendanceApi({ date_from, date_to }) as any);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  // Function to fetch attendance data for single month (for last month only)
  const fetchAttendanceForSingleMonth = async (month: number, year: number) => {
    try {
      console.log(`Fetching attendance data for month=${month}, year=${year}`);
      dispatch(EmployeeAttendanceApi({ month, year }) as any);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const groupDataByField = (
    data: AttendanceAdminData[],
    field: string,
  ): GroupedData[] => {
    if (field === "none") return [];

    const grouped = data.reduce((acc: any, item) => {
      let groupKey = "";

      switch (field) {
        case "month":
          groupKey = getMonthYear(item.StartDate);
          break;
        case "status":
          groupKey = item.Status;
          break;
        case "week":
          const weekNum = getWeekNumber(item.StartDate);
          const year = new Date(item.StartDate).getFullYear();
          groupKey = `Week ${weekNum}, ${year}`;
          break;
        case "regularization":
          groupKey = item.hasRegularization
            ? item.regularizationStatus || "Pending"
            : "No Regularization";
          break;
        case "last_month":
        case "last_3_months":
        case "last_6_months":
          // For time-based grouping, we'll group by month within the selected period
          groupKey = getMonthYear(item.StartDate);
          break;
        default:
          groupKey = "All Records";
      }

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {});

    // Sort groups by date for time-based grouping
    const entries = Object.entries(grouped);

    if (["last_month", "last_3_months", "last_6_months"].includes(field)) {
      entries.sort(([a], [b]) => {
        const dateA = new Date(a + " 1"); // Add day to make it a valid date
        const dateB = new Date(b + " 1");
        return dateB.getTime() - dateA.getTime(); // Sort newest first
      });
    }

    return entries.map(
      ([groupName, items]: [string, any]): GroupedData => ({
        groupName,
        items,
        count: items.length,
        isGroup: true,
      }),
    );
  };

  const toggleGroupExpansion = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleAllGroups = (expand: boolean) => {
    if (expand) {
      setExpandedGroups(new Set(groupedData.map((group) => group.groupName)));
    } else {
      setExpandedGroups(new Set());
    }
  };

  const handleGroupByChange = async (value: string) => {
    setGroupBy(value);

    if (value === "none") {
      setGroupedData([]);
      setExpandedGroups(new Set());
      // Fetch current data without date filters
      dispatch(EmployeeAttendanceApi({}) as any);
      return;
    }

    // Handle time-based grouping options
    if (["last_month", "last_3_months", "last_6_months"].includes(value)) {
      try {
        switch (value) {
          case "last_month":
            // Only previous month's data
            const lastMonthRange = getLastMonthDateRange();
            console.log("Fetching last month data:", lastMonthRange.label);
            console.log(
              `API call: date_from=${lastMonthRange.date_from}, date_to=${lastMonthRange.date_to}`,
            );
            await fetchAttendanceForDateRange(
              lastMonthRange.date_from,
              lastMonthRange.date_to,
            );
            break;

          case "last_3_months":
            // Previous 3 months (excluding current month)
            const last3MonthsRange = getLastNMonthsDateRange(3);
            console.log(`Fetching last 3 months: ${last3MonthsRange.label}`);
            console.log(
              `API call: date_from=${last3MonthsRange.date_from}, date_to=${last3MonthsRange.date_to}`,
            );
            await fetchAttendanceForDateRange(
              last3MonthsRange.date_from,
              last3MonthsRange.date_to,
            );
            break;

          case "last_6_months":
            // Previous 6 months (excluding current month)
            const last6MonthsRange = getLastNMonthsDateRange(6);
            console.log(`Fetching last 6 months: ${last6MonthsRange.label}`);
            console.log(
              `API call: date_from=${last6MonthsRange.date_from}, date_to=${last6MonthsRange.date_to}`,
            );
            await fetchAttendanceForDateRange(
              last6MonthsRange.date_from,
              last6MonthsRange.date_to,
            );
            break;
        }

        // The grouping will be handled in the useEffect when data is updated
        return;
      } catch (error) {
        console.error("Error fetching time-based data:", error);
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

  // Update grouped data when main data changes
  useEffect(() => {
    if (data.length > 0 && groupBy !== "none") {
      // For time-based grouping, we need to regroup the data after API call
      if (["last_month", "last_3_months", "last_6_months"].includes(groupBy)) {
        const grouped = groupDataByField(data, groupBy);
        setGroupedData(grouped);

        // Expand first group by default
        if (grouped.length > 0) {
          setExpandedGroups(new Set([grouped[0].groupName]));
        }
      } else {
        // For regular grouping, use the existing logic
        const grouped = groupDataByField(data, groupBy);
        setGroupedData(grouped);

        if (grouped.length > 0) {
          setExpandedGroups(new Set([grouped[0].groupName]));
        }
      }
    }
  }, [data, groupBy]);

  const renderGroupedTable = () => {
    if (groupBy === "none") {
      return <DatatableKHR data={data} columns={columns} selection={true} />;
    }

    return (
      <div className="grouped-table">
        {groupedData.map((group: GroupedData, groupIndex: number) => (
          <div
            key={`group-${groupIndex}-${group.groupName}`}
            className="group-section mb-4"
            style={{
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {/* Group Header */}
            <div
              className="group-header bg-light p-3 border rounded cursor-pointer d-flex justify-content-between align-items-center"
              onClick={() => toggleGroupExpansion(group.groupName)}
              style={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e9ecef",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
              }}
            >
              <div className="d-flex align-items-center">
                <i
                  className={`ti ${expandedGroups.has(group.groupName) ? "ti-chevron-down" : "ti-chevron-right"} me-2`}
                ></i>
                <h6 className="mb-0 fw-bold">{group.groupName}</h6>
                <span className="badge badge-primary ms-2">
                  {group.count} records
                </span>
              </div>
              <div className="group-stats">
                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="ti ti-users me-1"></i>
                    Total: <strong>{group.count}</strong>
                  </small>
                  <small className="text-success">
                    <i className="ti ti-check me-1"></i>
                    Present:{" "}
                    <strong>
                      {
                        group.items.filter(
                          (item: AttendanceAdminData) =>
                            item.Status === "Present",
                        ).length
                      }
                    </strong>
                  </small>
                  <small className="text-danger">
                    <i className="ti ti-x me-1"></i>
                    Absent:{" "}
                    <strong>
                      {
                        group.items.filter(
                          (item: AttendanceAdminData) =>
                            item.Status === "Absent",
                        ).length
                      }
                    </strong>
                  </small>
                  {groupBy === "regularization" && (
                    <small className="text-warning">
                      <i className="ti ti-clock me-1"></i>
                      Pending:{" "}
                      <strong>
                        {
                          group.items.filter(
                            (item: AttendanceAdminData) =>
                              item.regularizationStatus === "pending",
                          ).length
                        }
                      </strong>
                    </small>
                  )}
                  {["last_month", "last_3_months", "last_6_months"].includes(
                    groupBy,
                  ) && (
                    <small className="text-info">
                      <i className="ti ti-calendar me-1"></i>
                      Period: <strong>{group.groupName}</strong>
                    </small>
                  )}
                </div>
              </div>
            </div>

            {/* Group Content */}
            {expandedGroups.has(group.groupName) && (
              <div
                className="group-content mt-2"
                style={{ borderTop: "1px solid #e9ecef" }}
              >
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

  useEffect(() => {
    if (!EmployeeAttendanceApiData?.data?.attendance_records) return;

    const attendanceData = EmployeeAttendanceApiData.data;
    const { attendance_records, working_hours_summary } = attendanceData;

    // Safety check for attendance_records
    if (!attendance_records || !Array.isArray(attendance_records)) {
      console.warn("attendance_records is not available or not an array");
      return;
    }

    // 🧮 Calculations
    const totalWorkingHours = attendance_records.reduce(
      (sum: number, r: any) => sum + Number(r.total_working_hours || 0),
      0,
    );

    console.log(totalWorkingHours, "totalWorkingHours");

    const productiveHours = attendance_records.reduce(
      (sum: number, r: any) => sum + Number(r.total_productive_hours || 0),
      0,
    );

    const overtimeHours = attendance_records.reduce(
      (sum: number, r: any) =>
        Number(r.overtime_hours) > 0 ? sum + Number(r.overtime_hours) : sum,
      0,
    );

    const breakHours =
      Number(working_hours_summary?.today?.total_break_hours) || 0;

    // 🧾 Build stats
    const stats: any[] = [
      {
        label: "Total Working Hours",
        value: formatHours(totalWorkingHours),
        color: "dark",
      },
      {
        label: "Productive Hours",
        value: formatHours(productiveHours),
        color: "success",
      },
      {
        label: "Break Hours",
        value: formatHours(breakHours),
        color: "warning",
      },
      {
        label: "Overtime",
        value: formatHours(overtimeHours),
        color: "info",
      },
    ];

    console.log("Final Work Stats 👉", stats);

    setWorkStats(stats);
  }, [EmployeeAttendanceApiData]);

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
      title: "Regularization Status",
      dataIndex: "regularizationStatus",
      render: (status: string, record: AttendanceAdminData) => {
        if (!record.hasRegularization) {
          return <span className="text-muted">-</span>;
        }

        const statusConfig = {
          pending: { class: "badge-warning", text: "Pending" },
          approved: { class: "badge-success", text: "Approved" },
          rejected: { class: "badge-danger", text: "Rejected" },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || {
          class: "badge-secondary",
          text: status || "Unknown",
        };

        return (
          <div>
            <span
              className={`badge ${config.class} d-inline-flex align-items-center`}
            >
              <i className="ti ti-point-filled me-1" />
              {config.text}
            </span>
            {status === "rejected" && record.rejectedReason && (
              <div className="mt-1">
                <small className="text-danger">
                  <strong>Reason:</strong> {record.rejectedReason}
                </small>
              </div>
            )}
          </div>
        );
      },
    },

    {
      title: "Action",
      dataIndex: "actions",
      render: (_: any, record: AttendanceAdminData) => {
        const today = new Date().toISOString().split("T")[0];
        const isToday = record.StartDate === today;
        const hasRegularization = record.hasRegularization;

        // Don't show button if it's today's attendance or already has regularization
        if (isToday || hasRegularization) {
          return (
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled
              title={
                isToday
                  ? "Cannot raise query for today's attendance"
                  : "Query already raised"
              }
            >
              {hasRegularization ? "Query Raised" : "Not Available"}
            </button>
          );
        }

        return (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => {
              setSelectedAttendancee(record);
              setShowQueryModal(true);
            }}
          >
            Raise Query
          </button>
        );
      },
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => {}}>
            <CommonHeader
              title="Employee Attendance"
              parentMenu="Employee"
              activeMenu="Employee Attendance"
              routes={routes}
              rightActions={
                <>
                  {/* Group By Dropdown */}
                  <div className="dropdown me-2">
                    <button
                      className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-layout-grid me-1" />
                      {groupByOptions.find((opt) => opt.value === groupBy)
                        ?.label || "Group By"}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      {groupByOptions.map((option) => (
                        <li key={option.value}>
                          <button
                            className={`dropdown-item ${groupBy === option.value ? "active" : ""}`}
                            onClick={() => handleGroupByChange(option.value)}
                          >
                            <i
                              className={`ti ${groupBy === option.value ? "ti-check" : "ti-point"} me-2`}
                            />
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* View Switch */}
                  <div className="d-flex border bg-white rounded p-1 me-2">
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
                  <div className="dropdown me-2">
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
                          disabled={isEmployeeAttendanceExportPdfFetching}
                        >
                          <i className="ti ti-file-type-pdf me-1" />
                          {isEmployeeAttendanceExportPdfFetching
                            ? "Exporting..."
                            : "PDF"}
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleExportExcel}
                          disabled={isEmployeeAttendanceExportExcelFetching}
                        >
                          <i className="ti ti-file-type-xls me-1" />
                          {isEmployeeAttendanceExportExcelFetching
                            ? "Exporting..."
                            : "Excel"}
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
                      {CheckinCheckoutData.user?.greeting || "Hello"},{" "}
                      {CheckinCheckoutData.user?.name || "User"}
                    </h6>

                    <h4>
                      {datass?.check_in_time
                        ? formatTime(datass.check_in_time)
                        : "--:--"}
                    </h4>
                    {/* <small>
                      {datass?.check_in_time
                        ? formatDate(datass.check_in_time)
                        : "Not Checked In Yet"}
                    </small> */}
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
                      {getCurrentAttendanceStatusData?.status ===
                        "CheckedOut" &&
                      getCurrentAttendanceStatusData?.action_time
                        ? `Checked Out at ${formatTime(getCurrentAttendanceStatusData.action_time)}`
                        : getCurrentAttendanceStatusData?.status ===
                              "CheckedIn" &&
                            getCurrentAttendanceStatusData?.action_time
                          ? `Checked In at ${formatTime(getCurrentAttendanceStatusData.action_time)}`
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

                <WorkStatsWithTimeline stats={workStats} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body p-0">
              {isEmployeeAttendanceApiFetching ? (
                <div className="text-center p-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                  <div className="mt-2">Loading Attendance...</div>
                </div>
              ) : (
                <>
                  {/* Group By Info */}
                  {groupBy !== "none" && (
                    <div className="alert alert-info m-3 mb-0 d-flex justify-content-between align-items-center">
                      <div>
                        <i className="ti ti-info-circle me-2"></i>
                        <strong>Grouped by:</strong>{" "}
                        {
                          groupByOptions.find((opt) => opt.value === groupBy)
                            ?.label
                        }
                        <span className="ms-2">
                          ({groupedData.length} groups, {data.length} total
                          records)
                        </span>
                        {[
                          "last_month",
                          "last_3_months",
                          "last_6_months",
                        ].includes(groupBy) && (
                          <span className="ms-2 badge badge-info">
                            <i className="ti ti-calendar me-1"></i>
                            {groupBy === "last_month" && "Previous Month Only"}
                            {groupBy === "last_3_months" && "Previous 3 Months"}
                            {groupBy === "last_6_months" && "Previous 6 Months"}
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
                  <div className="p-3">{renderGroupedTable()}</div>
                </>
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
          onSuccess={() => {
            // Refresh regularization status after successful submission
            dispatch(getRegularizationStatus() as any);
          }}
        />
      )}
    </>
  );
};

export default EmployeeAttendanceKHR;
