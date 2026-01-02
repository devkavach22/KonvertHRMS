import React, { useEffect, useState } from "react";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditPublicHolidayModal from "./AddEditPublicHolidayModal";
import moment from "moment";
import { Link } from "react-router-dom";

import {
  getHolidays,
  deleteHoliday
} from "./PublicHolidayServices";

const PublicHolidayKHR = () => {
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
      title: "Date From",
      dataIndex: "date_from",
      render: (val: any) => <span>{val ? moment(val).format("DD/MM/YYYY") : "-"}</span>,
      sorter: (a: any, b: any) => moment(a?.date_from).valueOf() - moment(b?.date_from).valueOf(),
    },
    {
      title: "Date To",
      dataIndex: "date_to",
      render: (val: any) => <span>{val ? moment(val).format("DD/MM/YYYY") : "-"}</span>,
      sorter: (a: any, b: any) => moment(a?.date_to).valueOf() - moment(b?.date_to).valueOf(),
    },
    {
      title: "Work Entry Type",
      dataIndex: "work_entry_type_id",
      render: (val: any) => <span>{Array.isArray(val) && val[1] ? String(val[1]) : "-"}</span>,
      sorter: (a: any, b: any) => {
        const A = Array.isArray(a?.work_entry_type_id) ? String(a.work_entry_type_id[1] ?? "") : "";
        const B = Array.isArray(b?.work_entry_type_id) ? String(b.work_entry_type_id[1] ?? "") : "";
        return A.localeCompare(B);
      },
    },
    {
      title: "Calendar",
      dataIndex: "calendar_id",
      render: (val: any) => <span>{Array.isArray(val) && val[1] ? String(val[1]) : "-"}</span>,
      sorter: (a: any, b: any) => {
        const A = Array.isArray(a?.calendar_id) ? String(a.calendar_id[1] ?? "") : "";
        const B = Array.isArray(b?.calendar_id) ? String(b.calendar_id[1] ?? "") : "";
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
                data-bs-target="#add_attendance_policy"
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
              <Link
                to="#"
                onClick={() => handleDelete(record.id)}
              >
                <i className="ti ti-trash text-danger" />
              </Link>
            </div>
          ),
        },

  ];

  const fetchData = async () => {
    try {
      const response = await getHolidays();
      const holidays = response.data.data || response.data || [];
      setData(holidays);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this public holiday?")) {
      try {
        await deleteHoliday(Number(id));
        fetchData(); // Refresh the list after successful deletion
        alert("Public holiday deleted successfully!");
      } catch (error) {
        console.error("Error deleting public holiday:", error);
        alert("Failed to delete public holiday.");
      }
    }
  };

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => setSelectedPolicy(null)}>
            <CommonHeader
              title="Public Holiday List"
              parentMenu="HR"
              activeMenu="Public Holiday List"
              routes={routes}
              buttonText="Add Public Holiday"
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

      <AddEditPublicHolidayModal onSuccess={fetchData} data={selectedPolicy} />
    </div>
  );
};

export default PublicHolidayKHR;
