import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditExpenseCategoryKHRModal from "./AddEditExpenseCategoryKHRModal";
import {
  getExpenseCategories,
  deleteExpenseCategory,
} from "./ExpenseCategoryKHRService";

const ExpenseCategoryKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  // --- Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getExpenseCategories();

      console.log("API Response:", result);

      const responseBody = result.data;

      const safeResult = Array.isArray(responseBody)
        ? responseBody
        : Array.isArray(responseBody?.data)
        ? responseBody.data
        : [];

      const mappedData = safeResult.map((item: any) => ({
        ...item,
        key: String(item.id || item._id),
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load expense categories", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Initial Load ---
  useEffect(() => {
    fetchData();
  }, []);

  // --- Delete Handler ---
  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteExpenseCategory(id);
        toast.success("Deleted successfully");
        fetchData(); // Refresh list
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category.");
      }
    }
  };

  // --- Modal Trigger Helper ---
  const openModal = (record: any | null) => {
    setSelectedCategory(record);
    const jq = (window as any).jQuery || (window as any).$;
    if (jq && typeof jq === "function") {
      try {
        jq("#add_expense_category").modal("show");
      } catch (e) {
        // Fallback or ignore
      }
    }
  };

  // --- Columns Definition ---
  const columns: any[] = [
    {
      title: "Product Name",
      dataIndex: "name",
      render: (val: any) => <span className="fw-bold">{val || "-"}</span>,
      sorter: (a: any, b: any) =>
        String(a.name || "").localeCompare(String(b.name || "")),
    },
    {
      title: "Reference",
      dataIndex: "reference",
      render: (val: any) => <span>{val || "-"}</span>,
    },
    {
      title: "Cost",
      dataIndex: "cost",
      render: (val: any) => (
        <span>₹ {val ? Number(val).toFixed(2) : "0.00"}</span>
      ),
      sorter: (a: any, b: any) => (Number(a.cost) || 0) - (Number(b.cost) || 0),
    },
    {
      title: "Category",
      dataIndex: "category_name", // Maps to 'category_name' in your JSON
      render: (val: any) => <span>{val || "-"}</span>,
    },
    {
      title: "Invoicing Policy",
      dataIndex: "re_invoice_policy",
      render: (val: any) => {
        let text = "No";
        let badgeClass = "bg-light text-muted";

        if (val === "cost") {
          text = "At Cost";
          badgeClass = "bg-soft-info text-info";
        }
        if (val === "sales_price") {
          text = "Sales Price";
          badgeClass = "bg-soft-success text-success";
        }

        // Logic for 'no' is handled by default var init above
        return <span className={`badge ${badgeClass} border`}>{text}</span>;
      },
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: any) => (
        <div className="action-icon d-inline-flex">
          <Link to="#" className="me-2" onClick={() => openModal(record)}>
            <i className="ti ti-edit text-blue" />
          </Link>
          <Link to="#" onClick={() => handleDelete(record.id)}>
            <i className="ti ti-trash text-danger" />
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
            {/* Click wrapper to clear selection if clicking outside */}
            <div onClick={() => setSelectedCategory(null)}>
              <CommonHeader
                title="Expense Categories"
                parentMenu="Expenses"
                activeMenu="Categories"
                routes={routes}
                buttonText="Add New Category"
                modalTarget="#add_expense_category"
              />
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <div className="mt-3">
                  <DatatableKHR columns={columns} data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Component */}
        <AddEditExpenseCategoryKHRModal
          onSuccess={fetchData}
          data={selectedCategory}
        />
      </div>
    </>
  );
};

export default ExpenseCategoryKHR;
