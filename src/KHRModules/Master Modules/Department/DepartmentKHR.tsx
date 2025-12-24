import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddDepartmentModal from "./AddDepartmentModal";

// Service Imports
import {
  getDepartments,
  deleteDepartment,
  Department,
} from "./departmentService";
import { toast } from "react-toastify";

const DepartmentKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  // 1. Fetch & Map Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getDepartments();

      // Safety Check: Backend might return { data: [...] } or just [...]
      const rawArray = Array.isArray(response)
        ? response
        : response?.data && Array.isArray(response.data)
        ? response.data
        : [];

      const mappedData: Department[] = rawArray.map((item: any) => ({
        id: String(item.id),
        key: String(item.id), // Datatable often requires a unique key
        Department_Name: item.name || "-",
        Department_Head: item.manager?.name || "No Manager",
        Created_Date: item.created_at || "-",
        Status: "Active",
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load departments", error);
      toast.error("Failed to load department list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        toast.success("Department deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete department");
      }
    }
  };

  // 2. Define Columns - Ensure dataIndex matches the keys in mappedData
  const columns = [
    {
      title: "Department Name",
      dataIndex: "Department_Name",
      render: (text: string) => (
        <span className="fs-14 fw-medium text-dark">{text}</span>
      ),
      sorter: (a: Department, b: Department) =>
        a.Department_Name.localeCompare(b.Department_Name),
    },
    // {
    //   title: "Department Head",
    //   dataIndex: "Department_Head",
    //   sorter: (a: Department, b: Department) =>
    //     a.Department_Head.localeCompare(b.Department_Head),
    // },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: Department) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_department"
            onClick={() => setSelectedDepartment(record)}
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
      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => setSelectedDepartment(null)}>
            <CommonHeader
              title="Department"
              parentMenu="HR"
              activeMenu="Department"
              routes={routes}
              buttonText="Add Department"
              modalTarget="#add_department"
            />
          </div>

          <div className="card">
            <div className="card-body p-0">
              {" "}
              {/* Adjusted padding for better table fit */}
              {loading ? (
                <div className="text-center p-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                  <div className="mt-2">Loading Departments...</div>
                </div>
              ) : (
                <DatatableKHR
                  data={data}
                  columns={columns}
                  selection={true}
                  // Ensure these keys match what DatatableKHR expects
                  textKey="Department_Name"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <AddDepartmentModal onSuccess={fetchData} data={selectedDepartment} />
    </>
  );
};

export default DepartmentKHR;
