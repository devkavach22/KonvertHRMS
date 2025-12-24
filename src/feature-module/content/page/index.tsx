import { Link } from "react-router-dom";
import { pageDetails } from "../../../core/data/json/pageDetails";
import AddNewPage from "./addNewPage";
import EditNewPage from "./editNewPage";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";

type PageRow = { key: string; page: string; page_slug: string; status: string };

const Page = () => {
  const data = pageDetails;
  const columns = [
    {
      title: "Page",
      dataIndex: "page",
      render: (text: PageRow["page"]) => (
        <h6 className="fw-medium">
          <Link to="#">{text}</Link>
        </h6>
      ),
      sorter: (a: PageRow, b: PageRow) => a.page.length - b.page.length,
    },
    {
      title: "Page Slug",
      dataIndex: "page_slug",
      sorter: (a: PageRow, b: PageRow) =>
        a.page_slug.length - b.page_slug.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: PageRow["status"]) => (
        <span
          className={`badge d-inline-flex align-items-center badge-xs ${
            text === "Active"
              ? "badge-success"
              : text === "Inactive"
              ? "badge-danger"
              : ""
          }`}
        >
          <i className="ti ti-point-filled me-1" />
          {text}
        </span>
      ),
      sorter: (a: PageRow, b: PageRow) => a.status.length - b.status.length,
    },
    {
      title: "",
      dataIndex: "actions",
      render: () => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-inert={true}
            data-bs-target="#edit_page"
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
      <AddNewPage />
      <EditNewPage />
    </>
  );
};

export default Page;
