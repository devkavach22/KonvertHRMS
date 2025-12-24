import { Link } from "react-router-dom";
import CommonSelect from "../../../core/common/commonSelect";
import { status } from "../../../core/common/selectoption/selectoption";
import Table from "../../../core/common/dataTable/index";
import { countries_data } from "../../../core/data/json/countries_data";
import type { TableData } from "../../../core/data/interface";
import { all_routes } from "../../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";

type CountryRow = {
  key: string;
  countryName: string;
  countryCode: string;
  status: string;
};

const Countries = () => {
  const data = countries_data;
  const columns = [
    {
      title: "Country Name",
      dataIndex: "countryName",
      render: (text: TableData["countryName"]) => (
        <h6 className="fw-medium">
          <Link to="#">{text}</Link>
        </h6>
      ),
      sorter: (a: CountryRow, b: CountryRow) =>
        a.countryName.length - b.countryName.length,
    },
    {
      title: "Country Code",
      dataIndex: "countryCode",
      sorter: (a: CountryRow, b: CountryRow) =>
        a.countryCode.length - b.countryCode.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a: CountryRow, b: CountryRow) =>
        a.status.length - b.status.length,
      render: (status: CountryRow["status"]) => (
        <span className="badge badge-success d-inline-flex align-items-center badge-xs">
          <i className="ti ti-circle-filled fs-5 me-1" />
          {status}
        </span>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      render: () => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            data-bs-toggle="modal"
            data-inert={true}
            data-bs-target="#edit_countries"
            className="me-2"
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

      <>
        {/* Add Country */}
        <div className="modal fade" id="add_countries">
          <div className="modal-dialog modal-dialog-centered modal-mg w-100">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Country</h4>
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
                        <label className="form-label">Country Name</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Country Code</label>
                        <input type="text" className="form-control" />
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
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Add Country
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Country */}
      </>
      <>
        {/* Edit Country */}
        <div className="modal fade" id="edit_countries">
          <div className="modal-dialog modal-dialog-centered modal-mg w-100">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Country</h4>
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
                        <label className="form-label">State Name</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="United States"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Country Name</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="US"
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
                    className="btn btn-light me-2"
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
        {/* /Edit Country */}
      </>
    </>
  );
};

export default Countries;
