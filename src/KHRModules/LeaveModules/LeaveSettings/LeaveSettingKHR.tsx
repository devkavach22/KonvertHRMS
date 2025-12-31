import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PickList } from 'primereact/picklist';
import CollapseHeader from '@/core/common/collapse-header/collapse-header';
import CommonHeader from '@/CommonComponent/HeaderKHR/HeaderKHR';
import { all_routes } from '@/router/all_routes';
import CommonSelect from '@/core/common/commonSelect';
import ImageWithBasePath from '@/core/common/imageWithBasePath';
import { SelectWithImage } from '@/core/common/selectWithImage';
import AddEditAttendancePolicyModal from './AddEditLeaveSettingModal';
import {
  getAttendancePolicies,
  deleteAttendancePolicy,
  AttendancePolicy as AttendancePolicyType,
  APIAttendancePolicy,
} from "./LeaveSettingServices";

const LeaveSettingKHR = () => {
    const routes = all_routes;
  const [data, setData] = useState<AttendancePolicyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPolicy, setSelectedPolicy] =
    useState<AttendancePolicyType | null>(null);
  const [employeesOptions, setEmployeesOptions] = useState<Array<{id:any;name:string}>>([]);

  const leavetype = [
    { value: "Select", label: "Select" },
    { value: "Medical Leave", label: "Medical Leave" },
    { value: "Casual Leave", label: "Casual Leave" },
    { value: "Annual Leave", label: "Annual Leave" },
  ];
  const addemployee = [
    { value: "Select", label: "Select" },
    { value: "Sophie", label: "Sophie" },
    { value: "Cameron", label: "Cameron" },
    { value: "Doris", label: "Doris" },
  ];
  const [source, setSource] = useState<any>([
    { key: "1", Name: "Bernardo Galaviz" },
    { key: "2", Name: "Bernardo Galaviz" },
    { key: "3", Name: "John Doe" },
    { key: "4", Name: "John Smith" },
    { key: "5", Name: 'Mike Litorus' },
  ]);
  const [target, setTarget] = useState<any>([]);

  const onChange = (event: any) => {
    setSource(event.source);
    setTarget(event.target);
  };
  const itemTemplate = (item: any) => {
    return (
      <span className="font-bold">{item.Name}</span>
    );
  };

    const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAttendancePolicies();
      const safeResult = Array.isArray(result) ? result : [];

      // Build a lookup map of employees by id if we fetched options earlier
      const empMap: Record<string,string> = {};
      employeesOptions.forEach((e) => { empMap[String(e.id)] = e.name; });

      const mappedData: AttendancePolicyType[] = safeResult.map((item: APIAttendancePolicy) => {
        // normalize employees selection to array of objects with id/name
        let employees_selection: any[] = [];
        const raw = (item as any).employees_selection ?? (item as any).employees ?? [];
        if (Array.isArray(raw)) {
          employees_selection = raw.map((v: any) => {
            if (v && typeof v === "object") return v;
            const id = v;
            return { id, name: empMap[String(id)] ?? String(id) };
          });
        } else if (typeof raw === "string") {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              employees_selection = parsed.map((v: any) => (v && typeof v === "object") ? v : { id: v, name: empMap[String(v)] ?? String(v) });
            }
          } catch (e) {
            employees_selection = [];
          }
        }

        return {
          id: String(item.id),
          key: String(item.id),
          employees_selection,
          type: item.type ?? "",
          from_date: (item as any).from_date ?? (item as any).start_date ?? null,
          to_date: (item as any).to_date ?? (item as any).end_date ?? null,
          no_of_days: (item as any).no_of_days ?? null,
          remaining_days: (item as any).remaining_days ?? null,
          reason: (item as any).reason ?? "",
          // include approved_by and status fields so columns map correctly
          approved_by: (item as any).approved_by ?? (item as any).approver ?? (item as any).approved_by_name ?? null,
          status: (item as any).status ?? (item as any).approval_status ?? (item as any).state ?? null,
          created_date: item.create_date ?? "-",
        } as any;
      });

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load policies", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
           <CommonHeader
                title="Leave Settings"
                parentMenu="HR"
                activeMenu="Leave Settings"
                routes={routes}
                buttonText="Edit leave settings"
                modalTarget="#add_attendance_policy"
              />

          {/* /Breadcrumb */}
          {/* Leaves Info */}
          <div className="row">
            <div className="col-xl-4 col-md-6">
              <div className="card">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="form-check form-check-md form-switch me-1">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          defaultChecked
                        />
                      </label>
                    </div>
                    <h6 className="d-flex align-items-center">Annual Leave</h6>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="text-decoration-underline me-2"
                      data-bs-toggle="modal" data-inert={true}
                      data-bs-target="#add_custom_policy"
                    >
                      Custom Policy
                    </Link>
                    <Link
                      to="#"
                      data-bs-toggle="modal" data-inert={true}
                      data-bs-target="#annual_leave_settings"
                    >
                      {" "}
                      <i className="ti ti-settings" />{" "}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="card">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="form-check form-check-md form-switch me-1">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                        />
                      </label>
                    </div>
                    <h6 className="d-flex align-items-center">Sick Leave</h6>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="text-decoration-underline me-2"
                      data-bs-toggle="modal" data-inert={true}
                      data-bs-target="#add_custom_policy"
                    >
                      Custom Policy
                    </Link>
                    <Link
                      to="#"
                      data-bs-toggle="modal" data-inert={true}
                      data-bs-target="#sick_leave_settings"
                    >
                      {" "}
                      <i className="ti ti-settings" />{" "}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="card">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="form-check form-check-md form-switch me-1">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          defaultChecked
                        />
                      </label>
                    </div>
                    <h6 className="d-flex align-items-center">Hospitalisation</h6>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="text-decoration-underline me-2"
                      data-bs-toggle="modal" data-inert={true}
                      data-bs-target="#add_custom_policy"
                    >
                      Custom Policy
                    </Link>
                    <Link
                      to="#"
                      data-bs-toggle="modal" data-inert={true}
                      data-bs-target="#hospitalisation_settings"
                    >
                      <i className="ti ti-settings" />{" "}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="card">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="form-check form-check-md form-switch me-1">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          defaultChecked
                        />
                      </label>
                    </div>
                    <h6 className="d-flex align-items-center">Maternity</h6>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="text-decoration-underline me-2"
                      data-bs-toggle="modal" data-inert={true}
                      data-bs-target="#add_custom_policy"
                    >
                      Custom Policy
                    </Link>
                    <Link
                      to="#"
                      data-bs-toggle="modal" data-inert={true}
                      data-bs-target="#maternity_settings"
                    >
                      {" "}
                      <i className="ti ti-settings" />{" "}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="card">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="form-check form-check-md form-switch me-1">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                        />
                      </label>
                    </div>
                    <h6 className="d-flex align-items-center">Paternity</h6>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="text-decoration-underline me-2"
                      data-bs-toggle="modal" data-inert={true}
                      data-bs-target="#add_custom_policy"
                    >
                      Custom Policy
                    </Link>
                    <Link
                      to="#"
                      data-bs-toggle="modal" data-inert={true}
                      data-bs-target="#paternity_settings"
                    >
                      {" "}
                      <i className="ti ti-settings" />{" "}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="card">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="form-check form-check-md form-switch me-1">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                        />
                      </label>
                    </div>
                    <h6 className="d-flex align-items-center">LOP</h6>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="text-decoration-underline me-2"
                      data-bs-toggle="modal" data-inert={true}
                      data-bs-target="#add_custom_policy"
                    >
                      Custom Policy
                    </Link>
                    <Link
                      to="#"
                      data-bs-toggle="modal" data-inert={true}
                      data-bs-target="#lop_settings"
                    >
                      {" "}
                      <i className="ti ti-settings" />{" "}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Leaves Info */}
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
      {/* New Custom Policy */}
      <div className="modal fade" id="new_custom_policy">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">New Custom Policy</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form >
              <div className="modal-body pb-0">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Leave Type</label>
                      <CommonSelect
                        className='select'
                        options={leavetype}
                        defaultValue={leavetype[0]}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Policy Name</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">No of Days</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Add Employee</label>
                      <SelectWithImage />
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
                <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                  Add Leaves
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /New Custom Policy */}
      {/* Annual Leave */}
      <div className="modal fade" id="annual_leave_settings">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Annual Leave Settings</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form >
              <div className="contact-grids-tab">
                <ul className="nav nav-underline" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="settings-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#settings-info"
                      type="button"
                      role="tab"
                      aria-selected="true"
                    >
                      Settings
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="viwe-custom-policy-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#policy"
                      type="button"
                      role="tab"
                      aria-selected="false"
                    >
                      View Custom Policy
                    </button>
                  </li>
                </ul>
              </div>
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="settings-info"
                  role="tabpanel"
                  aria-labelledby="settings-tab"
                  tabIndex={0}
                >
                  <div className="modal-body pb-0 ">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">No of Days</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Carry Forward</label>
                          <div className="d-flex align-items-center">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadio"
                                id="flexRadio"
                                defaultChecked
                              />
                              <label className="form-label" htmlFor="flexRadio">
                                Yes
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadio"
                                id="flexRadioOne"
                              />
                              <label className="form-label" htmlFor="flexRadioOne">
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Maximum No of Days</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Earned leave</label>
                          <div className="d-flex align-items-center">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioOne"
                                id="flexRadioTwo"
                                defaultChecked
                              />
                              <label className="form-label" htmlFor="flexRadioTwo">
                                Yes
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioOne"
                                id="flexRadioThree"
                              />
                              <label
                                className="form-label"
                                htmlFor="flexRadioThree"
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-light border me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                      Save Changes{" "}
                    </button>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="policy"
                  role="tabpanel"
                  aria-labelledby="viwe-custom-policy-tab"
                  tabIndex={0}
                >
                  <div className="modal-body pb-0 ">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-13.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-32.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-58.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar group-counts bg-primary rounded-circle border-0 fs-10">
                                  +1
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body pb-1">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-32.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link to="#" className="">
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-58.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-13.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-light border me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                      Save Changes{" "}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Annual Leave */}
      {/* Sick Leave */}
      <div className="modal fade" id="sick_leave_settings">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Sick Leave Settings</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form >
              <div className="contact-grids-tab">
                <ul className="nav nav-underline" id="myTab6" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="settings-one-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#settings-one-info"
                      type="button"
                      role="tab"
                      aria-selected="true"
                    >
                      Settings
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="viwe-custom-policy-one-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#policy-one"
                      type="button"
                      role="tab"
                      aria-selected="false"
                    >
                      View Custom Policy
                    </button>
                  </li>
                </ul>
              </div>
              <div className="tab-content" id="myTabContent6">
                <div
                  className="tab-pane fade show active"
                  id="settings-one-info"
                  role="tabpanel"
                  aria-labelledby="settings-one-tab"
                  tabIndex={0}
                >
                  <div className="modal-body pb-0 ">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Days</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-light border me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                      Save Changes{" "}
                    </button>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="policy-one"
                  role="tabpanel"
                  aria-labelledby="viwe-custom-policy-one-tab"
                  tabIndex={0}
                >
                  <div className="modal-body pb-0 ">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-13.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-32.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-58.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar group-counts bg-primary rounded-circle border-0 fs-10">
                                  +1
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-32.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link to="#" className="">
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-58.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-13.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-light border me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                      Save Changes{" "}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Sick Leave */}
      {/* Hospitalisation Leave */}
      <div className="modal fade" id="hospitalisation_settings">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Hospitalisation Settings</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form >
              <div className="contact-grids-tab">
                <ul className="nav nav-underline" id="myTab2" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="settings-two-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#settings-two-info"
                      type="button"
                      role="tab"
                      aria-selected="true"
                    >
                      Settings
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="viwe-custom-policy-two-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#policy-two"
                      type="button"
                      role="tab"
                      aria-selected="false"
                    >
                      View Custom Policy
                    </button>
                  </li>
                </ul>
              </div>
              <div className="tab-content" id="myTabContent2">
                <div
                  className="tab-pane fade show active"
                  id="settings-two-info"
                  role="tabpanel"
                  aria-labelledby="settings-two-tab"
                  tabIndex={0}
                >
                  <div className="modal-body pb-0 ">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Days</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-light border me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                      Save Changes{" "}
                    </button>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="policy-two"
                  role="tabpanel"
                  aria-labelledby="viwe-custom-policy-two-tab"
                  tabIndex={0}
                >
                  <div className="modal-body pb-0 ">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-13.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-32.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-58.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar group-counts bg-primary rounded-circle border-0 fs-10">
                                  +1
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-32.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link to="#" className="">
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-58.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-light border me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                      Save Changes{" "}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Hospitalisation Leave */}
      {/* Maternity Leave */}
      <div className="modal fade" id="maternity_settings">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Maternity Settings</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form >
              <div className="contact-grids-tab">
                <ul className="nav nav-underline" id="myTab3" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="settings-three-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#settings-three-info"
                      type="button"
                      role="tab"
                      aria-selected="true"
                    >
                      Settings
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="viwe-custom-policy-three-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#policy-three"
                      type="button"
                      role="tab"
                      aria-selected="false"
                    >
                      View Custom Policy
                    </button>
                  </li>
                </ul>
              </div>
              <div className="tab-content" id="myTabContent3">
                <div
                  className="tab-pane fade show active"
                  id="settings-three-info"
                  role="tabpanel"
                  aria-labelledby="settings-three-tab"
                  tabIndex={0}
                >
                  <div className="modal-body pb-0 ">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Days{" "}
                            <span className="text-gray">
                              (Assigned to Female only)
                            </span>{" "}
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-light border me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                      Save Changes{" "}
                    </button>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="policy-three"
                  role="tabpanel"
                  aria-labelledby="viwe-custom-policy-three-tab"
                  tabIndex={0}
                >
                  <div className="modal-body pb-0 ">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-13.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-32.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-58.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar group-counts bg-primary rounded-circle border-0 fs-10">
                                  +1
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-32.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link to="#" className="">
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-58.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-light border me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                      Save Changes{" "}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Maternity Leave */}
      {/* Paternity Leave */}
      <div className="modal fade" id="paternity_settings">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Paternity Settings</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form >
              <div className="contact-grids-tab">
                <ul className="nav nav-underline" id="myTab4" role="tablist">
                                   <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="settings-four-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#settings-four-info"
                      type="button"
                      role="tab"
                      aria-selected="true"
                    >
                      Settings
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="viwe-custom-policy-four-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#policy-four"
                      type="button"
                      role="tab"
                      aria-selected="false"
                    >
                      View Custom Policy
                    </button>
                  </li>
                </ul>
              </div>
              <div className="tab-content" id="myTabContent4">
                <div
                  className="tab-pane fade show active"
                  id="settings-four-info"
                  role="tabpanel"
                  aria-labelledby="settings-four-tab"
                  tabIndex={0}
                >
                  <div className="modal-body pb-0 ">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Days{" "}
                            <span className="text-gray">
                              (Assigned to Male only)
                            </span>{" "}
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-light border me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                      Save Changes{" "}
                    </button>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="policy-four"
                  role="tabpanel"
                  aria-labelledby="viwe-custom-policy-four-tab"
                  tabIndex={0}
                >
                  <div className="modal-body pb-0 ">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-13.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-32.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-58.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar group-counts bg-primary rounded-circle border-0 fs-10">
                                  +1
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-58.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-13.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-light border me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                      Save Changes{" "}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Paternity Leave */}
      {/* LOP Leave */}
      <div className="modal fade" id="lop_settings">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">LOP Settings</h4>
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
              <div className="contact-grids-tab">
                <ul className="nav nav-underline" id="myTab5" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="settings-five-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#settings-five-info"
                      type="button"
                      role="tab"
                      aria-selected="true"
                    >
                      Settings
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="viwe-custom-policy-five-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#policy-five"
                      type="button"
                      role="tab"
                      aria-selected="false"
                    >
                      View Custom Policy
                    </button>
                  </li>
                </ul>
              </div>
              <div className="tab-content" id="myTabContent5">
                <div
                  className="tab-pane fade show active"
                  id="settings-five-info"
                  role="tabpanel"
                  aria-labelledby="settings-five-tab"
                  tabIndex={0}
                >
                  <div className="modal-body pb-0 ">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">No of Days</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Carry Forward</label>
                          <div className="d-flex align-items-center">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadio"
                                id="flexRadio4"
                                defaultChecked
                              />
                              <label className="form-label" htmlFor="flexRadio4">
                                Yes
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadio"
                                id="flexRadio5"
                              />
                              <label className="form-label" htmlFor="flexRadio5">
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Maximum No of Days</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Earned leave</label>
                          <div className="d-flex align-items-center">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioOne"
                                id="flexRadio6"
                                defaultChecked
                              />
                              <label className="form-label" htmlFor="flexRadio6">
                                Yes
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioOne"
                                id="flexRadio7"
                              />
                              <label className="form-label" htmlFor="flexRadio7">
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-light border me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                      Save Changes{" "}
                    </button>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="policy-five"
                  role="tabpanel"
                  aria-labelledby="viwe-custom-policy-five-tab"
                  tabIndex={0}
                >
                  <div className="modal-body pb-0 ">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-13.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-32.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-58.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar group-counts bg-primary rounded-circle border-0 fs-10">
                                  +1
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-11.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-32.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link to="#" className="">
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card border mb-3">
                          <div className="card-body pb-1">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="text-start">
                                <p className="mb-1">Policy Name</p>
                                <span className="text-dark fw-normal mb-0">
                                  2 Days Leave
                                </span>
                              </div>
                              <div>
                                <p className="mb-1">No Of Days</p>
                                <span className="text-dark fw-normal mb-0">2</span>
                              </div>
                              <div className="avatar-list-stacked avatar-group-sm">
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-09.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                                <span className="avatar border-0">
                                  <ImageWithBasePath
                                    src="assets/img/users/user-13.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                </span>
                              </div>
                              <div className="action-icon d-inline-flex">
                                <Link to="#" className="me-2 edit-leave-btn">
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal" data-inert={true}
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </div>
                            <div className="card border edit-leave-details">
                              <div className="card-body">
                                <h6 className="border-bottom mb-3 pb-3">
                                  Edit Policy
                                </h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Policy Name{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        No of Days{" "}
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>
                                  <div className="col-me-12">
                                    <label className="form-label">
                                      Add Employee
                                    </label>
                                    <CommonSelect
                                      className='select'
                                      options={addemployee}
                                      defaultValue={addemployee[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-light border me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                      Save Changes{" "}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /LOP Leave */}
      {/* Add Custom Policy Modal */}
      <div id="add_custom_policy" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Custom Policy</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Policy Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Days <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="input-block mb-3 leave-duallist">
                  <label className="col-form-label">Add employee</label>
                  <div className="card">
                    <PickList dataKey="id" source={source} target={target} onChange={onChange} itemTemplate={itemTemplate} breakpoint="1280px"
                      sourceHeader="Available" targetHeader="Selected" sourceStyle={{ height: '24rem' }} targetStyle={{ height: '24rem' }} />
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Custom Policy Modal */}
      {/* Edit Custom Policy Modal */}
      <div
        id="edit_custom_policy"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Custom Policy</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Policy Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" defaultValue="LOP" />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Days <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" defaultValue={4} />
                </div>
                <div className="input-block mb-3 leave-duallist">
                  <label className="col-form-label">Add employee</label>
                  <div className="row">
                    <div className="col-lg-5 col-sm-5">
                      <select
                        name="edit_customleave_from"
                        id="edit_customleave_select"
                        className="form-control form-select"
                        size={5}
                        multiple
                      >
                        <option value={1}>Bernardo Galaviz </option>
                        <option value={2}>Jeffrey Warden</option>
                        <option value={2}>John Doe</option>
                        <option value={2}>John Smith</option>
                        <option value={3}>Mike Litorus</option>
                      </select>
                    </div>
                    <div className="multiselect-controls col-lg-2 col-sm-2 d-grid gap-2">
                      <button
                        type="button"
                        id="edit_customleave_select_rightAll"
                        className="btn w-100 btn-white"
                      >
                        <i className="fa fa-forward" />
                      </button>
                      <button
                        type="button"
                        id="edit_customleave_select_rightSelected"
                        className="btn w-100 btn-white"
                      >
                        <i className="fa fa-chevron-right" />
                      </button>
                      <button
                        type="button"
                        id="edit_customleave_select_leftSelected"
                        className="btn w-100 btn-white"
                      >
                        <i className="fa fa-chevron-left" />
                      </button>
                      <button
                        type="button"
                        id="edit_customleave_select_leftAll"
                        className="btn w-100 btn-white"
                      >
                        <i className="fa fa-backward" />
                      </button>
                    </div>
                    <div className="col-lg-5 col-sm-5">
                      <select
                        name="customleave_to"
                        id="edit_customleave_select_to"
                        className="form-control form-select"
                        size={8}
                        multiple
                      />
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Submit</button>
                </div>
              </form>

              <AddEditAttendancePolicyModal
          onSuccess={fetchData}
          data={selectedPolicy}
        />
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Custom Policy Modal */}
    </>




  )
}

export default LeaveSettingKHR


// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { all_routes } from "../../../router/all_routes";
// import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// import AddEditAttendancePolicyModal from "./AddEditLeaveSettingModal";
// import moment from "moment";

// import {
//   getAttendancePolicies,
//   deleteAttendancePolicy,
//   AttendancePolicy as AttendancePolicyType,
//   APIAttendancePolicy,
// } from "./LeaveSettingServices";

// const LeaveAdminKHR = () => {
  // const routes = all_routes;
  // const [data, setData] = useState<AttendancePolicyType[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [selectedPolicy, setSelectedPolicy] =
  //   useState<AttendancePolicyType | null>(null);
  // const [employeesOptions, setEmployeesOptions] = useState<Array<{id:any;name:string}>>([]);
//   const [leaveCards, setLeaveCards] = useState<Array<{key:string;title:string;enabled:boolean;remaining:number}>>([
//     { key: "annual", title: "Annual Leave", enabled: true, remaining: 7 },
//     { key: "sick", title: "Sick Leave", enabled: false, remaining: 1 },
//     { key: "hospital", title: "Hospitalisation", enabled: true, remaining: 3 },
//     { key: "maternity", title: "Maternity", enabled: true, remaining: 30 },
//     { key: "paternity", title: "Paternity", enabled: false, remaining: 0 },
//     { key: "lop", title: "LOP", enabled: false, remaining: 0 },
//   ]);

//   const leavePolicies = [
//   { id: 1, name: "Annual Leave", enabled: true },
//   { id: 2, name: "Sick Leave", enabled: false },
//   { id: 3, name: "Hospitalisation", enabled: true },
//   { id: 4, name: "Maternity", enabled: true },
//   { id: 5, name: "Paternity", enabled: false },
//   { id: 6, name: "LOP", enabled: false },
// ];

//   const toggleCard = (key: string) => {
//     setLeaveCards((prev) => prev.map((c) => c.key === key ? { ...c, enabled: !c.enabled } : c));
//   };

//   const openCustom = (card: any) => {
//     // open modal for editing settings for this card
//     setSelectedPolicy({ id: card.key } as any);
//     const jq = (window as any).jQuery || (window as any).$;
//     if (jq && typeof jq === "function" && jq("#add_attendance_policy").modal) {
//       try { jq("#add_attendance_policy").modal("show"); } catch (e) { /* ignore */ }
//     }
//   };
  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const result = await getAttendancePolicies();
  //     const safeResult = Array.isArray(result) ? result : [];

  //     // Build a lookup map of employees by id if we fetched options earlier
  //     const empMap: Record<string,string> = {};
  //     employeesOptions.forEach((e) => { empMap[String(e.id)] = e.name; });

  //     const mappedData: AttendancePolicyType[] = safeResult.map((item: APIAttendancePolicy) => {
  //       // normalize employees selection to array of objects with id/name
  //       let employees_selection: any[] = [];
  //       const raw = (item as any).employees_selection ?? (item as any).employees ?? [];
  //       if (Array.isArray(raw)) {
  //         employees_selection = raw.map((v: any) => {
  //           if (v && typeof v === "object") return v;
  //           const id = v;
  //           return { id, name: empMap[String(id)] ?? String(id) };
  //         });
  //       } else if (typeof raw === "string") {
  //         try {
  //           const parsed = JSON.parse(raw);
  //           if (Array.isArray(parsed)) {
  //             employees_selection = parsed.map((v: any) => (v && typeof v === "object") ? v : { id: v, name: empMap[String(v)] ?? String(v) });
  //           }
  //         } catch (e) {
  //           employees_selection = [];
  //         }
  //       }

  //       return {
  //         id: String(item.id),
  //         key: String(item.id),
  //         employees_selection,
  //         type: item.type ?? "",
  //         from_date: (item as any).from_date ?? (item as any).start_date ?? null,
  //         to_date: (item as any).to_date ?? (item as any).end_date ?? null,
  //         no_of_days: (item as any).no_of_days ?? null,
  //         remaining_days: (item as any).remaining_days ?? null,
  //         reason: (item as any).reason ?? "",
  //         // include approved_by and status fields so columns map correctly
  //         approved_by: (item as any).approved_by ?? (item as any).approver ?? (item as any).approved_by_name ?? null,
  //         status: (item as any).status ?? (item as any).approval_status ?? (item as any).state ?? null,
  //         created_date: item.create_date ?? "-",
  //       } as any;
  //     });

  //     setData(mappedData);
  //   } catch (error) {
  //     console.error("Failed to load policies", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // useEffect(() => {
  //   fetchData();
  // }, []);

//   // fetch employees list for name lookup
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const endpoints = ["/api/employees", "/api/users", "/employees", "/users"];
//         let result: any = null;
//         for (const ep of endpoints) {
//           try {
//             const res = await fetch(ep);
//             if (!res.ok) continue;
//             const json = await res.json();
//             if (Array.isArray(json)) {
//               result = json; break;
//             }
//             if (json && Array.isArray(json.data)) { result = json.data; break; }
//           } catch (e) {
//             // continue
//           }
//         }
//         if (mounted && Array.isArray(result)) {
//           const opts = result.map((r: any) => ({ id: r.id ?? r.user_id ?? r.value, name: r.name ?? r.full_name ?? r.label ?? r.username ?? String(r.id) }));
//           setEmployeesOptions(opts);
//         }
//       } catch (e) {
//         // ignore
//       }
//     })();
//     return () => { mounted = false; };
//   }, []);

//   // re-fetch policies after employee names are loaded so we can map ids to names
//   useEffect(() => {
//     if (employeesOptions.length > 0) fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [employeesOptions.length]);

//   const handleDelete = async (id: string) => {
//     if (window.confirm("Are you sure you want to delete this policy?")) {
//       await deleteAttendancePolicy(id);
//       fetchData();
//     }
//   };

//   const columns: any[] = [
//     {
//       title: "Leave Type",
//       dataIndex: "type",
//       render: (val: any) => <span>{typeof val === "string" && val ? String(val).replace(/_/g, " ") : "-"}</span>,
//       sorter: (a: any, b: any) => String(a?.type ?? "").localeCompare(String(b?.type ?? "")),
//     },
//     {
//       title: "From",
//       dataIndex: "from_date",
//       render: (val: any, record: any) => {
//         const date = val ?? record.start_date ?? record.created_date ?? null;
//         return <span>{date && moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : "-"}</span>;
//       },
//       sorter: (a: any, b: any) => {
//         const aDate = a?.from_date ?? a?.start_date ?? a?.created_date ?? null;
//         const bDate = b?.from_date ?? b?.start_date ?? b?.created_date ?? null;
//         const ad = moment(aDate);
//         const bd = moment(bDate);
//         if (ad.isValid() && bd.isValid()) return ad.valueOf() - bd.valueOf();
//         if (ad.isValid()) return -1;
//         if (bd.isValid()) return 1;
//         return 0;
//       },
//     },
//     {
//       title: "Approved By",
//       dataIndex: "approved_by",
//       render: (_: any, record: any) => {
//         const ap = (record.approved_by && (record.approved_by.name || record.approved_by)) || record.approver || record.approved_by_name || null;
//         if (!ap) return <span>-</span>;
//         return <span>{typeof ap === 'string' ? ap : String(ap)}</span>;
//       },
//       sorter: (a: any, b: any) => {
//         const A = (a?.approved_by && (a.approved_by.name || a.approved_by)) || a?.approver || a?.approved_by_name || "";
//         const B = (b?.approved_by && (b.approved_by.name || b.approved_by)) || b?.approver || b?.approved_by_name || "";
//         return String(A).localeCompare(String(B));
//       },
//     },
//     {
//       title: "To",
//       dataIndex: "to_date",
//       render: (val: any, record: any) => {
//         const date = val ?? record.end_date ?? null;
//         return <span>{date && moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : "-"}</span>;
//       },
//       sorter: (a: any, b: any) => {
//         const aDate = a?.to_date ?? a?.end_date ?? null;
//         const bDate = b?.to_date ?? b?.end_date ?? null;
//         const ad = moment(aDate);
//         const bd = moment(bDate);
//         if (ad.isValid() && bd.isValid()) return ad.valueOf() - bd.valueOf();
//         if (ad.isValid()) return -1;
//         if (bd.isValid()) return 1;
//         return 0;
//       },
//     },
//     {
//       title: "No of Days",
//       dataIndex: "no_of_days",
//       render: (val: any, record: any) => {
//         if (val !== undefined && val !== null) return <span>{Number(val)}</span>;
//         const start = record.from_date ?? record.start_date ?? record.created_date ?? null;
//         const end = record.to_date ?? record.end_date ?? null;
//         if (start && end && moment(start).isValid() && moment(end).isValid()) {
//           const diff = moment(end).endOf("day").diff(moment(start).startOf("day"), "days") + 1;
//           return <span>{diff}</span>;
//         }
//         return <span>-</span>;
//       },
//       sorter: (a: any, b: any) => {
//         const getDays = (r: any) => {
//           if (r?.no_of_days !== undefined && r?.no_of_days !== null) return Number(r.no_of_days);
//           const s = r?.from_date ?? r?.start_date ?? r?.created_date ?? null;
//           const e = r?.to_date ?? r?.end_date ?? null;
//           if (s && e && moment(s).isValid() && moment(e).isValid()) {
//             return moment(e).endOf("day").diff(moment(s).startOf("day"), "days") + 1;
//           }
//           return 0;
//         };
//         return getDays(a) - getDays(b);
//       },
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (val: any, record: any) => {
//         const s = val ?? record.approval_status ?? record.state ?? record.status ?? null;
//         return <span>{s ? String(s) : "-"}</span>;
//       },
//       sorter: (a: any, b: any) => String(a?.status ?? a?.approval_status ?? a?.state ?? "").localeCompare(String(b?.status ?? b?.approval_status ?? b?.state ?? "")),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: any) => (
//         <div>
//           <button
//             className="btn btn-sm btn-primary me-2"
//             onClick={() => {
//               setSelectedPolicy(record);
//               const jq = (window as any).jQuery || (window as any).$;
//               if (jq && typeof jq === "function" && jq("#add_attendance_policy").modal) {
//                 try {
//                   jq("#add_attendance_policy").modal("show");
//                 } catch (e) {
//                   // ignore if modal call fails
//                 }
//               }
//             }}
//           >
//             Edit
//           </button>
//           <button
//             className="btn btn-sm btn-danger"
//             onClick={() => handleDelete(String(record.id))}
//           >
//             Delete
//           </button>
//         </div>
//       ),
//     },
//   ];

  
//   const initialPolicies = [
//     { id: 1, name: "Annual Leave", enabled: true },
//     { id: 2, name: "Sick Leave", enabled: false },
//     { id: 3, name: "Hospitalisation", enabled: true },
//     { id: 4, name: "Maternity", enabled: true },
//     { id: 5, name: "Paternity", enabled: false },
//     { id: 6, name: "LOP", enabled: false },
//   ];
  
//   const [policies, setPolicies] = useState(initialPolicies);

//     const togglePolicy = (id: number) => {
//     setPolicies((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, enabled: !item.enabled } : item
//       )
//     );
//   };

//   return (
//     <>
//       <div className="main-wrapper">
//         <div className="page-wrapper">
//           <div className="content">
//             <div onClick={() => setSelectedPolicy(null)}>
//               <CommonHeader
//                 title="Leave Settings"
//                 parentMenu="HR"
//                 activeMenu="Leave Settings"
//                 routes={routes}
//                 buttonText="Edit leave settings"
//                 modalTarget="#add_attendance_policy"
//               />
//             </div>


          
//     <div className="card">

// <div className="bg-gray-50 p-2 rounded-xl">
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-6">
//     {policies.slice(0, 6).map((policy) => (
//       <div
//         key={policy.id}
//         className="flex flex-row items-center justify-between rounded-xl border bg-white p-4 mb-2 shadow-sm transition hover:shadow-md"
//       >
//         <div className="flex items-center gap-4">
//           <h3
//             className={`text-sm font-semibold ${
//               policy.enabled ? "text-orange-600" : "text-gray-800"
//             }`}
//           >
//             {policy.name}
//           </h3>
//           <div className="text-xs text-gray-500">
//             Status:{" "}
//             <span className={`font-semibold ${policy.enabled ? "text-green-600" : "text-gray-400"}`}>
//               {policy.enabled ? "Enabled" : "Disabled"}
//             </span>
//           </div>
//         </div>

//         <a href="#" className="text-xs font-medium text-blue-600 hover:underline">
//           Custom Policy
//         </a>
//       </div>
//     ))}
//   </div>
// </div>


//             </div>
//           </div>
//         </div>

        // <AddEditAttendancePolicyModal
        //   onSuccess={fetchData}
        //   data={selectedPolicy}
        // />
//       </div>
//     </>
//   );
// };

// export default LeaveAdminKHR;


