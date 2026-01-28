import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditRegCategory from "./AddEditSalaryRuleCategory";
import {
  getRegCategories,
  deleteRegCategory,
  SalaryRuleCategory,
} from "./SalaryRuleCategory";
import { RegCategory } from "../RegCategory/RegCategoryService";

const SalaryRuleCategoryKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<SalaryRuleCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] =
    useState<SalaryRuleCategory | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getRegCategories();
      console.log("Fetched Categories:", response);

      const rawArray = Array.isArray(response) ? response : [];

      const mappedData = rawArray.map((item: any) => ({
        id: String(item.id),
        key: String(item.id),
        client: item.client_id[1],
        type: item.type,
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteRegCategory(id);
        toast.success("Category deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const columns = [
    {
      title: "Client",
      dataIndex: "client", // Matches the mappedData field
      render: (text: string) => (
        <span className="fs-14 fw-bold text-dark">{text}</span>
      ),
      sorter: (a: any, b: any) => a.client.localeCompare(b.client),
    },
    {
      title: "Category Type",
      dataIndex: "type",
      render: (text: string) => (
        <span className="fs-14 fw-bold text-dark">{text}</span>
      ),
      sorter: (a: any, b: any) => a.type.localeCompare(b.type),
    },
    {
      title: "Created Date",
      dataIndex: "Created_Date", // keep if you have this field
      sorter: (a: any, b: any) => a.Created_Date?.localeCompare(b.Created_Date),
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
            data-bs-target="#add_reg_cat_modal"
            onClick={() => setSelectedCategory(record)}
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
          <div onClick={() => setSelectedCategory(null)}>
            <CommonHeader
              title="Regularization Category sdd"
              parentMenu="Settings"
              activeMenu="Reg Category"
              routes={routes}
              buttonText="Add Category"
              modalTarget="#add_reg_cat_modal"
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
                  <div className="mt-2">Fetching Categories...</div>
                </div>
              ) : (
                <DatatableKHR
                  data={data}
                  columns={columns}
                  selection={true}
                  textKey="type"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <AddEditRegCategory onSuccess={fetchData} data={selectedCategory} />
    </>
  );
};

export default SalaryRuleCategoryKHR;
