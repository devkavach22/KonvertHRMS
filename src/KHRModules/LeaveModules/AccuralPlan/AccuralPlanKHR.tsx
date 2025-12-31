import React, { useEffect, useState } from "react";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditAttendancePolicyModal from "./AddEditAccuralPlanModal";
import { Link } from "react-router-dom";

import {
  getAllAccuralPlan
} from "./AccuralPlanServices";

const AccuralPlanKHR = () => {
  const routes = all_routes;
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);

  const columns: any[] = [
    {
      title: "Name",
      dataIndex: "name",
      render: (val: any) => <span>{val ? String(val) : "-"}</span>,
      sorter: (a: any, b: any) => String(a?.name ?? "").localeCompare(String(b?.name ?? "")),
    },
    {
      title: "Client",
      dataIndex: "client_id",
      render: (val: any) => <span>{Array.isArray(val) && val[1] ? String(val[1]) : "-"}</span>,
      sorter: (a: any, b: any) => {
        const A = Array.isArray(a?.client_id) ? String(a.client_id[1] ?? "") : "";
        const B = Array.isArray(b?.client_id) ? String(b.client_id[1] ?? "") : "";
        return A.localeCompare(B);
      },
    },
    {
      title: "Carryover Date",
      dataIndex: "carryover_date",
      render: (val: any) => <span>{val ? String(val) : "-"}</span>,
      sorter: (a: any, b: any) => String(a?.carryover_date ?? "").localeCompare(String(b?.carryover_date ?? "")),
    },
    {
      title: "Is Based on Worked Time",
      dataIndex: "is_based_on_worked_time",
      render: (val: any) => <span>{val ? "Yes" : "No"}</span>,
      sorter: (a: any, b: any) => (a?.is_based_on_worked_time ? 1 : 0) - (b?.is_based_on_worked_time ? 1 : 0),
    },
    {
      title: "Accrued Gain Time",
      dataIndex: "accrued_gain_time",
      render: (val: any) => <span>{val ? String(val) : "-"}</span>,
      sorter: (a: any, b: any) => String(a?.accrued_gain_time ?? "").localeCompare(String(b?.accrued_gain_time ?? "")),
    },
    {
      title: "Company",
      dataIndex: "company_id",
      render: (val: any) => <span>{Array.isArray(val) && val[1] ? String(val[1]) : "-"}</span>,
      sorter: (a: any, b: any) => {
        const A = Array.isArray(a?.company_id) ? String(a.company_id[1] ?? "") : "";
        const B = Array.isArray(b?.company_id) ? String(b.company_id[1] ?? "") : "";
        return A.localeCompare(B);
      },
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
                data-bs-target="#add_department"
  onClick={() => {
              setSelectedPolicy(record);
              const jq = (window as any).jQuery || (window as any).$;
              if (jq && typeof jq === "function" && jq("#add_attendance_policy").modal) {
                try {
                  jq("#add_attendance_policy").modal("show");
                } catch (e) {
                  // ignore if modal call fails
                }
              }
            }}              >
                <i className="ti ti-edit text-blue" />
              </Link>
              <Link to="#" 
              // onClick={() => 
              //   handleDelete(record.id!)}
                >
                <i className="ti ti-trash text-danger" />
              </Link>
            </div>
          ),
        },

  ];

  const fetchData = async () => {
    try {
      const response = await getAllAccuralPlan();
      const plans = response.data.data || response.data || [];
      setData(plans);
    } catch (error) {
      console.error('Error fetching accrual plans:', error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => setSelectedPolicy(null)}>
            <CommonHeader
              title="Leave List"
              parentMenu="HR"
              activeMenu="Leave List"
              routes={routes}
              buttonText="Add leave Request"
              modalTarget="#add_attendance_policy"
            />
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Leave List</h5>
              <div className="mt-3">
                <DatatableKHR columns={columns} data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEditAttendancePolicyModal onSuccess={fetchData} data={selectedPolicy} />
    </div>
  );
};

export default AccuralPlanKHR;
