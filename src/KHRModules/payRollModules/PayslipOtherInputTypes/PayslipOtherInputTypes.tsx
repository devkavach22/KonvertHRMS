import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditPayslipOtherInputTypesModal from "./AddEditPayslipOtherInputTypesModal";
import {
  getPayslipInputTypes,
  deletePayslipInputType,
} from "./PayslipOtherInputTypesService";
import { toast } from "react-toastify";
import { all_routes } from "@/router/all_routes";

const PayslipOtherInputTypes = () => {
  const routes = all_routes;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getPayslipInputTypes();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this input type?")) {
      try {
        await deletePayslipInputType(id.toString());
        toast.success("Deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <h6 className="fs-14 fw-medium text-dark">{text}</h6>
      ),
    },
    {
      title: "Available in Attachments",
      dataIndex: "available_in_attachments",
      render: (val: boolean) => (
        <span
          className={`badge ${val ? "badge-soft-info" : "badge-soft-secondary"}`}
        >
          {val ? "Yes" : "No"}
        </span>
      ),
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_input_type_modal"
            onClick={() => setSelectedType(record)}
          >
            <i className="ti ti-edit text-primary" />
          </Link>
          <Link to="#" onClick={() => handleDelete(record.id)}>
            <i className="ti ti-trash text-danger" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div onClick={() => setSelectedType(null)}>
          <CommonHeader
            title="Payslip Other Input Types"
            parentMenu="Payroll"
            activeMenu="Input Types"
            routes={routes}
            buttonText="Add Input Type"
            modalTarget="#add_input_type_modal"
          />
        </div>
        <div className="card shadow-sm border-0">
          <div className="card-body">
            {loading ? (
              <div className="text-center p-5">
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
                <div className="mt-2 text-muted fs-13">Loading...</div>
              </div>
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
        <AddEditPayslipOtherInputTypesModal
          onSuccess={fetchData}
          data={selectedType}
          onClose={() => setSelectedType(null)}
        />
      </div>
    </div>
  );
};

export default PayslipOtherInputTypes;
