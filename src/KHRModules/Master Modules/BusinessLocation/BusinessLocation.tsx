import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditBusinessLocationModal from "./AddEditBusinessLocationModal";
import moment from "moment"; // Ensure you have moment installed, or use standard Date logic

import {
  getBusinessLocations,
  deleteBusinessLocation,
  BusinessLocation as BusinessLocationType,
  APIBusinessLocation,
} from "./BusinessLocationServices";
import { toast } from "react-toastify/unstyled";

const BusinessLocation = () => {
  const routes = all_routes;
  const [data, setData] = useState<BusinessLocationType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLocation, setSelectedLocation] =
    useState<BusinessLocationType | null>(null);

  // Inside BusinessLocation.tsx -> fetchData function
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getBusinessLocations();
      const safeResult = Array.isArray(result) ? result : [];

      const mappedData: BusinessLocationType[] = safeResult.map(
        (item: APIBusinessLocation) => ({
          id: String(item.id),
          key: String(item.id),
          name: typeof item.name === "string" ? item.name : "-",
          created_date: item.create_date || "-",
        })
      );

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load locations", error);
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      await deleteBusinessLocation(id);
      fetchData();
    }
  };

  const columns = [
    {
      title: "Business Name",
      dataIndex: "name",
      render: (text: string) => <h6 className="fs-14 fw-medium">{text}</h6>,
      sorter: (a: BusinessLocationType, b: BusinessLocationType) =>
        a.name.length - b.name.length,
    },
    // REMOVED "Parent Location" COLUMN
    {
      title: "Created Date",
      dataIndex: "created_date",
      render: (date: string) => {
        // Check if date is valid before formatting
        if (!date || date === "-") return <span>-</span>;
        return <span>{moment(date).format("DD MMM YYYY")}</span>;
      },
      sorter: (a: BusinessLocationType, b: BusinessLocationType) =>
        new Date(a.created_date).getTime() - new Date(b.created_date).getTime(),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: BusinessLocationType) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_business_location"
            onClick={() => setSelectedLocation(record)}
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
            <div onClick={() => setSelectedLocation(null)}>
              <CommonHeader
                title="Business Locations"
                parentMenu="HR"
                activeMenu="Locations"
                routes={routes}
                buttonText="Add Location"
                modalTarget="#add_business_location"
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
        <AddEditBusinessLocationModal
          onSuccess={fetchData}
          data={selectedLocation}
        />
      </div>
    </>
  );
};

export default BusinessLocation;
