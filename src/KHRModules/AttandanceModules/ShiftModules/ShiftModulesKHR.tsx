import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { all_routes } from "@/router/all_routes";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";

// JSON DATA
import scheduleTimingData from "./ScheduleTiming.json";

// TYPE
interface ScheduleTimingData {
  id: string;
  name: string;
  jobTitle: string;
  image: string;
}

const ShiftModulesKHR = () => {
  const routes = all_routes;

  const [data, setData] = useState<ScheduleTimingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load JSON data
  useEffect(() => {
    setData(scheduleTimingData.data);
    setLoading(false);
  }, []);

  // TABLE COLUMNS
  const columns = [
    {
      title: "Employee",
      dataIndex: "name",
      render: (_text: string, record: ScheduleTimingData) => (
        <div className="d-flex align-items-center file-name-icon">
          <span className="avatar avatar-md border avatar-rounded">
            <ImageWithBasePath
              src={`assets/img/users/${record.image}`}
              className="img-fluid"
              alt={`${record.name} Profile`}
            />
          </span>
          <div className="ms-2">
            <h6 className="fw-medium mb-0">{record.name}</h6>
            <span className="fs-12 text-muted">{record.jobTitle}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      sorter: (a: ScheduleTimingData, b: ScheduleTimingData) =>
        a.jobTitle.localeCompare(b.jobTitle),
    },
    {
      title: "Schedule Timing",
      dataIndex: "action",
      render: () => (
        <button
          type="button"
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#schedule_timing"
        >
          Schedule Timing
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <CommonHeader
            title="Schedule Timing"
            parentMenu="Administration"
            activeMenu="Schedule Timing"
            routes={routes}
          />

          <div className="card">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" />
                  <div className="mt-2">Loading...</div>
                </div>
              ) : (
                <DatatableKHR data={data} columns={columns} selection={false} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Timing Modal */}
      <div
        className="modal fade"
        id="schedule_timing"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Schedule Timing</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="modal-body">
              <p className="text-muted">Schedule timing form will come here.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShiftModulesKHR;
