import React, { useEffect, useState } from "react";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import AddEditEmployeeModal from "./AddEditEmployeeModal";
import { getEmployees, deleteEmployee, Employee } from "./EmployeeServices";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { all_routes } from "@/router/all_routes";
import EmployeeCard from "./EmployeeCard";

const EmployeeKHR = () => {
  const routes = all_routes;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [editData, setEditData] = useState<any>(null); // State for editing
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    const data = await getEmployees();
    setEmployees(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeleteEmployee = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return;

    try {
      // API requires employee ID and user_id=219
      await deleteEmployee(id.toString());
      toast.success("Employee deleted successfully");
      fetchEmployees(); // Refresh the grid
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete employee");
    }
  };

  const handleEditClick = (employee: any) => {
    setEditData(employee);
    const modalElement = document.getElementById("add_employee_modal");
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div onClick={() => setSelectedEmp(null)}>
          <CommonHeader
            title="Employees"
            parentMenu="HR"
            activeMenu="Employees"
            routes={routes}
            buttonText="Add Employee"
            modalTarget="#add_employee_modal"
          />
        </div>
        {/* <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center p-4">Loading...</div>
            ) : (
              <DatatableKHR data={employees} columns={columns} />
            )}
          </div>
        </div> */}
        {/* ... Inside your EmployeeKHR.tsx ... */}

        <div className="row mt-4">
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            employees.map((emp: any) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onEdit={handleEditClick}
                onDelete={handleDeleteEmployee}
              />
            ))
          )}
        </div>

        {/* Pass editData to the modal */}
        <AddEditEmployeeModal
          data={editData}
          onSuccess={() => {
            fetchEmployees();
            setEditData(null);
          }}
        />
      </div>
      <AddEditEmployeeModal onSuccess={fetchEmployees} data={selectedEmp} />
    </div>
  );
};

export default EmployeeKHR;
