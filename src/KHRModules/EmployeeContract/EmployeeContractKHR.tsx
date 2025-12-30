import { all_routes } from "@/router/all_routes";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";
import AddStructureType from "./AddEmployeeContractModal";

/* ================= TYPES ================= */

interface StructureTypeData {
  structure_name: string;
  country: string;
  default_wage_type: string;
  schedule_pay: string;
  working_hours: string;
  regular_pay_structure: string;
  work_entry_source: string;
}

/* ================= COMPONENT ================= */

const StructureTypeKHR = () => {
  const routes = all_routes;

  const [data, setData] = useState<StructureTypeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStructureType, setSelectedStructureType] =
    useState<StructureTypeData | null>(null);

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      // 🔹 Replace this with API later
      setData([
        {
          structure_name: "Reliance: Employee Pay",
          country: "India",
          default_wage_type: "Fixed Wage",
          schedule_pay: "Monthly",
          working_hours: "66 Hours / Week",
          regular_pay_structure: "Indian Employee",
          work_entry_source: "Attendance",
        },
      ]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load structure types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= TABLE COLUMNS ================= */

  const columns = [
    {
      title: "Structure Type",
      dataIndex: "structure_name",
      sorter: (a: StructureTypeData, b: StructureTypeData) =>
        a.structure_name.length - b.structure_name.length,
    },
    {
      title: "Country",
      dataIndex: "country",
    },
    {
      title: "Wage Type",
      dataIndex: "default_wage_type",
    },
    {
      title: "Scheduled Pay",
      dataIndex: "schedule_pay",
    },
    {
      title: "Working Hours",
      dataIndex: "working_hours",
    },
    {
      title: "Work Entry Type",
      dataIndex: "work_entry_source",
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_: any, record: StructureTypeData) => (
        <button
          className="btn btn-sm btn-outline-primary"
          data-bs-toggle="modal"
          data-bs-target="#add_structure_type"
          onClick={() => setSelectedStructureType(record)}
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <CommonHeader
            title="Structure Types"
            parentMenu="Payroll"
            activeMenu="Structure Types"
            routes={routes}
            buttonText="Add Structure Type"
            modalTarget="#add_structure_type"
          />

          <div className="card">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" />
                  <div className="mt-2">Loading Structure Types...</div>
                </div>
              ) : (
                <DatatableKHR
                  data={data}
                  columns={columns}
                  selection={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      <AddStructureType
        onSubmit={() => {
          setSelectedStructureType(null);
          fetchData();
        }}
        data={selectedStructureType}
      />
    </>
  );
};

export default StructureTypeKHR;
