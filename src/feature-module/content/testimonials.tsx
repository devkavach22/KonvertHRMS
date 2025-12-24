import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../core/common/datePicker";
import CommonSelect from "../../core/common/commonSelect";
import { testimonials_data } from "../../core/data/json/testimonials_data";
import Table from "../../core/common/dataTable/index";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";

interface Author {
  name: string;
  avatar: string;
}

type TestimonialRow = {
  key: string;
  author: { name: string; avatar: string };
  role: string;
  content: string;
  dateAdded: string;
  id?: string;
};

const Testimonials = () => {
  const role = [
    { value: "Select", label: "Select" },
    { value: "Hr Manager", label: "Hr Manager" },
    { value: "Manager", label: "Manager" },
    { value: "Employee", label: "Employee" },
  ];

  const data = testimonials_data;
  const columns = [
    {
      title: "Author",
      dataIndex: "author",
      sorter: (a: TestimonialRow, b: TestimonialRow) =>
        a.author.name.length - b.author.name.length,
      render: (author: Author) => (
        <div className="d-flex align-items-center file-name-icon">
          <Link to="#" className="avatar avatar-md border avatar-rounded">
            <ImageWithBasePath
              src={author.avatar}
              className="img-fluid"
              alt={`Avatar of ${author.name}`}
            />
          </Link>
          <div className="ms-2">
            <h6 className="fw-medium">
              <Link to="#">{author.name}</Link>
            </h6>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      sorter: (a: TestimonialRow, b: TestimonialRow) =>
        a.role.length - b.role.length,
    },
    {
      title: "Content",
      dataIndex: "content",
      sorter: (a: TestimonialRow, b: TestimonialRow) =>
        a.content.length - b.content.length,
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
            data-bs-target="#edit_testimonials"
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
        {/* Add Testimonial */}
        <div className="modal fade" id="add_testimonials">
          <div className="modal-dialog modal-dialog-centered modal-mg w-100">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Testimonial</h4>
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
                        <label className="form-label">Select Author</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Select Role</label>
                        <CommonSelect
                          className="select"
                          options={role}
                          defaultValue={role[0]}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Content</label>
                        <textarea
                          rows={3}
                          className="form-control"
                          defaultValue={""}
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
                    Add Testimonial
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Testimonial */}
        {/* Edit Testimonial */}
        <div className="modal fade" id="edit_testimonials">
          <div className="modal-dialog modal-dialog-centered modal-mg w-100">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Testimonial</h4>
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
                        <label className="form-label">Select Author</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Ivan Lucas"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Select Role</label>
                        <CommonSelect
                          className="Select"
                          options={role}
                          defaultValue={role[1]}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Content</label>
                        <textarea
                          rows={3}
                          className="form-control"
                          defaultValue={
                            "This system streamlined our HR processes, saving us time and boosting team efficiency."
                          }
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
        {/* /Edit Testimonial */}
      </>
    </>
  );
};

export default Testimonials;
