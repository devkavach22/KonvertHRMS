import React, { useEffect, useState } from "react";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditEmployeeModal from "./AddEditEmployeeModal";
import { getEmployees, deleteEmployee, Employee } from "./EmployeeServices";
import { toast } from "react-toastify";
import { all_routes } from "@/router/all_routes";
import EmployeeCard from "./EmployeeCard";

const EmployeeKHR = () => {
  const routes = all_routes;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeleteEmployee = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      await deleteEmployee(id.toString());
      toast.success("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  };

  const handleEditClick = (employee: any) => {
    setEditData(employee);
    // Explicitly open modal
    const modalElement = document.getElementById("add_employee_modal");
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* HEADER AREA */}
        <div onClick={() => setSelectedEmp(null)}>
          <CommonHeader
            title="Employee Directory"
            parentMenu="HR"
            activeMenu="Employees"
            routes={routes}
            buttonText="Add New Employee"
            modalTarget="#add_employee_modal"
          />
        </div>

        {/* LOADING & CONTENT AREA */}
        <div
          className="row mt-4 position-relative"
          style={{ minHeight: "400px" }}
        >
          {loading ? (
            // --- CENTERED SPINNER ---
            <div className="position-absolute top-50 start-50 translate-middle text-center w-100">
              <div
                className="spinner-border text-primary"
                role="status"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted fs-13">Loading data...</p>
            </div>
          ) : (
            // --- GRID ---
            <>
              {employees.length > 0 ? (
                employees.map((emp: any) => (
                  <EmployeeCard
                    key={emp.id}
                    employee={emp}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteEmployee}
                  />
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <h5 className="text-muted">No Employees Found</h5>
                  <p className="text-muted fs-13">
                    Add an employee to see them here.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* MODAL */}
        <AddEditEmployeeModal
          data={editData}
          onSuccess={() => {
            fetchEmployees();
            setEditData(null);
          }}
        />
      </div>
    </div>
  );
};

export default EmployeeKHR;
