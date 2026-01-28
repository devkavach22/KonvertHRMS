import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import {
  getSalaryStructures,
  deleteSalaryStructure,
} from "./SalaryStructureService";
import type { SalaryStructure } from "./SalaryStructureService";
import { toast } from "react-toastify";
import AddEditSalaryStructureModal from "./AddEditSalaryStructureModal";

const SalaryStructure = () => {
  const routes = all_routes;
  const [data, setData] = useState<SalaryStructure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<SalaryStructure | null>(
    null,
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      // API now returns the clean list directly via the Service
      const result = await getSalaryStructures();

      // Add 'key' for the table (required by AntD/Table logic)
      const tableData = result.map((item) => ({
        ...item,
        key: String(item.id),
      }));

      setData(tableData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load salary structures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this structure?")) {
      try {
        await deleteSalaryStructure(id);
        toast.success("Structure deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete structure");
      }
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string) => (
        <span className="fw-bold text-dark">{text}</span>
      ),
      sorter: (a: SalaryStructure, b: SalaryStructure) =>
        a.name.localeCompare(b.name),
    },
    {
      title: "Type",
      dataIndex: "typeName",
      render: (text: string) => (
        <span className="badge bg-soft-primary text-primary">
          {text || "-"}
        </span>
      ),
    },
    {
      title: "Schedule Pay",
      dataIndex: "schedulePay",
      render: (text: string) => <span className="text-capitalize">{text}</span>,
    },
    {
      title: "Country",
      dataIndex: "countryName",
      render: (text: string) => text || "-",
    },
    {
      title: "Config",
      render: (_: any, record: SalaryStructure) => (
        <div className="d-flex gap-2">
          {record.useWorkedDayLines && (
            <span
              className="badge bg-light text-muted border"
              title="Worked Days"
            >
              WD
            </span>
          )}
          {record.ytdComputation && (
            <span className="badge bg-light text-muted border" title="YTD Comp">
              YTD
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: SalaryStructure) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_salary_structure_modal"
            onClick={() => setSelectedItem(record)}
          >
            <i className="ti ti-edit text-blue" />
          </Link>
          <Link to="#" onClick={() => handleDelete(String(record.id))}>
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
          <div onClick={() => setSelectedItem(null)}>
            <CommonHeader
              title="Salary Structure"
              parentMenu="Payroll"
              activeMenu="Salary Structure"
              routes={routes}
              buttonText="Add Structure"
              modalTarget="#add_salary_structure_modal"
            />
          </div>

          <div className="card">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center p-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                  <div className="mt-2">Fetching Records...</div>
                </div>
              ) : (
                <DatatableKHR data={data} columns={columns} selection={true} />
              )}
            </div>
          </div>
        </div>
      </div>

      <AddEditSalaryStructureModal
        onSuccess={fetchData}
        data={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
};

export default SalaryStructure;
