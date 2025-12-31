import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditBanksKHRModal from "./AddEditBanksKHRModal";
import { getBanks, deleteBank, Bank } from "./BanksServices";
import { toast } from "react-toastify";

const BanksKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<Bank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getBanks();

      /** * FIX: Extracting the array from the "banks" key as per your JSON structure.
       * We also check for fallback keys to ensure the component doesn't crash.
       */
      const rawArray =
        response?.banks ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      const mappedData = rawArray.map((item: any) => ({
        ...item,
        id: String(item.id),
        key: String(item.id), // Unique key for AntDesign table logic
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load bank list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this bank?")) {
      try {
        await deleteBank(id);
        toast.success("Bank deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete bank");
      }
    }
  };

  const columns = [
    {
      title: "Bank Name",
      dataIndex: "name",
      render: (text: string) => (
        <span className="fs-14 fw-bold text-dark">{text}</span>
      ),
      sorter: (a: Bank, b: Bank) => a.name.localeCompare(b.name),
    },
    {
      title: "BIC (IFSC)",
      dataIndex: "bic",
      render: (text: string) => (
        <span className="badge bg-soft-info text-info">{text || "-"}</span>
      ),
    },
    {
      title: "Swift Code",
      dataIndex: "swift_code",
      render: (text: string) => text || "-",
    },
    {
      title: "MICR Code",
      dataIndex: "micr_code",
      render: (text: string) => text || "-",
    },
    {
      title: "Contact",
      dataIndex: "phone",
      render: (_: any, record: Bank) => (
        <div className="d-flex flex-column">
          <span className="fs-12">
            <i className="ti ti-phone me-1"></i>
            {record.phone}
          </span>
          <span className="fs-12 text-muted">
            <i className="ti ti-mail me-1"></i>
            {record.email}
          </span>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: Bank) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_bank_modal"
            onClick={() => setSelectedBank(record)}
          >
            <i className="ti ti-edit text-blue" />
          </Link>
          <Link to="#" onClick={() => handleDelete(String(record.id))}>
            <i className="ti ti-trash text-danger" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => setSelectedBank(null)}>
            <CommonHeader
              title="Bank Master"
              parentMenu="HR"
              activeMenu="Banks"
              routes={routes}
              buttonText="Add Bank"
              modalTarget="#add_bank_modal"
            />
          </div>

          <div className="card">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center p-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                  <div className="mt-2">Fetching Bank Records...</div>
                </div>
              ) : (
                <DatatableKHR data={data} columns={columns} selection={true} />
              )}
            </div>
          </div>
        </div>
      </div>

      <AddEditBanksKHRModal onSuccess={fetchData} data={selectedBank} />
    </>
  );
};

export default BanksKHR;
