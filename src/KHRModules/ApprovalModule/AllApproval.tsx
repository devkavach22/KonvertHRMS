import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import {
  getApprovalRequests,
  approveRequest,
  rejectRequest,
} from "./AllApprovalServices";
import { all_routes } from "@/router/all_routes";
import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";

const AllApproval = () => {
  const routes = all_routes;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // --- Modal State ---
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<
    number | string | null
  >(null);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper: Extract Date from Description string
  const extractDate = (desc: string) => {
    if (!desc) return null;
    const match = desc.match(/\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : null;
  };

  // --- Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getApprovalRequests(3145);

      const list = Array.isArray(result.data?.data)
        ? result.data.data
        : Array.isArray(result.data)
        ? result.data
        : [];

      // Note: mapping 'id' from API to 'attendance_regulzie_id' if that's the ID needed for approval
      // Based on your JSON, 'id' is the request ID. If API needs 'attendance_regulzie_id', change mappedData below.
      const mappedData = list.map((item: any) => ({
        ...item,
        key: item.id,
        // Ensure we pass the correct ID to the API.
        // If API needs the main ID: item.id.
        // If API needs regularization ID: item.attendance_regulzie_id[0]
        regularization_id: Array.isArray(item.attendance_regulzie_id)
          ? item.attendance_regulzie_id[0]
          : item.id,

        employee_name: Array.isArray(item.req_employee_id)
          ? item.req_employee_id[1]
          : "Unknown",
        display_date:
          extractDate(item.description) || moment().format("YYYY-MM-DD"),
        status_code: item.state,
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load approval requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Approve Handler ---
  const handleApprove = async (regId: string | number) => {
    if (window.confirm("Are you sure you want to APPROVE this request?")) {
      try {
        await approveRequest(regId);
        toast.success("Request Approved Successfully");
        fetchData();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to approve request"
        );
      }
    }
  };

  // --- Reject Handlers (Open Modal) ---
  const openRejectModal = (regId: string | number) => {
    setSelectedRequestId(regId);
    setRejectRemarks(""); // Clear previous remarks
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedRequestId(null);
  };

  const submitReject = async () => {
    if (!selectedRequestId) return;
    if (!rejectRemarks.trim()) {
      toast.error("Please enter remarks for rejection.");
      return;
    }

    setIsSubmitting(true);
    try {
      await rejectRequest(selectedRequestId, rejectRemarks);
      toast.warning("Request Rejected");
      closeRejectModal();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Columns Configuration ---
  const columns: any[] = [
    {
      title: "Date",
      dataIndex: "display_date",
      render: (val: any) => (
        <span>{val ? moment(val).format("YYYY-MM-DD") : "-"}</span>
      ),
      sorter: (a: any, b: any) =>
        moment(a.display_date).valueOf() - moment(b.display_date).valueOf(),
    },
    {
      title: "Request ID",
      dataIndex: "name",
      render: (val: any) => (
        <span className="fw-medium text-primary">{val}</span>
      ),
    },
    {
      title: "Employee",
      dataIndex: "employee_name",
      render: (val: any) => <span className="fw-bold text-dark">{val}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (val: any) => (
        <span
          className="text-wrap"
          style={{ maxWidth: "300px", display: "block" }}
        >
          {val || "-"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "state",
      render: (val: string) => {
        let badgeClass = "bg-light-warning text-warning";
        let label = "Pending";

        if (val === "approved") {
          badgeClass = "bg-light-success text-success";
          label = "Approved";
        } else if (val === "reject" || val === "rejected") {
          badgeClass = "bg-light-danger text-danger";
          label = "Rejected";
        } else if (val === "submit" || val === "submitted") {
          badgeClass = "bg-light-info text-info";
          label = "Submitted";
        }

        return <span className={`badge ${badgeClass} border`}>{label}</span>;
      },
    },
    {
      title: "Actions",
      dataIndex: "regularization_id", // Using the ID specifically meant for API actions
      render: (_: any, record: any) => (
        <div className="action-icon d-inline-flex align-items-center gap-2">
          {record.state === "submit" || record.state === "submitted" ? (
            <>
              <button
                className="btn btn-sm btn-outline-success border-0 d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
                onClick={() => handleApprove(record.regularization_id)}
                title="Approve"
              >
                <i className="ti ti-check fs-16" />
              </button>
              <button
                className="btn btn-sm btn-outline-danger border-0 d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
                onClick={() => openRejectModal(record.regularization_id)}
                title="Reject"
              >
                <i className="ti ti-x fs-16" />
              </button>
            </>
          ) : (
            <span className="text-muted fs-12 fst-italic">
              {record.state === "approved" ? (
                <span className="text-success">
                  <i className="ti ti-check-double me-1" /> Approved
                </span>
              ) : (
                <span className="text-danger">
                  <i className="ti ti-ban me-1" /> Rejected
                </span>
              )}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <CommonHeader
            title="Approval Requests"
            parentMenu="Admin"
            activeMenu="Approvals"
            routes={routes}
            buttonText=""
            modalTarget=""
          />

          <div className="card mb-3 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Pending Requests</h5>
              <div className="mt-3">
                <DatatableKHR columns={columns} data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- REJECT MODAL --- */}
      {showRejectModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title fw-bold text-danger">
                  Reject Request
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeRejectModal}
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label fw-bold">
                  Reason for Rejection <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Enter remarks (e.g., Not eligible for this date)"
                  value={rejectRemarks}
                  onChange={(e) => setRejectRemarks(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer border-top-0">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={closeRejectModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={submitReject}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Rejecting..." : "Confirm Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllApproval;
