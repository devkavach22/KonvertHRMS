import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditLeaveRequestModal from "./AddEditLeaveRequestModal";
import moment from "moment";

import { getLeaveRequests, deleteLeaveRequest } from "./LeaveRequestServices";

const LeaveRequestKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);

  // --- Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getLeaveRequests();
      const safeResult = Array.isArray(result.data.data)
        ? result.data?.data
        : [];

      const mappedData = safeResult.map((item: any) => ({
        id: item.id,
        employee_name: item.employee_name || item.employee_id,
        company_name: item.company_name || item.company_id,
        department_name: item.department_name || item.department_id,
        leave_type: item.leave_type_name,
        from_date: item.from_date,
        to_date: item.to_date,
        status: item.status,
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load leave requests", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Initial Load ---
  useEffect(() => {
    fetchData();
  }, []);

  // --- Delete Handler ---
  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this leave request?")) {
      try {
        await deleteLeaveRequest(Number(id));
        fetchData(); // Refresh the list after successful deletion
      } catch (error) {
        console.error("Error deleting leave request:", error);
        alert("Failed to delete leave request.");
      }
    }
  };

  // --- Columns Definition ---
  const columns: any[] = [
    {
      title: "ID",
      dataIndex: "id",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) => (a.id || 0) - (b.id || 0),
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) =>
        String(a.employee_name || "").localeCompare(
          String(b.employee_name || "")
        ),
    },
    // {
    //   title: "Company Name",
    //   dataIndex: "company_name",
    //   render: (val: any) => <span>{val || "-"}</span>,
    //   sorter: (a: any, b: any) =>
    //     String(a.company_name || "").localeCompare(
    //       String(b.company_name || "")
    //     ),
    // },
    // {
    //   title: "Department Name",
    //   dataIndex: "department_name",
    //   render: (val: any) => <span>{val || "-"}</span>,
    //   sorter: (a: any, b: any) =>
    //     String(a.department_name || "").localeCompare(
    //       String(b.department_name || "")
    //     ),
    // },
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) =>
        String(a.leave_type || "").localeCompare(String(b.leave_type || "")),
    },
    {
      title: "From Date",
      dataIndex: ["validity", "from"],
      render: (val: string) =>
        val ? moment(val, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD") : "-",
      sorter: (a: any, b: any) =>
        moment(a.validity?.from).valueOf() - moment(b.validity?.from).valueOf(),
    },

    {
      title: "To Date",
      dataIndex: ["validity", "to"],
      render: (val: string) =>
        val ? moment(val, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD") : "-",
      sorter: (a: any, b: any) =>
        moment(a.validity?.to).valueOf() - moment(b.validity?.to).valueOf(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (val: any) => <span>{val || "-"}</span>,
      sorter: (a: any, b: any) =>
        String(a.status || "").localeCompare(String(b.status || "")),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: any) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_leave_request"
            onClick={() => {
              setSelectedPolicy(record);
              const jq = (window as any).jQuery || (window as any).$;
              if (
                jq &&
                typeof jq === "function" &&
                jq("#add_leave_request").modal
              ) {
                try {
                  jq("#add_leave_request").modal("show");
                } catch (e) {
                  // ignore if modal call fails
                }
              }
            }}
          >
            <i className="ti ti-edit text-blue" />
          </Link>
          <Link to="#" onClick={() => handleDelete(record.id)}>
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
            <div onClick={() => setSelectedPolicy(null)}>
              <CommonHeader
                title="Leave Request"
                parentMenu="HR"
                activeMenu="Leave Request"
                routes={routes}
                buttonText="Add leave Request"
                modalTarget="#add_leave_request"
              />
            </div>

            {/* Leave Type List */}
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Leave List</h5>

                <div className="mt-3">
                  <DatatableKHR columns={columns} data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <AddEditLeaveRequestModal onSuccess={fetchData} data={selectedPolicy} />
      </div>
    </>
  );
};

export default LeaveRequestKHR;
