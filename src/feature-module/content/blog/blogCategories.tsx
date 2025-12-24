import { useState } from "react";
import { Link } from "react-router-dom";
import CommonSelect from "../../../core/common/commonSelect";
import { blog_categories_data } from "../../../core/data/json/blog_categories_data";
import Table from "../../../core/common/dataTable/index";

import { all_routes } from "../../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";
import TagInput from "../../../core/common/Taginput";

type BlogCategoryRow = {
  key: string;
  category: string;
  created_date: string;
  status: string;
};

const BlogCategories = () => {
  const data = blog_categories_data;
  const routes = all_routes;
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      render: (record: BlogCategoryRow["category"]) => (
        <span className="text-dark">{record}</span>
      ),
      sorter: (a: BlogCategoryRow, b: BlogCategoryRow) =>
        a.category.length - b.category.length,
    },
    {
      title: "Created Date",
      dataIndex: "created_date",
      sorter: (a: BlogCategoryRow, b: BlogCategoryRow) =>
        a.created_date.length - b.created_date.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a: BlogCategoryRow, b: BlogCategoryRow) =>
        a.status.length - b.status.length,
      render: (status: BlogCategoryRow["status"]) => (
        <span
          className={`badge ${
            status === "Active" ? "badge-success" : "badge-danger"
          }`}
        >
          <i className="ti ti-point-filled"></i>
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: () => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-inert={true}
            data-bs-target="#edit_blog-category"
          >
            <i className="ti ti-edit" />
          </Link>
          <Link
            to="#"
            data-bs-toggle="modal"
            data-inert={true}
            data-bs-target="#delete_modal"
          >
            <i className="ti ti-trash" />
          </Link>
        </div>
      ),
    },
  ];

  const status = [
    { value: "Select", label: "Select" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];
  const [tags, setTags] = useState<string[]>(["HRMS", "Recruitment", "HRTech"]);
  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
         
          {/* /Breadcrumb */}
       
        </div>
        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0">2014 - 2025 © SmartHR.</p>
          <p>
            Designed &amp; Developed By{" "}
            <Link to="#" className="text-primary">
              Dreams
            </Link>
          </p>
        </div>
      </div>
      {/* /Page Wrapper */}
      <>
        {/* Add Tag */}
        <div className="modal fade" id="add_blog-category">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Blog Category</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body pb-0">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Tag</label>
                        <TagInput
                          initialTags={tags}
                          onTagsChange={handleTagsChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <CommonSelect
                          className="select"
                          options={status}
                          defaultValue={status[0]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-white border me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Add Tag
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Tag */}
      </>
      <>
        {/* Edit Tag */}
        <div className="modal fade" id="edit_blog-category">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Blog Category</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body pb-0">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Tag</label>
                        <TagInput
                          initialTags={tags}
                          onTagsChange={handleTagsChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <CommonSelect
                          className="select"
                          options={status}
                          defaultValue={status[1]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-white border me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Edit Tag */}
      </>
    </>
  );
};

export default BlogCategories;
