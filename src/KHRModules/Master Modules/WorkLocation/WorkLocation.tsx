import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditWorkLocationModal from "./AddEditWorkLocationModal";
import moment from "moment";

import {
  getWorkLocations,
  deleteWorkLocation,
  WorkLocation as WorkLocationType,
  APIWorkLocation,
} from "./WorkLocationServices";

const WorkLocation = () => {
  const routes = all_routes;
  const [data, setData] = useState<WorkLocationType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLocation, setSelectedLocation] =
    useState<WorkLocationType | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getWorkLocations();
      const safeResult = Array.isArray(result) ? result : [];

      const mappedData: WorkLocationType[] = safeResult.map(
        (item: APIWorkLocation) => ({
          id: String(item.id),
          key: String(item.id),
          name: item.name || "-",
          location_type: item.location_type || "office",
          created_date: item.create_date || "-", // Changed to match common API response field
        })
      );

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load work locations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      await deleteWorkLocation(id);
      fetchData();
    }
  };

  const columns = [
    {
      title: "Work Location Name",
      dataIndex: "name",
      render: (text: string) => <h6 className="fs-14 fw-medium">{text}</h6>,
      sorter: (a: WorkLocationType, b: WorkLocationType) =>
        a.name.length - b.name.length,
    },
    {
      title: "Location Type",
      dataIndex: "location_type",
      render: (type: string) => (
        <span className="badge badge-pill bg-light text-dark text-capitalize">
          {type}
        </span>
      ),
      sorter: (a: WorkLocationType, b: WorkLocationType) =>
        a.location_type.localeCompare(b.location_type),
    },
    // {
    //   title: "Created Date",
    //   dataIndex: "created_date",
    //   render: (date: string) => {
    //     if (!date || date === "-") return <span>-</span>;
    //     return <span>{moment(date).format("DD MMM YYYY")}</span>;
    //   },
    //   sorter: (a: WorkLocationType, b: WorkLocationType) =>
    //     new Date(a.created_date).getTime() - new Date(b.created_date).getTime(),
    // },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: WorkLocationType) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_work_location"
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
                title="Work Locations"
                parentMenu="HR"
                activeMenu="Locations"
                routes={routes}
                buttonText="Add Work Location"
                modalTarget="#add_work_location"
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
        <AddEditWorkLocationModal
          onSuccess={fetchData}
          data={selectedLocation}
        />
      </div>
    </>
  );
};

export default WorkLocation;
