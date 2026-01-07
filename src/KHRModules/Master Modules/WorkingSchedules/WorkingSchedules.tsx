import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditWorkingSchedulesModal from "./AddEditWorkingSchedulesModal";

import {
  getWorkingSchedules,
  deleteWorkingSchedule,
  WorkingSchedule as WorkingScheduleType,
  APIWorkingSchedule,
} from "./WorkingSchedulesServices";

const WorkingSchedules = () => {
  const routes = all_routes;
  const [data, setData] = useState<WorkingScheduleType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSchedule, setSelectedSchedule] =
    useState<WorkingScheduleType | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getWorkingSchedules();
      const safeResult = Array.isArray(result) ? result : [];

      console.log("API Result:", safeResult); // Debugging log

      const mappedData: WorkingScheduleType[] = safeResult.map(
        (item: APIWorkingSchedule) => {
          // Extract the first attendance line for the Edit Modal (if available)
          const firstDetail =
            item.attendance_ids && item.attendance_ids.length > 0
              ? item.attendance_ids[0]
              : null;

          return {
            id: String(item.id),
            key: String(item.id),
            name: typeof item.name === "string" ? item.name : "-",
            flexible_hours: item.flexible_hours || false,
            is_night_shift: item.is_night_shift || false,
            full_time_required_hours: item.full_time_required_hours || 0,
            tz: typeof item.tz === "string" ? item.tz : "-",

            // Map details for the Edit Modal
            dayofweek: firstDetail ? String(firstDetail.dayofweek) : "0",
            day_period: firstDetail ? firstDetail.day_period : "morning",
            hour_from: firstDetail ? firstDetail.hour_from : 8.0,
            hour_to: firstDetail ? firstDetail.hour_to : 17.0,
            // Assuming duration/work_entry_type might be missing in JSON, provide defaults
            duration_days: 1.0,
            work_entry_type_id: 0,
          };
        }
      );

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load schedules", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      await deleteWorkingSchedule(id);
      fetchData();
    }
  };

  const openModal = (record: WorkingScheduleType | null) => {
    setSelectedSchedule(record);
    const modal = document.getElementById("add_working_schedule");
    // @ts-ignore
    if (modal && window.bootstrap) {
      // @ts-ignore
      const modalInstance = new window.bootstrap.Modal(modal);
      modalInstance.show();
    }
  };

  const columns = [
    {
      title: "Schedule Name",
      dataIndex: "name",
      render: (text: string) => <h6 className="fs-14 fw-medium">{text}</h6>,
      sorter: (a: WorkingScheduleType, b: WorkingScheduleType) =>
        a.name.length - b.name.length,
    },
    {
      title: "Avg Hours",
      dataIndex: "full_time_required_hours",
    },
    {
      title: "Flexible?",
      dataIndex: "flexible_hours",
      render: (val: boolean) => (
        <span
          className={`badge ${val ? "bg-success-light" : "bg-danger-light"}`}
        >
          {val ? "Yes" : "No"}
        </span>
      ),
    },
    {
      title: "Timezone",
      dataIndex: "tz",
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: WorkingScheduleType) => (
        <div className="action-icon d-inline-flex">
          {/* Using simple Link with onClick to handle Modal state properly */}
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_working_schedule"
            onClick={() => setSelectedSchedule(record)}
          >
            <i className="ti ti-edit text-blue" />
          </Link>
          <Link to="#" onClick={() => handleDelete(record.id!)}>
            <i className="ti ti-trash text-danger" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="main-wrapper">
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
            <div className="card">
              <div className="card-body">
                {loading ? (
                  <div className="d-flex justify-content-center p-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <DatatableKHR
                    data={data}
                    columns={columns}
                    selection={true}
                    textKey="name"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <AddEditWorkingSchedulesModal
          onSuccess={fetchData}
          data={selectedSchedule}
        />
      </div>
    </>
  );
};

export default WorkingSchedules;
