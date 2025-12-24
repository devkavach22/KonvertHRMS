import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import { apiKeyDetails } from "../../../core/data/json/apiKeyDetails";
import Table from "../../../core/common/dataTable/index";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import PredefinedDateRanges from "../../../core/common/datePicker";
import AddKeyModal from "./addKeyModal";
import EditKeyModal from "./editKeyModal copy";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";

interface ApiKeyRecord {
  checkbox: boolean;
  service_name: string;
  created_by: string;
  image_url: string;
  api_key: string;
  status: string;
  created_date: string;
  key: string;
}

const ApiKeys = () => {
  const data = apiKeyDetails;
  const columns = [
    {
      title: "Service Name",
      dataIndex: "service_name",
      sorter: (a: ApiKeyRecord, b: ApiKeyRecord) =>
        a.service_name.length - b.service_name.length,
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      render: (text: string, record: ApiKeyRecord) => (
        <div className="d-flex align-items-center">
          <Link
            to="#"
            className="avatar avatar-md"
            data-bs-toggle="modal"
            data-inert={true}
            data-bs-target="#view_details"
          >
            <ImageWithBasePath
              src={record.image_url}
              className="img-fluid rounded-circle"
              alt={`Profile picture of ${text}`}
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark fw-medium mb-0">
              <Link
                to="#"
                data-bs-toggle="modal"
                data-inert={true}
                data-bs-target="#view_details"
              >
                {text}
              </Link>
            </p>
          </div>
        </div>
      ),
      sorter: (a: ApiKeyRecord, b: ApiKeyRecord) =>
        a.created_by.length - b.created_by.length,
    },
    {
      title: "Api Key",
      dataIndex: "api_key",
      render: (text: string) => (
        <div className="d-flex align-items-center">
          <p className="me-2 mb-0">{text}</p>
          <span>
            <i className="ti ti-clipboard"></i>
          </span>
        </div>
      ),
      sorter: (a: ApiKeyRecord, b: ApiKeyRecord) =>
        a.api_key.length - b.api_key.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <span
          className={`badge d-inline-flex align-items-center badge-xs ${
            text === "Success"
              ? "badge-success"
              : text === "Warning"
              ? "badge-warning"
              : "badge-danger"
          }`}
        >
          <i className="ti ti-point-filled me-1"></i>
          {text}
        </span>
      ),
      sorter: (a: ApiKeyRecord, b: ApiKeyRecord) =>
        a.status.length - b.status.length,
    },
    {
      title: "Created Date",
      dataIndex: "created_date",
      sorter: (a: ApiKeyRecord, b: ApiKeyRecord) =>
        a.created_date.length - b.created_date.length,
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
            data-bs-target="#edit_key"
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
      <AddKeyModal />
      <EditKeyModal />
    </>
  );
};

export default ApiKeys;
