import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditAttendancePolicyModal from "./AddEditAttendancePolicyModal";
import moment from "moment";

import {
  getAttendancePolicies,
  deleteAttendancePolicy,
  AttendancePolicy as AttendancePolicyType,
  APIAttendancePolicy,
} from "./AttendancePolicyServices";

const AttendancePolicy = () => {
  const routes = all_routes;
  const [data, setData] = useState<AttendancePolicyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPolicy, setSelectedPolicy] =
    useState<AttendancePolicyType | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAttendancePolicies();
      const safeResult = Array.isArray(result) ? result : [];

      const mappedData: AttendancePolicyType[] = safeResult.map(
        (item: APIAttendancePolicy) => {
          const safeName = typeof item.name === "string" ? item.name : "-";

          return {
            id: String(item.id),
            key: String(item.id),
            name: safeName,
            type: item.type || "regular",
            absent_if: item.absent_if || "in_out_abs",
            day_after: item.day_after || 0,
            grace_minutes: item.grace_minutes || 0,
            no_pay_minutes: item.no_pay_minutes || 0,
            half_day_minutes: item.half_day_minutes || 0,
            early_grace_minutes: item.early_grace_minutes || 0,
            late_beyond_days: item.late_beyond_days || 0,
            late_beyond_time: item.late_beyond_time || 0,
            created_date: item.create_date || "-",
          };
        }
      );

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load policies", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      await deleteAttendancePolicy(id);
      fetchData();
    }
  };

  const columns = [
    {
      title: "Policy Name",
      dataIndex: "name",
      render: (text: string) => <h6 className="fs-14 fw-medium">{text}</h6>,
      sorter: (a: AttendancePolicyType, b: AttendancePolicyType) =>
        a.name.length - b.name.length,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text: string) => <span className="text-capitalize">{text}</span>,
    },
    {
      title: "Absent Condition",
      dataIndex: "absent_if",
    },
    {
      title: "Created Date",
      dataIndex: "created_date",
      render: (date: string) => {
        if (!date || date === "-") return <span>-</span>;
        return <span>{moment(date).format("DD MMM YYYY")}</span>;
      },
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: AttendancePolicyType) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_attendance_policy"
            onClick={() => setSelectedPolicy(record)}
          >
            <i className="ti ti-edit" />
          </Link>
          <Link to="#" onClick={() => handleDelete(record.id!)}>
            <i className="ti ti-trash" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content">
            <div onClick={() => setSelectedPolicy(null)}>
              <CommonHeader
                title="Attendance Policy"
                parentMenu="HR"
                activeMenu="Policies"
                routes={routes}
                buttonText="Add Policy"
                modalTarget="#add_attendance_policy"
              />
            </div>
            <div className="card">
              <div className="card-body">
                {loading ? (
                  <div className="text-center p-4">Loading data...</div>
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
          </div>
        </div>
        <AddEditAttendancePolicyModal
          onSuccess={fetchData}
          data={selectedPolicy}
        />
      </div>
    </>
  );
};

export default AttendancePolicy;
