import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import {
  ContractType,
  deleteContractType,
  getContractTypes,
} from "./HRContractTypeServices";
import { toast } from "react-toastify";
import { all_routes } from "@/router/all_routes";
import AddEditHRContractTypeModal from "./AddEditHRContractTypeModal";

const HRContractTypeKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<ContractType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<ContractType | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getContractTypes();
      const rawArray = response?.data || response || [];
      const mapped = rawArray.map((item: any) => ({
        id: String(item.id),
        name: item.name || "-",
        code: item.code || "-",
        country_name: item.country_name || "-",
        key: String(item.id),
      }));
      setData(mapped);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await deleteContractType(id);
      toast.success("Deleted successfully");
      fetchData();
    }
  };

  const columns = [
    { title: "Contract Name", dataIndex: "name", sorter: true },
    { title: "Code", dataIndex: "code", sorter: true },
    { title: "Country", dataIndex: "country_name", sorter: true },
    {
      title: "Actions",
      render: (_: any, record: ContractType) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_contract_type_modal"
            onClick={() => setSelectedItem(record)}
          >
            <i className="ti ti-edit text-primary" />
          </Link>
          <Link to="#" onClick={() => handleDelete(record.id!)}>
            <i className="ti ti-trash text-danger" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div onClick={() => setSelectedItem(null)}>
          <CommonHeader
            title="HR Contract Type"
            parentMenu="HR"
            activeMenu="HR Contract Type"
            routes={routes}
            buttonText="Add Contract Type"
            modalTarget="#add_contract_type_modal"
          />
        </div>
        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center p-4">Loading...</div>
            ) : (
              <DatatableKHR data={data} columns={columns} />
            )}
          </div>
        </div>
      </div>
      <AddEditHRContractTypeModal onSuccess={fetchData} data={selectedItem} />
    </div>
  );
};

export default HRContractTypeKHR;
