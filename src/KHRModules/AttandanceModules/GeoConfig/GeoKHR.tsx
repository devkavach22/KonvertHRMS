import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditAttendancePolicyModal from "./AddEditGeoModal";
import moment from "moment";

import {
  getAttendancePolicies,
  deleteAttendancePolicy,
  AttendancePolicy as AttendancePolicyType,
  APIAttendancePolicy,
} from "./GeoServices";

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

          // parse geofence numeric fields safely
          const latitude = (item as any).latitude !== undefined && (item as any).latitude !== null
            ? Number((item as any).latitude)
            : null;
          const longitude = (item as any).longitude !== undefined && (item as any).longitude !== null
            ? Number((item as any).longitude)
            : null;
          const radius_km = (item as any).radius_km !== undefined && (item as any).radius_km !== null
            ? Number((item as any).radius_km)
            : null;

          // normalize employees selection to array of objects
          let employees_selection: any[] = [];
          if (Array.isArray((item as any).employees_selection)) {
            employees_selection = (item as any).employees_selection;
          } else if (typeof (item as any).employees_selection === "string") {
            try {
              const parsed = JSON.parse((item as any).employees_selection);
              if (Array.isArray(parsed)) employees_selection = parsed;
            } catch (e) {
              employees_selection = [];
            }
          } else if (Array.isArray((item as any).employees)) {
            // fallback to a different possible key
            employees_selection = (item as any).employees;
          }

          return {
            id: String(item.id),
            key: String(item.id),
            name: safeName,
            latitude,
            longitude,
            radius_km,
            employees_selection,
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

  const columns: any[] = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text: any) => <h6 className="fs-14 fw-medium">{text ?? "-"}</h6>,
      sorter: (a: any, b: any) => {
        const A = String(a?.name ?? "");
        const B = String(b?.name ?? "");
        return A.localeCompare(B);
      },
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      render: (val: any) => <span>{val !== undefined && val !== null ? Number(val).toFixed(6) : "-"}</span>,
      sorter: (a: any, b: any) => (Number(a?.latitude ?? 0) as number) - (Number(b?.latitude ?? 0) as number),
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      render: (val: any) => <span>{val !== undefined && val !== null ? Number(val).toFixed(6) : "-"}</span>,
      sorter: (a: any, b: any) => (Number(a?.longitude ?? 0) as number) - (Number(b?.longitude ?? 0) as number),
    },
    {
      title: "Radius (Km)",
      dataIndex: "radius_km",
      render: (val: any) => <span>{val !== undefined && val !== null ? Number(val) : "-"}</span>,
      sorter: (a: any, b: any) => (Number(a?.radius_km ?? 0) as number) - (Number(b?.radius_km ?? 0) as number),
    },
    {
      title: "Employees",
      dataIndex: "employees_selection",
      render: (employees: any) => {
        if (!Array.isArray(employees) || employees.length === 0) return <span>-</span>;
        const names = employees
          .map((e: any) => e?.name || e?.label || e?.full_name || "")
          .filter((n: string) => !!n);
        return names.length ? <span>{names.join(", ")}</span> : <span>{employees.length} employees</span>;
      },
    },
 
  ];

  return (
    <>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content">
            <div onClick={() => setSelectedPolicy(null)}>
              <CommonHeader
                title="Geo Configurations"
                parentMenu="HR"
                activeMenu="Geo Configurations"
                routes={routes}
                buttonText="Add Geo Config"
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
