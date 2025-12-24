import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../core/common/datePicker";
import { faq_data } from "../../core/data/json/faq_data";
import Table from "../../core/common/dataTable/index";
import { all_routes } from "../../router/all_routes";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";

type FaqRow = {
  key: string;
  questions: string;
  answers: string;
  category: string;
};

const Faq = () => {
  const data = faq_data;
  const columns = [
    {
      title: "Questions",
      dataIndex: "questions",
      key: "questions",
      render: (text: FaqRow["questions"]) => (
        <h6 className="fw-medium">
          <Link to="#">{text}</Link>
        </h6>
      ),
      sorter: (a: FaqRow, b: FaqRow) => a.questions.length - b.questions.length,
    },
    {
      title: "Answers",
      dataIndex: "answers",
      key: "answers",
      sorter: (a: FaqRow, b: FaqRow) => a.answers.length - b.answers.length,
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
            data-bs-target="#edit_faq"
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
      {/* Add Faq */}
      <div className="modal fade" id="add_faq">
        <div className="modal-dialog modal-dialog-centered modal-mg w-100">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Faq</h4>
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
                      <label className="form-label">Category</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Questions</label>
                      <textarea
                        rows={3}
                        className="form-control"
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Answer</label>
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
                  Add Faq
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Faq */}
      {/* Edit Faq */}
      <div className="modal fade" id="edit_faq">
        <div className="modal-dialog modal-dialog-centered modal-mg w-100">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit FAQ</h4>
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
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="General"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Questions</label>
                      <textarea
                        rows={3}
                        className="form-control"
                        defaultValue={"What is an HRMS?"}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Answer</label>
                      <textarea
                        rows={3}
                        className="form-control"
                        defaultValue={
                          "Software system that automates and manages various human resources tasks"
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
                  Save Faq
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Edit Faq */}
    </>
  );
};

export default Faq;
