import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditSalaryRuleCategory from "./AddEditSalaryRuleCategory";
import {
  getSalaryRuleCategories,
  deleteSalaryRuleCategory,
  SalaryRuleCategory,
} from "./SalaryRuleCategory";

const SalaryRuleCategoryKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<SalaryRuleCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] =
    useState<SalaryRuleCategory | null>(null);

  // Utility function to strip HTML tags
  const stripHtmlTags = (html: string): string => {
    if (!html) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getSalaryRuleCategories();
      console.log("Fetched Categories:", response);

      const rawArray = Array.isArray(response) ? response : [];

      const mappedData = rawArray.map((item: any) => ({
        id: String(item.id),
        key: String(item.id),
        name: item.name,
        parent_id: item.parent_id,
        note: stripHtmlTags(item.note || ""), // Strip HTML tags from note
        created_date: item.created_at || item.created_date,
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load salary rule categories");
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
        const response = await deleteSalaryRuleCategory(id);
        const message = response.data?.message || "Category deleted successfully";
        toast.success(message);
        fetchData();
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || "Failed to delete category";
        toast.error(errorMsg);
      }
    }
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      render: (text: string) => (
        <span className="fs-14 fw-bold text-dark">{text}</span>
      ),
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Parent Category",
      dataIndex: "parent_id",
      render: (parentId: number) => {
        if (!parentId) return <span className="text-muted">-</span>;
        const parentCategory = data.find(item => Number(item.id) === parentId);
        return (
          <span className="fs-14 text-primary">
            {parentCategory?.name || `ID: ${parentId}`}
          </span>
        );
      },
      sorter: (a: any, b: any) => (a.parent_id || 0) - (b.parent_id || 0),
    },
    {
      title: "Note",
      dataIndex: "note",
      render: (text: string) => (
        <span className="fs-13 text-muted">
          {text ? (text.length > 50 ? `${text.substring(0, 50)}...` : text) : "-"}
        </span>
      ),
    },
    // {
    //   title: "Created Date",
    //   dataIndex: "created_date",
    //   render: (date: string) => {
    //     if (!date) return <span className="text-muted">-</span>;
    //     return (
    //       <span className="fs-13">
    //         {new Date(date).toLocaleDateString()}
    //       </span>
    //     );
    //   },
    //   sorter: (a: any, b: any) => {
    //     if (!a.created_date || !b.created_date) return 0;
    //     return new Date(a.created_date).getTime() - new Date(b.created_date).getTime();
    //   },
    // },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: any) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_salary_rule_cat_modal"
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
              title="Salary Rule Categories"
              parentMenu="Master Data"
              activeMenu="Salary Rule Categories"
              routes={routes}
              buttonText="Add Category"
              modalTarget="#add_salary_rule_cat_modal"
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
                  <div className="mt-2">Loading Categories...</div>
                </div>
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

      <AddEditSalaryRuleCategory onSuccess={fetchData} data={selectedCategory} />
    </>
  );
};

export default SalaryRuleCategoryKHR;
