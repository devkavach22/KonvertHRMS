import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import {
  EmployeeRegcategories,
  createRegCategory,
  TBSelector,
  updateState,
} from "@/Store/Reducers/TBSlice";
import type { AppDispatch } from "@/Store";

interface RegCategory {
  id: string;
  key: string;
  Category_Type: string;
  Created_Date: string;
}

const RegCategoryKHR = () => {
  const routes = all_routes;
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<RegCategory[]>([]);
  const [type, setType] = useState("");
  const [editData, setEditData] = useState<RegCategory | null>(null);

  const {
    isEmployeeRegcategories,
    isEmployeeRegcategoriesFetching,
    EmployeeRegcategoriesData,
    isCreateRegCategory,
    isCreateRegCategoryFetching,
    isError,
    errorMessage,
  } = useSelector(TBSelector);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(EmployeeRegcategories());
  }, []);

  // Map data when fetched
  useEffect(() => {
    if (isEmployeeRegcategories && EmployeeRegcategoriesData?.data) {
      const mappedData: RegCategory[] = EmployeeRegcategoriesData.data.map(
        (item: any) => ({
          id: String(item.id),
          key: String(item.id),
          Category_Type: item.type || "-",
          Created_Date: item.create_date || "-",
        })
      );
      setData(mappedData);
      dispatch(updateState({ isEmployeeRegcategories: false }));
    }
  }, [isEmployeeRegcategories, EmployeeRegcategoriesData]);

  // Handle create success
  useEffect(() => {
    if (isCreateRegCategory) {
      toast.success("Category created successfully!");
      setType("");
      dispatch(updateState({ isCreateRegCategory: false }));
      dispatch(EmployeeRegcategories());
      // Close modal
      const closeBtn = document.getElementById("close-btn-regcat");
      closeBtn?.click();
    }
  }, [isCreateRegCategory]);

  // Handle error
  useEffect(() => {
    if (isError && errorMessage) {
      toast.error(errorMessage);
      dispatch(updateState({ isError: false, errorMessage: "" }));
    }
  }, [isError, errorMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type.trim()) {
      toast.error("Please enter a category type");
      return;
    }
    dispatch(createRegCategory({ type: type.trim() }));
  };

  // Clear form when modal opens for new entry
  useEffect(() => {
    const modalElement = document.getElementById("add_regcategory");
    const handleShow = () => {
      if (!editData) setType("");
    };
    const handleHidden = () => {
      setType("");
      setEditData(null);
    };
    modalElement?.addEventListener("show.bs.modal", handleShow);
    modalElement?.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      modalElement?.removeEventListener("show.bs.modal", handleShow);
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, [editData]);

  const columns = [
    {
      title: "Category Type",
      dataIndex: "Category_Type",
      render: (text: string) => (
        <span className="fs-14 fw-medium text-dark">{text}</span>
      ),
      sorter: (a: RegCategory, b: RegCategory) =>
        a.Category_Type.localeCompare(b.Category_Type),
    },
    {
      title: "Created Date",
      dataIndex: "Created_Date",
      sorter: (a: RegCategory, b: RegCategory) =>
        a.Created_Date.localeCompare(b.Created_Date),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => setEditData(null)}>
            <CommonHeader
              title="Regularization Category"
              parentMenu="Settings"
              activeMenu="Regularization Category"
              routes={routes}
              buttonText="Add Category"
              modalTarget="#add_regcategory"
            />
          </div>

          <div className="card">
            <div className="card-body p-0">
              {isEmployeeRegcategoriesFetching ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <div className="mt-2">Loading Categories...</div>
                </div>
              ) : (
                <DatatableKHR
                  data={data}
                  columns={columns}
                  selection={true}
                  textKey="Category_Type"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      <div className="modal custom-modal fade" id="add_regcategory" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title">Add Regularization Category</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="close-btn-regcat"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Category Type <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="Enter category type (e.g., Work From Home)"
                  />
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isCreateRegCategoryFetching}
                  >
                    {isCreateRegCategoryFetching ? "Creating..." : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegCategoryKHR;
