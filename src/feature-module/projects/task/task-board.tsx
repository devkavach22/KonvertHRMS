import { useEffect, useRef, useState } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import CommonSelect from "../../../core/common/commonSelect";
import { DatePicker } from "antd";
import CommonTextEditor from "../../../core/common/textEditor";
import dragula, { type Drake } from "dragula";
import "dragula/dist/dragula.css";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";
import TagInput from "../../../core/common/Taginput";
import { all_routes } from "../../../router/all_routes";

const TaskBoard = () => {
  const getModalContainer = () => {
    const modalElement = document.getElementById("modal-datepicker");
    return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
  };

  const projectChoose = [
    { value: "Select", label: "Select" },
    { value: "Office Management", label: "Office Management" },
    { value: "Clinic Management", label: "Clinic Management" },
    { value: "Educational Platform", label: "Educational Platform" },
  ];
  const statusChoose = [
    { value: "Select", label: "Select" },
    { value: "Inprogress", label: "Inprogress" },
    { value: "Completed", label: "Completed" },
    { value: "Pending", label: "Pending" },
    { value: "Onhold", label: "Onhold" },
  ];
  const priorityChoose = [
    { value: "Select", label: "Select" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Low", label: "Low" },
  ];

  const container1Ref = useRef<HTMLDivElement>(null);
  const container2Ref = useRef<HTMLDivElement>(null);
  const container3Ref = useRef<HTMLDivElement>(null);
  const container4Ref = useRef<HTMLDivElement>(null);
  const container5Ref = useRef<HTMLDivElement>(null);
  const container6Ref = useRef<HTMLDivElement>(null);
  const container7Ref = useRef<HTMLDivElement>(null);
  const container8Ref = useRef<HTMLDivElement>(null);
  const container9Ref = useRef<HTMLDivElement>(null);
  const container10Ref = useRef<HTMLDivElement>(null);
  const container11Ref = useRef<HTMLDivElement>(null);
  const container12Ref = useRef<HTMLDivElement>(null);
  const container13Ref = useRef<HTMLDivElement>(null);
  const container14Ref = useRef<HTMLDivElement>(null);
  const container15Ref = useRef<HTMLDivElement>(null);
  const container16Ref = useRef<HTMLDivElement>(null);
  const container17Ref = useRef<HTMLDivElement>(null);
  const container18Ref = useRef<HTMLDivElement>(null);
  const container19Ref = useRef<HTMLDivElement>(null);
  const container20Ref = useRef<HTMLDivElement>(null);
  const container21Ref = useRef<HTMLDivElement>(null);
  const container22Ref = useRef<HTMLDivElement>(null);
  const container23Ref = useRef<HTMLDivElement>(null);
  const container24Ref = useRef<HTMLDivElement>(null);
  const container25Ref = useRef<HTMLDivElement>(null);
  const container26Ref = useRef<HTMLDivElement>(null);
  const container27Ref = useRef<HTMLDivElement>(null);
  const container28Ref = useRef<HTMLDivElement>(null);
  const container29Ref = useRef<HTMLDivElement>(null);
  const container30Ref = useRef<HTMLDivElement>(null);
  const container31Ref = useRef<HTMLDivElement>(null);
  const container32Ref = useRef<HTMLDivElement>(null);
  const container33Ref = useRef<HTMLDivElement>(null);
  const container34Ref = useRef<HTMLDivElement>(null);
  const container35Ref = useRef<HTMLDivElement>(null);
  const container36Ref = useRef<HTMLDivElement>(null);
  const container37Ref = useRef<HTMLDivElement>(null);
  const container38Ref = useRef<HTMLDivElement>(null);
  const container39Ref = useRef<HTMLDivElement>(null);
  const container40Ref = useRef<HTMLDivElement>(null);
  const container41Ref = useRef<HTMLDivElement>(null);
  const container42Ref = useRef<HTMLDivElement>(null);
  const container43Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containers = [
      container1Ref.current as HTMLDivElement,
      container2Ref.current as HTMLDivElement,
      container3Ref.current as HTMLDivElement,
      container4Ref.current as HTMLDivElement,
      container5Ref.current as HTMLDivElement,
      container6Ref.current as HTMLDivElement,
      container7Ref.current as HTMLDivElement,
      container8Ref.current as HTMLDivElement,
      container9Ref.current as HTMLDivElement,
      container10Ref.current as HTMLDivElement,
      container11Ref.current as HTMLDivElement,
      container12Ref.current as HTMLDivElement,
      container13Ref.current as HTMLDivElement,
      container14Ref.current as HTMLDivElement,
      container15Ref.current as HTMLDivElement,
      container16Ref.current as HTMLDivElement,
      container17Ref.current as HTMLDivElement,
      container18Ref.current as HTMLDivElement,
      container19Ref.current as HTMLDivElement,
      container20Ref.current as HTMLDivElement,
      container21Ref.current as HTMLDivElement,
      container22Ref.current as HTMLDivElement,
      container23Ref.current as HTMLDivElement,
      container24Ref.current as HTMLDivElement,
      container25Ref.current as HTMLDivElement,
      container26Ref.current as HTMLDivElement,
      container27Ref.current as HTMLDivElement,
      container28Ref.current as HTMLDivElement,
      container29Ref.current as HTMLDivElement,
      container30Ref.current as HTMLDivElement,
      container31Ref.current as HTMLDivElement,
      container32Ref.current as HTMLDivElement,
      container33Ref.current as HTMLDivElement,
      container34Ref.current as HTMLDivElement,
      container35Ref.current as HTMLDivElement,
      container36Ref.current as HTMLDivElement,
      container37Ref.current as HTMLDivElement,
      container38Ref.current as HTMLDivElement,
      container39Ref.current as HTMLDivElement,
      container40Ref.current as HTMLDivElement,
      container41Ref.current as HTMLDivElement,
      container42Ref.current as HTMLDivElement,
      container43Ref.current as HTMLDivElement,
    ].filter((container) => container !== null);

    const drake: Drake = dragula(containers);
    return () => {
      drake.destroy();
    };
  }, []);

  const [tags, setTags] = useState<string[]>([
    "Jerald",
    "Andrew",
    "Philip",
    "Davis",
  ]);
  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };
  const [tags1, setTags1] = useState<string[]>(["Collab", "Rated"]);
  const handleTagsChange1 = (newTags: string[]) => {
    setTags1(newTags);
  };
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Task Board</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Projects</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Task Board
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              <div className="dropdown me-2">
                <Link
                  to="#"
                  className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-file-export me-2" /> Export
                </Link>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <Link to="#" className="dropdown-item rounded-1">
                      <i className="ti ti-file-type-pdf me-1" />
                      Export as PDF
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="dropdown-item rounded-1">
                      <i className="ti ti-file-type-xls me-1" />
                      Export as Excel{" "}
                    </Link>
                  </li>
                </ul>
              </div>
              <Link
                to="#"
                className="btn btn-primary d-inline-flex align-items-center"
                data-bs-toggle="modal"
                data-inert={true}
                data-bs-target="#add_board"
              >
                <i className="ti ti-circle-plus me-1" />
                Add Board
              </Link>
              <div className="head-icons ms-2 mb-0">
                <CollapseHeader />
              </div>
            </div>
          </div>
        
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

      {/* Add Task */}
      <div className="modal fade" id="add_task">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add New Task</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Due Date</label>
                      <div className="input-icon-end position-relative">
                        <DatePicker
                          className="form-control datetimepicker"
                          format={{
                            format: "DD-MM-YYYY",
                            type: "mask",
                          }}
                          getPopupContainer={getModalContainer}
                          placeholder="DD-MM-YYYY"
                        />
                        <span className="input-icon-addon">
                          <i className="ti ti-calendar text-gray-7" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Project</label>
                      <CommonSelect
                        className="select"
                        options={projectChoose}
                        defaultValue={projectChoose[1]}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label me-2">Team Members</label>
                      <TagInput
                        initialTags={tags}
                        onTagsChange={handleTagsChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Tag</label>
                      <TagInput
                        initialTags={tags1}
                        onTagsChange={handleTagsChange1}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <CommonSelect
                        className="select"
                        options={statusChoose}
                        defaultValue={statusChoose[1]}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Priority</label>
                      <CommonSelect
                        className="select"
                        options={priorityChoose}
                        defaultValue={priorityChoose[1]}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Who Can See this Task?</label>
                    <div className="d-flex align-items-center mb-3">
                      <div className="form-check me-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                        />
                        <label
                          className="form-check-label text-dark"
                          htmlFor="flexRadioDefault1"
                        >
                          Public
                        </label>
                      </div>
                      <div className="form-check me-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault2"
                          defaultChecked
                        />
                        <label
                          className="form-check-label text-dark"
                          htmlFor="flexRadioDefault2"
                        >
                          Private
                        </label>
                      </div>
                      <div className="form-check ">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault3"
                          defaultChecked
                        />
                        <label
                          className="form-check-label text-dark"
                          htmlFor="flexRadioDefault3"
                        >
                          Admin Only
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Descriptions</label>
                      <CommonTextEditor />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Upload Attachment</label>
                    <div className="bg-light rounded p-2">
                      <div className="profile-uploader border-bottom mb-2 pb-2">
                        <div className="drag-upload-btn btn btn-sm btn-white border px-3">
                          Select File
                          <input
                            type="file"
                            className="form-control image-sign"
                            multiple
                          />
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between border-bottom mb-2 pb-2">
                        <div className="d-flex align-items-center">
                          <h6 className="fs-12 fw-medium me-1">Logo.zip</h6>
                          <span className="badge badge-soft-info">21MB </span>
                        </div>
                        <Link to="#" className="btn btn-sm btn-icon">
                          <i className="ti ti-trash" />
                        </Link>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <h6 className="fs-12 fw-medium me-1">Files.zip</h6>
                          <span className="badge badge-soft-info">25MB </span>
                        </div>
                        <Link to="#" className="btn btn-sm btn-icon">
                          <i className="ti ti-trash" />
                        </Link>
                      </div>
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
                  Add New Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Task */}
      {/* Edit Task */}
      <div className="modal fade" id="edit_task">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Task</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Due Date</label>
                      <div className="input-icon-end position-relative">
                        <DatePicker
                          className="form-control datetimepicker"
                          format={{
                            format: "DD-MM-YYYY",
                            type: "mask",
                          }}
                          getPopupContainer={getModalContainer}
                          placeholder="DD-MM-YYYY"
                        />
                        <span className="input-icon-addon">
                          <i className="ti ti-calendar text-gray-7" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Project</label>
                      <CommonSelect
                        className="select"
                        options={projectChoose}
                        defaultValue={projectChoose[1]}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label me-2">Team Members</label>
                      <TagInput
                        initialTags={tags}
                        onTagsChange={handleTagsChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Tag</label>
                      <TagInput
                        initialTags={tags1}
                        onTagsChange={handleTagsChange1}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <CommonSelect
                        className="select"
                        options={statusChoose}
                        defaultValue={statusChoose[1]}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Priority</label>
                      <CommonSelect
                        className="select"
                        options={priorityChoose}
                        defaultValue={priorityChoose[1]}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Who Can See this Task?</label>
                    <div className="d-flex align-items-center mb-3">
                      <div className="form-check me-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                        />
                        <label
                          className="form-check-label text-dark"
                          htmlFor="flexRadioDefault1"
                        >
                          Public
                        </label>
                      </div>
                      <div className="form-check me-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault2"
                          defaultChecked
                        />
                        <label
                          className="form-check-label text-dark"
                          htmlFor="flexRadioDefault2"
                        >
                          Private
                        </label>
                      </div>
                      <div className="form-check ">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault3"
                          defaultChecked
                        />
                        <label
                          className="form-check-label text-dark"
                          htmlFor="flexRadioDefault3"
                        >
                          Admin Only
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Descriptions</label>
                      <CommonTextEditor />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Upload Attachment</label>
                    <div className="bg-light rounded p-2">
                      <div className="profile-uploader border-bottom mb-2 pb-2">
                        <div className="drag-upload-btn btn btn-sm btn-white border px-3">
                          Select File
                          <input
                            type="file"
                            className="form-control image-sign"
                            multiple
                          />
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between border-bottom mb-2 pb-2">
                        <div className="d-flex align-items-center">
                          <h6 className="fs-12 fw-medium me-1">Logo.zip</h6>
                          <span className="badge badge-soft-info">21MB </span>
                        </div>
                        <Link to="#" className="btn btn-sm btn-icon">
                          <i className="ti ti-trash" />
                        </Link>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <h6 className="fs-12 fw-medium me-1">Files.zip</h6>
                          <span className="badge badge-soft-info">25MB </span>
                        </div>
                        <Link to="#" className="btn btn-sm btn-icon">
                          <i className="ti ti-trash" />
                        </Link>
                      </div>
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Edit Task */}
      {/* Todo Details */}
      <div className="modal fade" id="view_todo">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-dark">
              <h4 className="modal-title text-white">
                Respond to any pending messages
              </h4>
              <span className="badge badge-danger d-inline-flex align-items-center">
                <i className="ti ti-square me-1" />
                Urgent
              </span>
              <span>
                <i className="ti ti-star-filled text-warning" />
              </span>
              <Link to="#">
                <i className="ti ti-trash text-white" />
              </Link>
              <button
                type="button"
                className="btn-close custom-btn-close bg-transparent fs-16 text-white position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <h5 className="mb-2">Task Details</h5>
              <div className="border rounded mb-3 p-2">
                <div className="row row-gap-3">
                  <div className="col-md-4">
                    <div className="text-center">
                      <span className="d-block mb-1">Created On</span>
                      <p className="text-dark">22 July 2025</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center">
                      <span className="d-block mb-1">Due Date</span>
                      <p className="text-dark">22 July 2025</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center">
                      <span className="d-block mb-1">Status</span>
                      <span className="badge badge-soft-success d-inline-flex align-items-center">
                        <i className="fas fa-circle fs-6 me-1" />
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <h5 className="mb-2">Description</h5>
                <p>
                  Hiking is a long, vigorous walk, usually on trails or
                  footpaths in the countryside. Walking for pleasure developed
                  in Europe during the eighteenth century. Religious pilgrimages
                  have existed much longer but they involve walking long
                  distances for a spiritual purpose associated with specific
                  religions and also we achieve inner peace while we hike at a
                  local park.
                </p>
              </div>
              <div className="mb-3">
                <h5 className="mb-2">Tags</h5>
                <div className="d-flex align-items-center">
                  <span className="badge badge-danger me-2">Internal</span>
                  <span className="badge badge-success me-2">Projects</span>
                  <span className="badge badge-secondary">Reminder</span>
                </div>
              </div>
              <div>
                <h5 className="mb-2">Assignee</h5>
                <div className="avatar-list-stacked avatar-group-sm">
                  <span className="avatar avatar-rounded">
                    <ImageWithBasePath
                      className="border border-white"
                      src="assets/img/profiles/avatar-23.jpg"
                      alt="Jerald"
                    />
                  </span>
                  <span className="avatar avatar-rounded">
                    <ImageWithBasePath
                      className="border border-white"
                      src="assets/img/profiles/avatar-24.jpg"
                      alt="Andrew"
                    />
                  </span>
                  <span className="avatar avatar-rounded">
                    <ImageWithBasePath
                      className="border border-white"
                      src="assets/img/profiles/avatar-25.jpg"
                      alt="Philip"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Todo Details */}

      {/* Add Board */}
      <div className="modal fade" id="add_board">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add New Board</h4>
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
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Board Name</label>
                  <input type="text" className="form-control" />
                </div>
                <label className="form-label">Board Color</label>
                <div className="d-flex align-items-center flex-wrap row-gap-3">
                  <div className="theme-colors mb-4">
                    <ul className="d-flex align-items-center">
                      <li>
                        <span className="themecolorset">
                          <span className="primecolor bg-primary">
                            <span className="colorcheck text-white">
                              <i className="ti ti-check text-primary fs-10" />
                            </span>
                          </span>
                        </span>
                      </li>
                      <li>
                        <span className="themecolorset">
                          <span className="primecolor bg-secondary">
                            <span className="colorcheck text-white">
                              <i className="ti ti-check text-primary fs-10" />
                            </span>
                          </span>
                        </span>
                      </li>
                      <li>
                        <span className="themecolorset">
                          <span className="primecolor bg-info">
                            <span className="colorcheck text-white">
                              <i className="ti ti-check text-primary fs-10" />
                            </span>
                          </span>
                        </span>
                      </li>
                      <li>
                        <span className="themecolorset">
                          <span className="primecolor bg-purple">
                            <span className="colorcheck text-white">
                              <i className="ti ti-check text-primary fs-10" />
                            </span>
                          </span>
                        </span>
                      </li>
                      <li>
                        <span className="themecolorset">
                          <span className="primecolor bg-pink">
                            <span className="colorcheck text-white">
                              <i className="ti ti-check text-primary fs-10" />
                            </span>
                          </span>
                        </span>
                      </li>
                      <li>
                        <span className="themecolorset">
                          <span className="primecolor bg-warning">
                            <span className="colorcheck text-white">
                              <i className="ti ti-check text-primary fs-10" />
                            </span>
                          </span>
                        </span>
                      </li>
                      <li>
                        <span className="themecolorset active">
                          <span className="primecolor bg-danger">
                            <span className="colorcheck text-white">
                              <i className="ti ti-check text-primary fs-10" />
                            </span>
                          </span>
                        </span>
                      </li>
                    </ul>
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
                <button type="submit" className="btn btn-primary">
                  Add New Board
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Board */}
    </>
  );
};

export default TaskBoard;
