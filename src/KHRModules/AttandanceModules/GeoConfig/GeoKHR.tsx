import React, { useEffect, useState } from "react";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditGeoModal from "./AddEditGeoModal";

import {
  getGeoConfigs,
  deleteGeoConfig,
  GeoConfig,
  APIGeoConfig,
} from "./GeoServices";
import CommonModal from "@/KHRModules/commanForm/CommanModal/CommanModal";

const GeoKHR = () => {
  const routes = all_routes;

  const [data, setData] = useState<GeoConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGeo, setSelectedGeo] = useState<GeoConfig | null>(null);
  const [deleteGeoId, setDeleteGeoId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getGeoConfigs();
      const safeResult = Array.isArray(result) ? result : [];

      const mappedData: any[] = safeResult.map((item: any) => ({
        id: String(item.id),
        key: String(item.id),
        name: typeof item.name === "string" ? item.name : "-",
        latitude:
          item.latitude !== null && item.latitude !== undefined
            ? Number(item.latitude)
            : null,
        longitude:
          item.longitude !== null && item.longitude !== undefined
            ? Number(item.longitude)
            : null,
        radius_km:
          item.radius_km !== null && item.radius_km !== undefined
            ? Number(item.radius_km)
            : null,
        employees_selection: Array.isArray(item.employees)
          ? item.employees
          : [],
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load geo configs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleDeleteClick = (id: string) => {
    setDeleteGeoId(id);

    const modalElement = document.getElementById("delete_geo_modal");
    if (modalElement) {
      // @ts-ignore
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  };

  const confirmDelete = async () => {
    if (!deleteGeoId) return;

    try {
      await deleteGeoConfig(deleteGeoId); // updated API to pass user_id if needed
      fetchData(); // refresh table
    } catch (error) {
      console.error("Failed to delete geo config:", error);
    } finally {
      setDeleteGeoId(null);

      const modalElement = document.getElementById("delete_geo_modal");
      if (modalElement) {
        // @ts-ignore
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();
      }
    }
  };

  /* =====================
     DELETE
  ===================== */
  // const handleDelete = async (id: string) => {
  //   if (window.confirm("Are you sure you want to delete this geo config?")) {
  //     await deleteGeoConfig(id);
  //     fetchData();
  //   }
  // };

  /* =====================
     EDIT ROW
  ===================== */
  const handleEdit = (row: GeoConfig) => {
    setSelectedGeo(row);

    // Open modal via Bootstrap
    const modalElement = document.getElementById("add_geo_config");
    if (modalElement) {
      // @ts-ignore
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  };

  /* =====================
     TABLE COLUMNS
  ===================== */
  const columns: any[] = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a: any, b: any) => String(a.name).localeCompare(String(b.name)),
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      render: (v: any) => (v !== null ? v.toFixed(6) : "-"),
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      render: (v: any) => (v !== null ? v.toFixed(6) : "-"),
    },
    {
      title: "Radius (Km)",
      dataIndex: "radius_km",
      render: (v: any) => (v !== null ? v : "-"),
    },
    {
      title: "Employees",
      dataIndex: "employees_selection",
      render: (emps: any[]) =>
        Array.isArray(emps) && emps.length
          ? emps.map((e) => e?.name || e?.label).join(", ")
          : "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: GeoConfig) => (
        <div>
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => handleEdit(record)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteClick(record.id!)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <CommonHeader
            title="Geo Configurations"
            parentMenu="HR"
            activeMenu="Geo Configurations"
            routes={routes}
            buttonText="Add Geo Config"
            modalTarget="#add_geo_config"
          />

          <div className="card">
            <div className="card-body">
              {loading ? (
                <div className="text-center p-4">Loading...</div>
              ) : (
                <DatatableKHR
                  data={data}
                  columns={columns}
                  selection
                  textKey="name"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <AddEditGeoModal
        onSuccess={() => {
          fetchData();
          setSelectedGeo(null);
        }}
        data={selectedGeo}
      />

      <CommonModal
        id="delete_geo_modal"
        title="Confirm Delete"
        onSubmit={confirmDelete}
        submitText="Delete"
        // onClose={() => setDeleteGeoId(null)}
      >
        <p>Are you sure you want to delete this geo configuration?</p>
      </CommonModal>
    </div>
  );
};

export default GeoKHR;
