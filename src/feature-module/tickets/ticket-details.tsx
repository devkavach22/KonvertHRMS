import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";
import CommonSelect from "../../core/common/commonSelect";
import TicketListModal from "../../core/modals/ticketListModal";

const TicketDetails = () => {
    const routes = all_routes;
    const changePriority = [
        { value: "High", label: "High" },
        { value: "Medium", label: "Medium" },
        { value: "Low", label: "Low" },
    ];
    const assignTo = [
        { value: "Edgar Hansel", label: "Edgar Hansel" },
        { value: "Juan Hermann", label: "Juan Hermann" },
    ];
    const ticketStatus = [
        { value: "Open", label: "Open" },
        { value: "On Hold", label: "On Hold" },
        { value: "Reopened", label: "Reopened" },
    ];
  return (
    <>
    {/* Page Wrapper */}
    <div className="page-wrapper">
        <div className="content">
        {/* Breadcrumb */}
        <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="mb-2">
            <h6 className="fw-medium d-flex align-items-center">
                <Link to={routes.adminDashboard}>
                <i className="ti ti-arrow-left me-2" />
                Ticket Details
                </Link>
            </h6>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <div className="me-2 mb-2">
                <div className="dropdown">
                <Link
                    to="#"
                    className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                >
                    <i className="ti ti-file-export me-1" />
                    Export
                </Link>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                    <Link
                        to="#"
                        className="dropdown-item rounded-1"
                    >
                        <i className="ti ti-file-type-pdf me-1" />
                        Export as PDF
                    </Link>
                    </li>
                    <li>
                    <Link
                        to="#"
                        className="dropdown-item rounded-1"
                    >
                        <i className="ti ti-file-type-xls me-1" />
                        Export as Excel{" "}
                    </Link>
                    </li>
                </ul>
                </div>
            </div>
            <div className="mb-2">
                <Link
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#add_ticket"
                className="btn btn-primary d-flex align-items-center"
                >
                <i className="ti ti-circle-plus me-2" />
                Add Ticket
                </Link>
            </div>
            <div className="head-icons ms-2">
                <CollapseHeader />
            </div>
            </div>
        </div>
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

    <TicketListModal />
    </>
  );
};

export default TicketDetails;
