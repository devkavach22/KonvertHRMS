import { Link } from "react-router-dom";
import CommonSelect from "../../../core/common/commonSelect";
import { status } from "../../../core/common/selectoption/selectoption";
import Table from "../../../core/common/dataTable/index";
import { cities_data } from "../../../core/data/json/cities_data";
import { all_routes } from "../../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";

type CityRow = {
  key: string;
  cityName: string;
  stateName: string;
  countryName: string;
  status: string;
};

const Cities = () => {
  const countryName = [
    { value: "Select", label: "Select" },
    { value: "United States", label: "United States" },
    { value: "Germany", label: "Germany" },
    { value: "Canada", label: "Canada" },
  ];
  const stateName = [
    { value: "Select", label: "Select" },
    { value: "California", label: "California" },
    { value: "New York", label: "New York" },
    { value: "Texas", label: "Texas" },
  ];

  const data = cities_data;
  const columns = [
    {
      title: "City Name",
      dataIndex: "cityName",
      key: "cityName",
      render: (text: CityRow["cityName"]) => (
        <span className="text-dark">{text}</span>
      ),
      sorter: (a: CityRow, b: CityRow) => a.cityName.length - b.cityName.length,
    },
    {
      title: "State Name",
      dataIndex: "stateName",
      key: "stateName",
      sorter: (a: CityRow, b: CityRow) =>
        a.stateName.length - b.stateName.length,
    },
    {
      title: "Country Name",
      dataIndex: "countryName",
      key: "countryName",
      sorter: (a: CityRow, b: CityRow) =>
        a.countryName.length - b.countryName.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a: CityRow, b: CityRow) => a.status.length - b.status.length,
      render: (status: CityRow["status"]) => (
        <span className="badge badge-success d-inline-flex align-items-center badge-xs">
          <i className="ti ti-point-filled me-1" />
          {status}
        </span>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: () => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            data-bs-toggle="modal"
            data-inert={true}
            data-bs-target="#edit_cities"
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
        {/* Add City */}
        <div className="modal fade" id="add_cities">
          <div className="modal-dialog modal-dialog-centered modal-mg w-100">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add City</h4>
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
                        <label className="form-label">City Name</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">State Name</label>
                        <CommonSelect
                          className="select"
                          options={stateName}
                          defaultValue={stateName[0]}
                        />
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
                    Add City
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add City */}
        {/* Edit City */}
        <div className="modal fade" id="edit_cities">
          <div className="modal-dialog modal-dialog-centered modal-mg w-100">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit City</h4>
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
                        <label className="form-label">City Name</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Los Angeles"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">State Name</label>
                        <CommonSelect
                          className="select"
                          options={stateName}
                          defaultValue={stateName[1]}
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
        {/* /Edit City */}
      </>
    </>
  );
};

export default Cities;
