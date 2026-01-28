import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import {
  getSalaryStructureTypes,
  deleteSalaryStructureType, // Uncommented this
} from "./SalaryStructureTypeServices";
import type { SalaryStructureType } from "./SalaryStructureTypeServices";
import { toast } from "react-toastify";
import AddEditSalaryStructureTypeModal from "./AddEditSalaryStructureTypeModal";

const SalaryStructureType = () => {
  const routes = all_routes;
  const [data, setData] = useState<any[]>([]); // Changed type to any[] to allow extra display fields
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<SalaryStructureType | null>(
    null,
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getSalaryStructureTypes();

      // Handle response structure variations
      const rawArray =
        response?.data || (Array.isArray(response) ? response : []);

      const mappedData = rawArray.map((item: any) => {
        // --- HELPER TO EXTRACT [ID, NAME] ---
        // If the field is an array (e.g. [104, "India"]), return ID for the form and Name for display
        // If it's false/null, return empty string

        const getSafeId = (field: any) =>
          Array.isArray(field) ? field[0] : field || "";

        const getSafeName = (field: any) =>
          Array.isArray(field) ? field[1] : "";

        return {
          ...item,
          id: String(item.id),
          key: String(item.id),

          // --- 1. CLEAN IDs FOR EDIT FORM ---
          // This ensures the Modal gets just "104", not "[104, 'India']"
          country_id: getSafeId(item.country_id),
          default_work_entry_type_id: getSafeId(
            item.default_work_entry_type_id,
          ),
          default_resource_calendar_id: getSafeId(
            item.default_resource_calendar_id,
          ),

          // Handle boolean 'false' for struct_id (API specific quirk)
          default_struct_id:
            item.default_struct_id === false
              ? ""
              : getSafeId(item.default_struct_id),

          // --- 2. CREATE DISPLAY NAMES FOR TABLE ---
          // We create new properties specifically for the columns
          country_name: getSafeName(item.country_id),
          work_entry_type_name: getSafeName(item.default_work_entry_type_id),
          resource_calendar_name: getSafeName(
            item.default_resource_calendar_id,
          ),
          struct_name: getSafeName(item.default_struct_id),
        };
      });

      setData(mappedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load structure types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this structure type?")
    ) {
      try {
        await deleteSalaryStructureType(id);
        toast.success("Structure Type deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete structure type");
      }
    }
  };

  // Helper to display friendly names
  const getWageTypeLabel = (type: string) => {
    if (type === "monthly")
      return (
        <span className="badge bg-soft-success text-success">Fixed Wage</span>
      );
    if (type === "hourly")
      return (
        <span className="badge bg-soft-warning text-warning">Hourly Wage</span>
      );
    return type;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string) => (
        <span className="fs-14 fw-bold text-dark">{text}</span>
      ),
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    // {
    //   title: "Country",
    //   dataIndex: "country_name", // Using the new flattened field
    //   render: (text: string) => text || "-",
    // },
    {
      title: "Wage Type",
      dataIndex: "wage_type",
      render: (text: string) => getWageTypeLabel(text),
    },
    {
      title: "Scheduled Pay",
      dataIndex: "default_schedule_pay",
      render: (text: string) => <span className="text-capitalize">{text}</span>,
    },
    {
      title: "Working Hours",
      dataIndex: "resource_calendar_name", // Using the new flattened field
      render: (text: string) => (
        <span className="text-muted">{text || "-"}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: SalaryStructureType) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_structure_type_modal"
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
              title="Salary Structure Types"
              parentMenu="Payroll"
              activeMenu="Structure Types"
              routes={routes}
              buttonText="Add Type"
              modalTarget="#add_structure_type_modal"
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

      <AddEditSalaryStructureTypeModal
        onSuccess={fetchData}
        data={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
};

export default SalaryStructureType;
