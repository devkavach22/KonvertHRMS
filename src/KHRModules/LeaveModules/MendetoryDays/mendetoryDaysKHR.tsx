import React, { useEffect, useState } from "react";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditAttendancePolicyModal from "./AddEditmendetoryDaysModal";
import moment from "moment";
import { Link } from "react-router-dom";

import {
  getAllMandatoryDays
} from "./mendetoryDaysServices";

const MendetoryDaysKHR = () => {
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
      title: "Start Date",
      dataIndex: "start_date",
      render: (val: any) => <span>{val ? moment(val).format("DD/MM/YYYY") : "-"}</span>,
      sorter: (a: any, b: any) => moment(a?.start_date).valueOf() - moment(b?.start_date).valueOf(),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      render: (val: any) => <span>{val ? moment(val).format("DD/MM/YYYY") : "-"}</span>,
      sorter: (a: any, b: any) => moment(a?.end_date).valueOf() - moment(b?.end_date).valueOf(),
    },
    {
      title: "Color",
      dataIndex: "color",
      render: (val: any) => <span>{val ? String(val) : "-"}</span>,
      sorter: (a: any, b: any) => (a?.color ?? 0) - (b?.color ?? 0),
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
      const response = await getAllMandatoryDays();
      const days = response.data.data || response.data || [];
      setData(days);
    } catch (error) {
      console.error('Error fetching mandatory days:', error);
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
              title="Mendetory Days"
              parentMenu="HR"
              activeMenu="Mendetory Days"
              routes={routes}
              buttonText="Add Mendetory Days"
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

export default MendetoryDaysKHR;
