import { Link } from "react-router-dom";
import CommonSelect from "../../../core/common/commonSelect";
import { status } from "../../../core/common/selectoption/selectoption";
import Table from "../../../core/common/dataTable/index";
import { states_data } from "../../../core/data/json/states_data";
import { all_routes } from "../../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";

type StateRow = {
  key: string;
  stateName: string;
  countryName: string;
  status: string;
};

const States = () => {
  const countryName = [
    { value: "Select", label: "Select" },
    { value: "United States", label: "United States" },
    { value: "Germany", label: "Germany" },
    { value: "Canada", label: "Canada" },
  ];

  const data = states_data;
  const columns = [
    {
      title: "State Name",
      dataIndex: "stateName",
      render: (text: StateRow["stateName"]) => (
        <span className="text-dark">{text}</span>
      ),
      sorter: (a: StateRow, b: StateRow) =>
        a.stateName.length - b.stateName.length,
    },
    {
      title: "Country Name",
      dataIndex: "countryName",
      sorter: (a: StateRow, b: StateRow) =>
        a.countryName.length - b.countryName.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a: StateRow, b: StateRow) => a.status.length - b.status.length,
      render: (status: StateRow["status"]) => (
        <span className="badge badge-soft-success d-inline-flex align-items-center">
          <i className="ti ti-circle-filled fs-5 me-1" />
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <div className="d-flex align-items-center">
          <div className="dropdown">
            <Link
              to="#"
              className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-dots-vertical fs-14" />
            </Link>
            <ul className="dropdown-menu dropdown-menu-right p-3">
              <li>
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  data-bs-toggle="modal"
                  data-inert={true}
                  data-bs-target="#edit_state"
                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  data-bs-toggle="modal"
                  data-inert={true}
                  data-bs-target="#delete-modal"
                >
                  <i className="ti ti-trash-x me-2" />
                  Delete
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div>
      {" "}
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
      </>
      <>
        {/* Add State */}
        <div className="modal fade" id="add_state">
          <div className="modal-dialog modal-dialog-centered modal-mg w-100">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add State</h4>
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
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Country Name</label>
                        <CommonSelect
                          className="select"
                          options={countryName}
                          defaultValue={countryName[0]}
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
                    Add State
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add State */}
      </>
      <>
        {/* Edit State */}
        <div className="modal fade" id="edit_state">
          <div className="modal-dialog modal-dialog-centered modal-mg w-100">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit State</h4>
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
                          defaultValue="California"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Country Name</label>
                        <CommonSelect
                          className="select"
                          options={countryName}
                          defaultValue={countryName[1]}
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
        {/* /Edit State */}
      </>
    </div>
  );
};

export default States;
