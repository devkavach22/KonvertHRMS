import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditExpenseKHRModal from "./AddEditExpenseKHRModal";
import moment from "moment";
import { getExpenses, deleteExpense } from "./ExpenseKHRService";

const ExpenseKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);

  // --- Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getExpenses();
      // Adjust according to actual response structure (e.g., result.data.data or result.data)
      const list = Array.isArray(result.data?.data)
        ? result.data.data
        : Array.isArray(result.data)
        ? result.data
        : [];

      const mappedData = list.map((item: any, index: number) => ({
        ...item,
        key: item.id || index, // Ensure unique key for table
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load expenses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Delete Handler ---
  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting expense", error);
        alert("Failed to delete expense");
      }
    }
  };

  // --- Modal Helper ---
  const openModal = (record: any | null) => {
    setSelectedExpense(record);
    const jq = (window as any).jQuery || (window as any).$;
    if (jq && typeof jq === "function") {
      try {
        jq("#add_expense_modal").modal("show");
      } catch (e) {
        // ignore
      }
    }
  };

  // --- Columns ---
  const columns: any[] = [
    {
      title: "Date",
      dataIndex: "date",
      render: (val: any) => (
        <span>{val ? moment(val).format("YYYY-MM-DD") : "-"}</span>
      ),
      sorter: (a: any, b: any) =>
        moment(a.date).valueOf() - moment(b.date).valueOf(),
    },
    {
      title: "Description",
      dataIndex: "name",
      render: (val: any) => <span className="fw-medium">{val || "-"}</span>,
      sorter: (a: any, b: any) =>
        String(a.name || "").localeCompare(String(b.name || "")),
    },
    {
      title: "Product ID",
      dataIndex: "product_id",
      render: (val: any) => <span>{val}</span>,
    },
    {
      title: "Paid By",
      dataIndex: "payment_mode",
      render: (val: string) => (
        <span
          className={`badge ${
            val === "own_account" ? "bg-info" : "bg-primary"
          }`}
        >
          {val === "own_account" ? "Employee" : "Company"}
        </span>
      ),
    },
    {
      title: "Total",
      dataIndex: "total_amount_currency",
      render: (val: any) => <span className="fw-bold">₹ {val}</span>,
      sorter: (a: any, b: any) =>
        Number(a.total_amount_currency) - Number(b.total_amount_currency),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (val: any) => (
        <span className="badge bg-light text-dark border">
          {val || "Draft"}
        </span>
      ),
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
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => setSelectedExpense(null)}>
            <CommonHeader
              title="My Expenses"
              parentMenu="Expenses"
              activeMenu="My Expenses"
              routes={routes}
              buttonText="Create Report"
              modalTarget="#add_expense_modal"
            />
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Expense List</h5>
              <div className="mt-3">
                <DatatableKHR columns={columns} data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEditExpenseKHRModal onSuccess={fetchData} data={selectedExpense} />
    </div>
  );
};

export default ExpenseKHR;
