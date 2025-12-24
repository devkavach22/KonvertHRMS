import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NotesModal from "./notesModal";
import { all_routes } from "../../router/all_routes";
import CommonSelect from "../../core/common/commonSelect";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";
import ImageWithBasePath from "../../core/common/imageWithBasePath";

const Notes = () => {
  const routes = all_routes;

  const optionsChoose = [
    { value: "Bulk Actions", label: "Bulk Actions" },
    { value: "Delete Marked", label: "Delete Marked" },
    { value: "Unmark All", label: "Unmark All" },
    { value: "Mark All", label: "Mark All" },
  ];
  const recentChoose = [
    { value: "Recent", label: "Recent" },
    { value: "Last Modified", label: "Last Modified" },
    { value: "Last Modified by me", label: "Last Modified by me" }
  ];

  const settings = {
    dots: false,
    autoplay: false,
    slidesToShow: 3,
    margin: 24,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };
  return (
    <>
      <>
        {/* Page wrapper */}
        <div className="page-wrapper">
          <div className="content pb-4">
            {/* Breadcrumb */}
            <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
              <div className="my-auto mb-2">
                <h2 className="mb-1">Notes</h2>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>
                        <i className="ti ti-smart-home" />
                      </Link>
                    </li>
                    <li className="breadcrumb-item">Application</li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Notes
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
                <div className="me-2 mb-2">
                  <div className="dropdown">
                    <Link
                      to="#"
                      className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-file-export me-2" />
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
                    className="btn btn-primary d-flex align-items-center"
                    data-bs-toggle="modal" data-inert={true}
                    data-bs-target="#add_note"
                  >
                    <i className="ti ti-circle-plus me-2" />
                    Add Notes
                  </Link>
                </div>
                <div className="ms-2 head-icons">
                  <CollapseHeader />
                </div>
              </div>
            </div>
            <div className="row">
            
              <div className="col-xl-9 budget-role-notes">
               
                <div className="tab-content" id="v-pills-tabContent2">
                  <div
                    className="tab-pane fade active show"
                    id="v-pills-profile"
                    role="tabpanel"
                    aria-labelledby="v-pills-profile-tab"
                  >
                   
                   
                  </div>
                  <div
                    className="tab-pane fade"
                    id="v-pills-messages"
                    role="tabpanel"
                    aria-labelledby="v-pills-messages-tab"
                  >
                    <div className="row">
                      <div className="col-md-4 d-flex">
                        <div className="card rounded-3 mb-4 flex-fill">
                          <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="badge bg-outline-success d-inline-flex align-items-center">
                                <i className="fas fa-circle fs-6 me-1" />
                                High
                              </span>
                              <div>
                                <Link
                                  to="#"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </Link>
                                <div className="dropdown-menu notes-menu dropdown-menu-end">
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#edit-note-units"
                                  >
                                    <span>
                                      <i data-feather="edit" />
                                    </span>
                                    Edit
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#delete_modal"
                                  >
                                    <span>
                                      <i data-feather="trash-2" />
                                    </span>
                                    Delete
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                  >
                                    <span>
                                      <i data-feather="star" />
                                    </span>
                                    Not Important
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#view-note-units"
                                  >
                                    <span>
                                      <i data-feather="eye" />
                                    </span>
                                    View
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="my-3">
                              <h5 className="text-truncate mb-1">
                                <Link to="#">Backup Files EOD</Link>
                              </h5>
                              <p className="mb-3 d-flex align-items-center text-dark">
                                <i className="ti ti-calendar me-1" />
                                20 Jan 2024
                              </p>
                              <p className="text-truncate line-clamb-2 text-wrap">
                                Project files should be took backup before end of the
                                day.
                              </p>
                            </div>
                            <div className="d-flex align-items-center justify-content-between border-top pt-3">
                              <div className="d-flex align-items-center">
                                <Link
                                  to="#"
                                  className="avatar avatar-md me-2"
                                >
                                  <ImageWithBasePath
                                    src="./assets/img/profiles/avatar-05.jpg"
                                    alt="Sophie profile picture"
                                    className="img-fluid rounded-circle"
                                  />
                                </Link>
                                <span className="text-info d-flex align-items-center">
                                  <i className="fas fa-square square-rotate fs-10 me-1" />
                                  Personal
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <Link to="#" className="me-2">
                                  <span>
                                    <i className="fas fa-star text-warning" />
                                  </span>
                                </Link>
                                <Link to="#">
                                  <span>
                                    <i className="ti ti-trash text-danger" />
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 d-flex">
                        <div className="card rounded-3 mb-4 flex-fill">
                          <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="badge bg-outline-danger d-inline-flex align-items-center">
                                <i className="fas fa-circle fs-6 me-1" />
                                Low
                              </span>
                              <div>
                                <Link
                                  to="#"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </Link>
                                <div className="dropdown-menu notes-menu dropdown-menu-end">
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#edit-note-units"
                                  >
                                    <span>
                                      <i data-feather="edit" />
                                    </span>
                                    Edit
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#delete_modal"
                                  >
                                    <span>
                                      <i data-feather="trash-2" />
                                    </span>
                                    Delete
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                  >
                                    <span>
                                      <i data-feather="star" />
                                    </span>
                                    Not Important
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#view-note-units"
                                  >
                                    <span>
                                      <i data-feather="eye" />
                                    </span>
                                    View
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="my-3">
                              <h5 className="text-truncate mb-1">
                                <Link to="#">Download Server Logs</Link>
                              </h5>
                              <p className="mb-3 d-flex align-items-center text-dark">
                                <i className="ti ti-calendar me-1" />
                                25 Jan 2024
                              </p>
                              <p className="text-truncate line-clamb-2 text-wrap">
                                Server log is a text document that contains a record
                                of all activity.
                              </p>
                            </div>
                            <div className="d-flex align-items-center justify-content-between border-top pt-3">
                              <div className="d-flex align-items-center">
                                <Link
                                  to="#"
                                  className="avatar avatar-md me-2"
                                >
                                  <ImageWithBasePath
                                    src="./assets/img/profiles/avatar-06.jpg"
                                    alt="Cameron profile picture"
                                    className="img-fluid rounded-circle"
                                  />
                                </Link>
                                <span className="text-success d-flex align-items-center">
                                  <i className="fas fa-square square-rotate fs-10 me-1" />
                                  Work
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <Link to="#" className="me-2">
                                  <span>
                                    <i className="fas fa-star text-warning" />
                                  </span>
                                </Link>
                                <Link to="#">
                                  <span>
                                    <i className="ti ti-trash text-danger" />
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 d-flex">
                        <div className="card rounded-3 mb-4 flex-fill">
                          <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="badge bg-outline-warning d-inline-flex align-items-center">
                                <i className="fas fa-circle fs-6 me-1" />
                                Medium
                              </span>
                              <div>
                                <Link
                                  to="#"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </Link>
                                <div className="dropdown-menu notes-menu dropdown-menu-end">
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#edit-note-units"
                                  >
                                    <span>
                                      <i data-feather="edit" />
                                    </span>
                                    Edit
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#delete_modal"
                                  >
                                    <span>
                                      <i data-feather="trash-2" />
                                    </span>
                                    Delete
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                  >
                                    <span>
                                      <i data-feather="star" />
                                    </span>
                                    Not Important
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#view-note-units"
                                  >
                                    <span>
                                      <i data-feather="eye" />
                                    </span>
                                    View
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="my-3">
                              <h5 className="text-truncate mb-1">
                                <Link to="#">
                                  Plan a trip to another country
                                </Link>
                              </h5>
                              <p className="mb-3 d-flex align-items-center text-dark">
                                <i className="ti ti-calendar me-1" />
                                25 Jan 2024
                              </p>
                              <p className="text-truncate line-clamb-2 text-wrap">
                                Space, the final frontier. These are the voyages
                                of the Starship Enterprise.
                              </p>
                            </div>
                            <div className="d-flex align-items-center justify-content-between border-top pt-3">
                              <div className="d-flex align-items-center">
                                <Link
                                  to="#"
                                  className="avatar avatar-md me-2"
                                >
                                  <ImageWithBasePath
                                    src="./assets/img/profiles/avatar-01.jpg"
                                    alt="Anthony Lewis profile picture"
                                    className="img-fluid rounded-circle"
                                  />
                                </Link>
                                <span className="text-info d-flex align-items-center">
                                  <i className="fas fa-square square-rotate fs-10 me-1" />
                                  Personal
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <Link to="#" className="me-2">
                                  <span>
                                    <i className="fas fa-star text-warning" />
                                  </span>
                                </Link>
                                <Link to="#">
                                  <span>
                                    <i className="ti ti-trash text-danger" />
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 d-flex">
                        <div className="card rounded-3 mb-4 flex-fill">
                          <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="badge bg-outline-danger d-inline-flex align-items-center">
                                <i className="fas fa-circle fs-6 me-1" />
                                Low
                              </span>
                              <div>
                                <Link
                                  to="#"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </Link>
                                <div className="dropdown-menu notes-menu dropdown-menu-end">
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#edit-note-units"
                                  >
                                    <span>
                                      <i data-feather="edit" />
                                    </span>
                                    Edit
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#delete_modal"
                                  >
                                    <span>
                                      <i data-feather="trash-2" />
                                    </span>
                                    Delete
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                  >
                                    <span>
                                      <i data-feather="star" />
                                    </span>
                                    Not Important
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#view-note-units"
                                  >
                                    <span>
                                      <i data-feather="eye" />
                                    </span>
                                    View
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="my-3">
                              <h5 className="text-truncate mb-1">
                                <Link to="#">
                                  Improve touch typing
                                </Link>
                              </h5>
                              <p className="mb-3 d-flex align-items-center text-dark">
                                <i className="ti ti-calendar me-1" />
                                26 Jan 2024
                              </p>
                              <p className="text-truncate line-clamb-2 text-wrap">
                                Well, the way they make shows is, they make one
                                show.
                              </p>
                            </div>
                            <div className="d-flex align-items-center justify-content-between border-top pt-3">
                              <div className="d-flex align-items-center">
                                <Link
                                  to="#"
                                  className="avatar avatar-md me-2"
                                >
                                  <ImageWithBasePath
                                    src="./assets/img/profiles/avatar-02.jpg"
                                    alt="Linda Ray profile picture"
                                    className="img-fluid rounded-circle"
                                  />
                                </Link>
                                <span className="text-success d-flex align-items-center">
                                  <i className="fas fa-square square-rotate fs-10 me-1" />
                                  Work
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <Link to="#" className="me-2">
                                  <span>
                                    <i className="fas fa-star text-warning" />
                                  </span>
                                </Link>
                                <Link to="#">
                                  <span>
                                    <i className="ti ti-trash text-danger" />
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="v-pills-settings"
                    role="tabpanel"
                    aria-labelledby="v-pills-settings-tab"
                  >
                    <div className="row">
                      <div className="col-12 d-flex align-items-center justify-content-end">
                        <Link to="#" className="btn btn-danger mb-4">
                          <span>
                            {" "}
                            <i className="ti ti-trash f-20 me-2" />{" "}
                          </span>
                          Restore all
                        </Link>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4 d-flex">
                        <div className="card rounded-3 mb-4 flex-fill">
                          <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="badge bg-outline-success d-inline-flex align-items-center">
                                <i className="fas fa-circle fs-6 me-1" />
                                High
                              </span>
                              <div>
                                <Link
                                  to="#"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </Link>
                                <div className="dropdown-menu notes-menu dropdown-menu-end">
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#edit-note-units"
                                  >
                                    <span>
                                      <i data-feather="edit" />
                                    </span>
                                    Edit
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#delete_modal"
                                  >
                                    <span>
                                      <i data-feather="trash-2" />
                                    </span>
                                    Delete
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                  >
                                    <span>
                                      <i data-feather="star" />
                                    </span>
                                    Not Important
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#view-note-units"
                                  >
                                    <span>
                                      <i data-feather="eye" />
                                    </span>
                                    View
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="my-3">
                              <h5 className="text-truncate mb-1">
                                <Link to="#">
                                  Create a compost pile
                                </Link>
                              </h5>
                              <p className="mb-3 d-flex align-items-center text-dark">
                                <i className="ti ti-calendar me-1" />
                                27 Jan 2024
                              </p>
                              <p className="text-truncate line-clamb-2 text-wrap">
                                Compost pile refers to fruit and vegetable scraps,
                                used tea, coffee grounds etc..
                              </p>
                            </div>
                            <div className="d-flex align-items-center justify-content-between border-top pt-3">
                              <div className="d-flex align-items-center">
                                <Link
                                  to="#"
                                  className="avatar avatar-md me-2"
                                >
                                  <ImageWithBasePath
                                    src="./assets/img/profiles/avatar-08.jpg"
                                    alt="Rufana profile picture"
                                    className="img-fluid rounded-circle"
                                  />
                                </Link>
                                <span className="text-warning d-flex align-items-center">
                                  <i className="fas fa-square square-rotate fs-10 me-1" />
                                  Social
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <Link to="#" className="me-2">
                                  <span>
                                    <i className="fas fa-star text-warning" />
                                  </span>
                                </Link>
                                <Link to="#">
                                  <span>
                                    <i className="ti ti-trash text-danger" />
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 d-flex">
                        <div className="card rounded-3 mb-4 flex-fill">
                          <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="badge bg-outline-danger d-inline-flex align-items-center">
                                <i className="fas fa-circle fs-6 me-1" />
                                Low
                              </span>
                              <div>
                                <Link
                                  to="#"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </Link>
                                <div className="dropdown-menu notes-menu dropdown-menu-end">
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#edit-note-units"
                                  >
                                    <span>
                                      <i data-feather="edit" />
                                    </span>
                                    Edit
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#delete_modal"
                                  >
                                    <span>
                                      <i data-feather="trash-2" />
                                    </span>
                                    Delete
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                  >
                                    <span>
                                      <i data-feather="star" />
                                    </span>
                                    Not Important
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#view-note-units"
                                  >
                                    <span>
                                      <i data-feather="eye" />
                                    </span>
                                    View
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="my-3">
                              <h5 className="text-truncate mb-1">
                                <Link to="#">
                                  Take a hike at a local park
                                </Link>
                              </h5>
                              <p className="mb-3 d-flex align-items-center text-dark">
                                <i className="ti ti-calendar me-1" />
                                28 Jan 2024
                              </p>
                              <p className="text-truncate line-clamb-2 text-wrap">
                                Hiking involves a long energetic walk in a natural
                                environment.
                              </p>
                            </div>
                            <div className="d-flex align-items-center justify-content-between border-top pt-3">
                              <div className="d-flex align-items-center">
                                <Link
                                  to="#"
                                  className="avatar avatar-md me-2"
                                >
                                  <ImageWithBasePath
                                    src="./assets/img/profiles/avatar-09.jpg"
                                    alt="Michael profile picture"
                                    className="img-fluid rounded-circle"
                                  />
                                </Link>
                                <span className="text-info d-flex align-items-center">
                                  <i className="fas fa-square square-rotate fs-10 me-1" />
                                  Personal
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <Link to="#" className="me-2">
                                  <span>
                                    <i className="fas fa-star text-warning" />
                                  </span>
                                </Link>
                                <Link to="#">
                                  <span>
                                    <i className="ti ti-trash text-danger" />
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 d-flex">
                        <div className="card rounded-3 mb-4 flex-fill">
                          <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="badge bg-outline-info d-inline-flex align-items-center">
                                <i className="fas fa-circle fs-6 me-1" />
                                medium
                              </span>
                              <div>
                                <Link
                                  to="#"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </Link>
                                <div className="dropdown-menu notes-menu dropdown-menu-end">
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#edit-note-units"
                                  >
                                    <span>
                                      <i data-feather="edit" />
                                    </span>
                                    Edit
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#delete_modal"
                                  >
                                    <span>
                                      <i data-feather="trash-2" />
                                    </span>
                                    Delete
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                  >
                                    <span>
                                      <i data-feather="star" />
                                    </span>
                                    Not Important
                                  </Link>
                                  <Link
                                    to="#"
                                    className="dropdown-item"
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#view-note-units"
                                  >
                                    <span>
                                      <i data-feather="eye" />
                                    </span>
                                    View
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="my-3">
                              <h5 className="text-truncate mb-1">
                                <Link to="#">
                                  Research a topic interested
                                </Link>
                              </h5>
                              <p className="mb-3 d-flex align-items-center text-dark">
                                <i className="ti ti-calendar me-1" />
                                28 Jan 2024
                              </p>
                              <p className="text-truncate line-clamb-2 text-wrap">
                                Research a topic interested by listen actively and
                                attentively.
                              </p>
                            </div>
                            <div className="d-flex align-items-center justify-content-between border-top pt-3">
                              <div className="d-flex align-items-center">
                                <Link
                                  to="#"
                                  className="avatar avatar-md me-2"
                                >
                                  <ImageWithBasePath
                                    src="./assets/img/profiles/avatar-10.jpg"
                                    alt="Jackson profile picture"
                                    className="img-fluid rounded-circle"
                                  />
                                </Link>
                                <span className="text-success d-flex align-items-center">
                                  <i className="fas fa-square square-rotate fs-10 me-1" />
                                  Work
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <Link to="#" className="me-2">
                                  <span>
                                    <i className="fas fa-star text-warning" />
                                  </span>
                                </Link>
                                <Link to="#">
                                  <span>
                                    <i className="ti ti-trash text-danger" />
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row custom-pagination">
                 
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
        {/* /Page wrapper */}
      </>

      <NotesModal />
    </>
  );
};

export default Notes;
