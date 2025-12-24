import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import Table from "../../../core/common/dataTable/index";
import { DatePicker } from "antd";
import { invoice_details } from "../../../core/data/json/invoices_details";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";

// Define a type for invoice data
interface InvoiceData {
  Invoice: string;
  Name: string;
  Image: string;
  Roll: string;
  Created_On: string;
  Total: string;
  Amount_Due: string;
  Status: string;
  action?: string;
}

const Invoices = () => {
  const data: InvoiceData[] = invoice_details;

  const getModalContainer = () => {
    const modalElement = document.getElementById("modal-datepicker");
    return modalElement ? modalElement : document.body;
  };

  const columns = [
    {
      title: "Invoice",
      dataIndex: "Invoice",
      render: (text: string, _record: InvoiceData) => (
        <Link to={all_routes.invoiceDetails} className="tb-data">
          {text}
        </Link>
      ),
      sorter: (a: InvoiceData, b: InvoiceData) => a.Invoice.length - b.Invoice.length,
    },
    {
      title: "Name",
      dataIndex: "Name",
      render: (_text: string, record: InvoiceData) => (
        <div className="d-flex align-items-center">
          <Link
            to={all_routes.invoiceDetails}
            className="avatar avatar-lg me-2"
          >
            <ImageWithBasePath
              src={`assets/img/users/${record.Image}`}
              className="rounded-circle"
              alt={`${record.Name} Profile`}
            />
          </Link>
          <div>
            <h6 className="fw-medium">
              <Link to={all_routes.invoiceDetails}>{record.Name}</Link>
            </h6>
            <span className="fs-12">{record.Roll}</span>
          </div>
        </div>
      ),
      sorter: (a: InvoiceData, b: InvoiceData) => a.Name.length - b.Name.length,
    },
    {
      title: "Created On",
      dataIndex: "Created_On",
      sorter: (a: InvoiceData, b: InvoiceData) => a.Created_On.length - b.Created_On.length,
    },
    {
      title: "Total",
      dataIndex: "Total",
      sorter: (a: InvoiceData, b: InvoiceData) => a.Total.length - b.Total.length,
    },
    {
      title: "Amount Due",
      dataIndex: "Amount_Due",
      sorter: (a: InvoiceData, b: InvoiceData) => a.Amount_Due.length - b.Amount_Due.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string, _record: InvoiceData) => (
        <span
          className={`badge ${
            text === "Paid"
              ? "badge-soft-success"
              : text === "Pending"
              ? "badge-soft-purple"
              : text === "Draft"
              ? "badge-soft-warning"
              : "badge-soft-danger"
          } d-inline-flex align-items-center`}
        >
          <i className="ti ti-point-filled me-1" />
          {text}
        </span>
      ),
      sorter: (a: InvoiceData, b: InvoiceData) => a.Status.length - b.Status.length,
    },
    {
      title: "",
      dataIndex: "action",
      render: (_text: string, _record: InvoiceData) => (
        <div className="action-icon d-inline-flex">
          <Link to={all_routes.invoicesdetails} className="me-2" aria-label="View invoice">
            <i className="ti ti-eye" />
          </Link>
          <Link to={all_routes.editinvoice} className="me-2" aria-label="Edit invoice">
            <i className="ti ti-edit" />
          </Link>
          <button
            type="button"
            className=""
            data-bs-toggle="modal"
            data-bs-target="#delete_modal"
            aria-label="Delete invoice"
          >
            <i className="ti ti-trash" />
          </button>
        </div>
      ),
      sorter: (a: InvoiceData, b: InvoiceData) => (a.action?.length || 0) - (b.action?.length || 0),
    },
  ];

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Invoices</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Application</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Invoices
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              <div className="me-2 mb-2">
                <div className="dropdown">
                  <button
                    type="button"
                    className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-file-export me-2" />
                    Export
                  </button>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <button type="button" className="dropdown-item rounded-1">
                        <i className="ti ti-file-type-pdf me-1" />
                        Export as PDF
                      </button>
                    </li>
                    <li>
                      <button type="button" className="dropdown-item rounded-1">
                        <i className="ti ti-file-type-xls me-1" />
                        Export as Excel{" "}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mb-2">
                <Link
                  to={all_routes.addinvoice}
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-circle-plus me-2" />
                  Add Invoice
                </Link>
              </div>
              <div className="ms-2 head-icons">
                <CollapseHeader />
              </div>
            </div>
          </div>
          {/* /Breadcrumb */}
          {/* Invoice Data */}
         
          {/* /Invoice Data */}
          {/* Invoice DataTable */}
         
          {/* /Invoice DataTable */}
        </div>
        {/* Footer */}
        <div className="footer d-sm-flex align-items-center justify-content-between bg-white border-top p-3">
          <p className="mb-0">2014 - 2025 © SmartHR.</p>
          <p>
            Designed &amp; Developed By{" "}
            <Link to="#" className="text-primary">
              Dreams
            </Link>
          </p>
        </div>
        {/* /Footer */}
        {/* /Page Wrapper */}
      </div>
    </>
  );
};

export default Invoices;
