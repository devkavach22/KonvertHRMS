import React, { useEffect, useState } from "react";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditPayslipModal from "./AddEditPayslipModal";
import {
  getPayslips,
  computePayslip,
  confirmPayslip,
  markPaidPayslip,
} from "./PayslipServices";
import { toast } from "react-toastify";
import { all_routes } from "@/router/all_routes";
import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";

const PayslipKHR = () => {
  const [payslips, setPayslips] = useState([]);
  const [selectedPayslip, setSelectedPayslip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchPayslips = async () => {
    setLoading(true);
    try {
      const data = await getPayslips();
      setPayslips(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, []);

  const handleProcessAction = async (id: number, actionName: string) => {
    try {
      if (actionName === "compute") await computePayslip(id);
      if (actionName === "confirm") await confirmPayslip(id);
      if (actionName === "paid") await markPaidPayslip(id);
      toast.success(`Payslip ${actionName} successful`);
      fetchPayslips();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleEdit = (record: any) => {
    setSelectedPayslip(record);
    const modalElement = document.getElementById("add_payslip_modal");
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  };

  const columns = [
    { title: "Reference", dataIndex: "name", sorter: true },
    {
      title: "Employee",
      dataIndex: "employee_id",
      render: (emp: any) => (Array.isArray(emp) ? emp[1] : emp),
    },
    // { title: "ID Card", dataIndex: "employee_code" },
    { title: "Date From", dataIndex: "date_from" },
    { title: "Date To", dataIndex: "date_to" },
    {
      title: "Status",
      render: (record: any) => (
        <span
          className={`badge rounded-pill bg-soft-${record.status === "paid" ? "success" : "primary"}`}
        >
          {record.status?.toUpperCase() || "DRAFT"}
        </span>
      ),
    },
    {
      title: "Action",
      render: (record: any) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-soft-info"
            onClick={() => handleProcessAction(record.id, "compute")}
            title="Compute"
          >
            <i className="ti ti-calculator"></i>
          </button>
          <button
            className="btn btn-sm btn-soft-warning"
            onClick={() => handleProcessAction(record.id, "confirm")}
            title="Confirm"
          >
            <i className="ti ti-check"></i>
          </button>
          <button
            className="btn btn-sm btn-soft-success"
            onClick={() => handleProcessAction(record.id, "paid")}
            title="Mark Paid"
          >
            <i className="ti ti-currency-dollar"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <CommonHeader
          title="Payroll Management"
          parentMenu="HR"
          activeMenu="Payslips"
          buttonText="Compute Payslip"
          modalTarget="#add_payslip_modal"
          routes={all_routes}
        />

        <div className="card mt-4 shadow-sm border-0">
          <div className="card-body p-0">
            <DatatableKHR data={payslips} columns={columns} />
          </div>
        </div>

        <AddEditPayslipModal
          onSuccess={fetchPayslips}
          data={selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
        />
      </div>
    </div>
  );
};

export default PayslipKHR;
