import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditWorkEntryTypeModal from "./AddEditWorkEntryTypeModal";

import {
  getWorkEntryTypes,
  deleteWorkEntryType,
  WorkEntryType as WorkEntryTypeType,
  APIWorkEntryType,
} from "./WorkEntryTypeServices";

const WorkEntryType = () => {
  const routes = all_routes;
  const [data, setData] = useState<WorkEntryTypeType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<WorkEntryTypeType | null>(
    null
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getWorkEntryTypes();
      const safeResult = Array.isArray(result) ? result : [];

      const mappedData: WorkEntryTypeType[] = safeResult.map(
        (item: APIWorkEntryType) => ({
          id: String(item.id),
          key: String(item.id),
          name: typeof item.name === "string" ? item.name : "-",
          code: typeof item.code === "string" ? item.code : "-",
          external_code:
            typeof item.external_code === "string" ? item.external_code : "-",
          sequence: item.sequence || 0,
          color: item.color || 0,
          is_unforeseen: item.is_unforeseen || false,
          is_leave: item.is_leave || false,
          round_days: (typeof item.round_days === "string"
            ? item.round_days
            : "NO") as "NO" | "HALF" | "FULL",
        })
      );

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load work entry types", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this type?")) {
      await deleteWorkEntryType(id);
      fetchData();
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string) => <h6 className="fs-14 fw-medium">{text}</h6>,
      sorter: (a: WorkEntryTypeType, b: WorkEntryTypeType) =>
        a.name.length - b.name.length,
    },
    {
      title: "Code",
      dataIndex: "code",
    },
    {
      title: "Round Days",
      dataIndex: "round_days",
      render: (text: string) => (
        <span className="badge badge-pill bg-light text-dark">{text}</span>
      ),
    },
    {
      title: "Color",
      dataIndex: "color",
      render: (color: number) => (
        <span className="badge bg-primary rounded-circle p-2">{color}</span>
      ),
    },
    {
      title: "Unforeseen",
      dataIndex: "is_unforeseen",
      render: (val: boolean) => (val ? "Yes" : "No"),
    },
    {
      title: "Is Leave",
      dataIndex: "is_leave",
      render: (val: boolean) => (val ? "Yes" : "No"),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: WorkEntryTypeType) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_work_entry_type"
            onClick={() => setSelectedItem(record)}
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
            <div onClick={() => setSelectedItem(null)}>
              <CommonHeader
                title="Work Entry Types"
                parentMenu="HR"
                activeMenu="Work Entries"
                routes={routes}
                buttonText="Add Entry Type"
                modalTarget="#add_work_entry_type"
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
        <AddEditWorkEntryTypeModal onSuccess={fetchData} data={selectedItem} />
      </div>
    </>
  );
};

export default WorkEntryType;
