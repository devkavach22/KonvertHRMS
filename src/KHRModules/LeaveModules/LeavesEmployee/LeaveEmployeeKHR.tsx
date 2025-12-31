import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";

import {
  getEmployeeLeaveDashboard,
  deleteAttendancePolicy,
  EmployeeLeaveRecord,
  EmployeeLeaveMeta,
} from "./LeaveEmployeeServices";
import { all_routes } from "../../../router/all_routes";

const LeaveEmployeeKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<EmployeeLeaveRecord[]>([]);
  const [meta, setMeta] = useState<EmployeeLeaveMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    console.log("fetchData started");
    try {
      const response = await getEmployeeLeaveDashboard();
      console.log("API Response received:", response);

      if (response && (response.status === "success" || response.success)) {
        setMeta(response.meta || null);

        // Ensure we always have an array even if data is missing
        const rawList = Array.isArray(response.data) ? response.data : [];

        const mapped = rawList.map((item: any) => ({
          ...item,
          key: item.id ? String(item.id) : Math.random().toString(),
          type_name: Array.isArray(item.type) ? item.type[1] : item.type,
          from_date: item.from_date || item.start_date,
          to_date: item.to_date || item.end_date,
          approved_by_name: Array.isArray(item.approved_by)
            ? item.approved_by[1]
            : item.approved_by,
        }));

        setData(mapped);
      }
    } catch (err) {
      console.error("CRITICAL ERROR calling API:", err);
      toast.error("Network Error: Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Component mounted, calling API..."); // Add this log to verify
    fetchData();

    // Standardize the Modal ID to "add_leave_modal"
    const modal = document.getElementById("add_leave_modal");
    const handleHidden = () => setSelectedPolicy(null);

    modal?.addEventListener("hidden.bs.modal", handleHidden);
    return () => modal?.removeEventListener("hidden.bs.modal", handleHidden);
  }, []);

  const columns = [
    {
      title: "Leave Type",
      dataIndex: "type_name",
      render: (val: string) => (
        <span className="fw-bold text-dark">
          {val?.replace(/_/g, " ") || "-"}
        </span>
      ),
    },
    {
      title: "From",
      dataIndex: "from_date",
      render: (val: string) => (val ? moment(val).format("DD MMM YYYY") : "-"),
    },
    {
      title: "To",
      dataIndex: "to_date",
      render: (val: string) => (val ? moment(val).format("DD MMM YYYY") : "-"),
    },
    {
      title: "No of Days",
      dataIndex: "no_of_days",
      render: (val: number) => (
        <span className="badge bg-soft-info text-info">{val || 0} Days</span>
      ),
    },
    {
      title: "Approved By",
      dataIndex: "approved_by_name",
      render: (val: string) => <span>{val || "Pending"}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <span
          className={`badge ${
            status === "Approved"
              ? "bg-soft-success text-success"
              : "bg-soft-warning text-warning"
          }`}
        >
          {status || "Pending"}
        </span>
      ),
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <div className="action-icon d-inline-flex">
          <button
            className="btn btn-sm text-primary"
            data-bs-toggle="modal"
            data-bs-target="#add_leave_modal"
            onClick={() => setSelectedPolicy(record)}
          >
            <i className="ti ti-edit" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <CommonHeader
          title="My Leaves"
          parentMenu="Employee"
          activeMenu="Leaves"
          routes={routes}
          buttonText="Apply Leave"
          modalTarget="#add_leave_modal"
        />

        {/* Dynamic Cards */}
        <div className="row">
          {[
            {
              label: "Annual Leaves",
              val: meta?.annual_taken,
              rem: meta?.annual_remaining,
              cls: "bg-black-le",
              badge: "bg-secondary-transparent",
              icon: "ti-calendar-event",
            },
            {
              label: "Medical Leaves",
              val: meta?.medical_taken,
              rem: meta?.medical_remaining,
              cls: "bg-blue-le",
              badge: "bg-info-transparent",
              icon: "ti-vaccine",
            },
            {
              label: "Casual Leaves",
              val: meta?.casual_taken,
              rem: meta?.casual_remaining,
              cls: "bg-purple-le",
              badge: "bg-transparent-purple",
              icon: "ti-hexagon-letter-c",
            },
            {
              label: "Other Leaves",
              val: meta?.other_taken,
              rem: meta?.other_remaining,
              cls: "bg-pink-le",
              badge: "bg-pink-transparent",
              icon: "ti-hexagonal-prism-plus",
            },
          ].map((card, i) => (
            <div className="col-xl-3 col-md-6" key={i}>
              <div className={`card ${card.cls}`}>
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="text-start">
                      <p className="mb-1 text-white">{card.label}</p>
                      <h4 className="text-white">
                        {String(card.val || 0).padStart(2, "0")}
                      </h4>
                    </div>
                    <i className={`${card.icon} fs-32 text-white opacity-50`} />
                  </div>
                  <span className={`badge ${card.badge} mt-2`}>
                    Remaining : {card.rem || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <DatatableKHR data={data} columns={columns} selection={true} />
          </div>
        </div>
      </div>
      {/* <AddEditLeaveModal onSuccess={fetchData} data={selectedPolicy} /> */}
    </div>
  );
};

export default LeaveEmployeeKHR;
