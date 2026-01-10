import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditLeaveTypesModal from "./AddEditLeaveTypesModal";
import { getAllLeaveTypes,deleteLeaveType } from "./LeavetypesServices";


// service imports removed (not used here) — keep file focused on UI

const LeaveAdminKHR = () => { 
  const routes = all_routes;
  const [data, setData] = useState<any[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      const response = await getAllLeaveTypes();
      const leaveTypes = response.data || [];
      setData(leaveTypes);
    } catch (err) {
      console.error("Failed to fetch leave types:", err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this leave type?")) {
      try {
        await deleteLeaveType(id);
        fetchData(); // Refresh the list
      } catch (error) {
        console.error("Error deleting leave type:", error);
        alert("Failed to delete leave type.");
      }
    }
  };

  const columns: any[] = [
    {
      title: "Name",
      dataIndex: "name",
      render: (val: any) => <span>{val ? String(val) : "-"}</span>,
      sorter: (a: any, b: any) => String(a?.name ?? "").localeCompare(String(b?.name ?? "")),
    },
    {
      title: "Leave Type Code",
      dataIndex: "leave_type_code",
      render: (val: any) => <span>{val ? String(val) : "-"}</span>,
      sorter: (a: any, b: any) => String(a?.leave_type_code ?? "").localeCompare(String(b?.leave_type_code ?? "")),
    },
    {
      title: "Leave Category",
      dataIndex: "leave_category",
      render: (val: any) => <span>{val ? String(val) : "-"}</span>,
      sorter: (a: any, b: any) => String(a?.leave_category ?? "").localeCompare(String(b?.leave_category ?? "")),
    },
    {
      title: "Leave Validation Type",
      dataIndex: "leave_validation_type",
      render: (val: any) => <span>{val ? String(val) : "-"}</span>,
      sorter: (a: any, b: any) => String(a?.leave_validation_type ?? "").localeCompare(String(b?.leave_validation_type ?? "")),
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
            data-bs-target="#add_leave_type_modal"
            onClick={() => {
              setSelectedPolicy(record);
            }}
          >
            <i className="ti ti-edit text-blue" />
          </Link>
          <Link to="#" className="me-2" onClick={() => handleDelete(record.id)}>
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
                title="Leave "
                parentMenu="HR"
                activeMenu="Leave Admin"
                routes={routes}
                buttonText="Add Leave"
                modalTarget="#add_leave_type_modal"
              />
            </div>

          
          <DatatableKHR 
              columns={columns} 
              data={data} 
              
              />

          </div>
        </div>


        <AddEditLeaveTypesModal
          onSuccess={fetchData}
          data={selectedPolicy}
        />
      </div>
    </>
  );
};

export default LeaveAdminKHR;
