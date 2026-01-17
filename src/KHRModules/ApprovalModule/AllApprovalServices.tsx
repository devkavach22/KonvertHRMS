// --- API Functions ---

import Instance from "@/api/axiosInstance";

// Helper to get current user ID
const getCurrentUserId = () => {
  return localStorage.getItem("user_id");
};

/**
 * Fetch approval requests
 */
export const getApprovalRequests = async (userId?: string | number) => {
  const id = userId || getCurrentUserId();
  return await Instance.get(`/api/admin/requests?user_id=${id}`);
};

/**
 * Approve a request
 * POST http://localhost:4000/api/admin/approve
 * Body: { regularization_id: 36, user_id: 3145 }
 */
export const approveRequest = async (regularizationId: string | number) => {
  const payload = {
    approval_request_id: regularizationId,
    user_id: getCurrentUserId(),
  };
  return await Instance.post(`/api/admin/approve`, payload);
};

/**
 * Reject a request
 * POST http://localhost:4000/api/admin/reject
 * Body: { regularization_id: 41, user_id: 3145, remarks: "..." }
 */
export const rejectRequest = async (
  approval_request_id: string | number,
  remarks: string
) => {
  const payload = {
    approval_request_id: approval_request_id,
    user_id: getCurrentUserId(),
    remarks: remarks,
  };
  return await Instance.post(`/api/admin/reject`, payload);
};
