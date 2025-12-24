import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { all_routes } from '../../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header/collapse-header'
import AddCompany from '../../../core/modals/add_company'
import EditCompany from '../../../core/modals/edit_company'

const CompaniesGrid = () => {
  const routes = all_routes
  return (
    <>
    <div className="page-wrapper">
  <div className="content">
    {/* Breadcrumb */}
    <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
      <div className="my-auto mb-2">
        <h2 className="mb-1">Companies</h2>
        <nav>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to={routes.adminDashboard}>
                <i className="ti ti-smart-home" />
              </Link>
            </li>
            <li className="breadcrumb-item">CRM</li>
            <li className="breadcrumb-item active" aria-current="page">
              Companies Grid
            </li>
          </ol>
        </nav>
      </div>
      <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
        <div className="me-2 mb-2">
          <div className="d-flex align-items-center border bg-white rounded p-1 me-2 icon-list">
            <Link to={routes.companiesList} className="btn btn-icon btn-sm me-1">
              <i className="ti ti-list-tree" />
            </Link>
            <Link
              to={routes.companiesGrid}
              className="btn btn-icon btn-sm active bg-primary text-white"
            >
              <i className="ti ti-layout-grid" />
            </Link>
          </div>
        </div>
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
            data-bs-target="#add_company"
            className="btn btn-primary d-flex align-items-center"
          >
            <i className="ti ti-circle-plus me-2" />
            Add Company
          </Link>
        </div>
        <div className="head-icons ms-2">
        <CollapseHeader/>
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
<AddCompany/>
<EditCompany/>
    </>
  )
}

export default CompaniesGrid