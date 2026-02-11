import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditBranchModal from "./AddEditBranchModal";
import { getBranches, Branch, deleteBranch } from "./BranchServices";
import { toast } from "react-toastify";
import { all_routes } from "@/router/all_routes";
import AddEditWorkLocationModal from "../WorkLocation/AddEditWorkLocationModal";

const BranchKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // NEW STATES FOR WORK LOCATION
  const [selectedWorkLocation, setSelectedWorkLocation] = useState<any | null>(
    null,
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getBranches();
      const mappedData = result.map((item: any) => ({
        ...item,
        id: String(item.id),
        key: String(item.id),
        created_date: item.create_date || "-",
      }));
      setData(mappedData);
    } catch (error) {
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        await deleteBranch(id);
        toast.success("Branch deleted successfully");
        fetchData(); // Refresh the list
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const columns = [
    {
      title: "Branch Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <div className="d-flex flex-column">
          <h6 className="fs-14 fw-bold text-dark mb-0">{text}</h6>
          <small className="text-muted fs-11">{record.client_name}</small>
        </div>
      ),
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "GST Number",
      dataIndex: "gst_number",
      render: (gst: string) => (
        <span className="badge bg-soft-warning text-warning border-warning-subtle px-2 py-1 fw-bold">
          {gst || "N/A"}
        </span>
      ),
    },
    {
      title: "Location",
      dataIndex: "city_name",
      render: (_: any, record: any) => (
        <div className="d-flex align-items-center">
          <i className="ti ti-map-pin-2 me-2 text-primary fs-16"></i>
          <div className="d-flex flex-column">
            <span className="fs-13 fw-medium text-secondary">
              {record.city_name || "-"}
            </span>
            <small className="text-muted">{record.state_name || "-"}</small>
          </div>
        </div>
      ),
    },
    {
      title: "Full Address",
      dataIndex: "address",
      render: (address: string) => (
        <span
          className="text-muted fs-12 d-inline-block text-truncate"
          style={{ maxWidth: "200px" }}
          title={address}
        >
          {address}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: any) => (
        <div className="d-flex align-items-center gap-2">
          {/* ADD WORK LOCATION BUTTON - Blue/Info Theme */}
          <Link
            to="#"
            className="btn btn-sm btn-soft-info d-inline-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px", borderRadius: "6px" }}
            title="Add Work Location"
            data-bs-toggle="modal"
            data-bs-target="#add_work_location"
            onClick={() => setSelectedWorkLocation(record.id)}
          >
            <i className="ti ti-map-pin-plus fs-16"></i>
          </Link>

          {/* EDIT BRANCH BUTTON - Orange/Primary Theme */}
          <Link
            to="#"
            className="btn btn-icon btn-sm btn-soft-primary"
            title="Edit Branch"
            data-bs-toggle="modal"
            data-bs-target="#add_branch_modal"
            onClick={() => setSelectedBranch(record)}
          >
            <i className="ti ti-edit" />
          </Link>
          <Link
            to="#"
            className="btn btn-icon btn-sm btn-soft-danger"
            onClick={() => handleDelete(record.id)}
          >
            <i className="ti ti-trash" />
          </Link>
        </div>
      ),
    },
  ];
  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => setSelectedBranch(null)}>
            <CommonHeader
              title="Branches"
              parentMenu="HR"
              routes={routes}
              activeMenu="Branch Management"
              buttonText="Add Branch"
              modalTarget="#add_branch_modal"
            />
          </div>
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {loading ? (
                <div className="text-center p-4">Loading branches...</div>
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

      {/* BRANCH MODAL */}
      <AddEditBranchModal onSuccess={fetchData} data={selectedBranch} />

      {/* WORK LOCATION MODAL */}
      <AddEditWorkLocationModal
        onSuccess={() => {
          fetchData();
          setSelectedWorkLocation(null);
        }}
        data={selectedWorkLocation}
        onClose={() => setSelectedWorkLocation(null)}
      />
    </div>
  );
};

export default BranchKHR;
