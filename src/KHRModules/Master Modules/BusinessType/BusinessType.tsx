import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditBusinessType from "./AddEditBusinessType";
import moment from "moment"; // Used for date formatting

import {
  getBusinessTypes,
  deleteBusinessType,
  BusinessType as BusinessTypeType,
  APIBusinessType,
} from "./BusinessTypeServices";

const BusinessType = () => {
  const routes = all_routes;
  const [data, setData] = useState<BusinessTypeType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<BusinessTypeType | null>(
    null
  );

  // Inside BusinessType.tsx -> fetchData function
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getBusinessTypes();
      const safeResult = Array.isArray(result) ? result : [];

      const mappedData: BusinessTypeType[] = safeResult.map(
        (item: APIBusinessType) => ({
          id: String(item.id),
          key: String(item.id),
          name: typeof item.name === "string" ? item.name : "-",
          created_date: item.create_date || "-",
        })
      );

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load business types", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this business type?")) {
      await deleteBusinessType(id);
      fetchData();
    }
  };

  const columns = [
    {
      title: "Business Type Name",
      dataIndex: "name",
      render: (text: string) => <h6 className="fs-14 fw-medium">{text}</h6>,
      sorter: (a: BusinessTypeType, b: BusinessTypeType) =>
        a.name.length - b.name.length,
    },
    {
      title: "Created Date",
      dataIndex: "created_date",
      render: (date: string) => {
        if (!date || date === "-") return <span>-</span>;
        // Format date to "02 Dec 2025"
        return <span>{moment(date).format("DD MMM YYYY")}</span>;
      },
      sorter: (a: BusinessTypeType, b: BusinessTypeType) =>
        new Date(a.created_date).getTime() - new Date(b.created_date).getTime(),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: BusinessTypeType) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_business_type" // Matches Modal ID
            onClick={() => setSelectedType(record)}
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
            {/* Reset selection when clicking Add to ensure clean form */}
            <div onClick={() => setSelectedType(null)}>
              <CommonHeader
                title="Business Type"
                parentMenu="HR"
                activeMenu="Business Type"
                routes={routes}
                buttonText="Add Business Type"
                modalTarget="#add_business_type"
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
        <AddEditBusinessType onSuccess={fetchData} data={selectedType} />
      </div>
    </>
  );
};

export default BusinessType;
