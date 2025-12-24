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

      const mappedData: WorkingScheduleType[] = safeResult.map(
        (item: APIWorkingSchedule) => ({
          id: String(item.id),
          key: String(item.id),
          name: typeof item.name === "string" ? item.name : "-",
          flexible_hours: item.flexible_hours || false,
          is_night_shift: item.is_night_shift || false,
          full_time_required_hours: item.full_time_required_hours || 0,
          tz: typeof item.tz === "string" ? item.tz : "-",
          // Map other fields if needed for editing
        })
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
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_working_schedule"
            onClick={() => setSelectedSchedule(record)}
          >
            <i className="ti ti-edit" />
          </Link>
          <Link to="#" onClick={() => handleDelete(record.id!)}>
            <i className="ti ti-trash" />
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
                  <div className="text-center p-4">Loading data...</div>
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
