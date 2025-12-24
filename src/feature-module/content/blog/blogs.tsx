import { useState } from "react";
import { Link } from "react-router-dom";
import CommonSelect from "../../../core/common/commonSelect";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../../router/all_routes";
import PredefinedDateRanges from "../../../core/common/datePicker";

import CollapseHeader from "../../../core/common/collapse-header/collapse-header";
import TagInput from "../../../core/common/Taginput";

const Blogs = () => {
  const [tags, setTags] = useState<string[]>(["HRMS", "Recruitment", "HRTech"]);
  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const categoryChoose = [
    { value: "Select", label: "Select" },
    { value: "Evlovution", label: "Evlovution" },
    { value: "Guide", label: "Guide" },
    { value: "Security", label: "Security" },
  ];
  const status = [
    { value: "Select", label: "Select" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
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
        {/* Add Blog */}
        <div className="modal fade" id="add_blog">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Blog</h4>
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
                      <div className="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4">
                        <div className="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-dashed me-2 flex-shrink-0 text-dark frames">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-30.jpg"
                            alt="Featured image"
                            className="rounded-circle"
                          />
                        </div>
                        <div className="profile-upload">
                          <div className="mb-2">
                            <h6 className="mb-1">Featured Image</h6>
                            <p className="fs-12">Image should be below 4 mb</p>
                          </div>
                          <div className="profile-uploader d-flex align-items-center">
                            <div className="drag-upload-btn btn btn-sm btn-primary me-2">
                              Upload
                              <input
                                type="file"
                                className="form-control image-sign"
                                multiple
                              />
                            </div>
                            <Link to="#" className="btn btn-light btn-sm">
                              Cancel
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Blog Title <span className="text-danger"> *</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3 ">
                        <label className="form-label">
                          Category <span className="text-danger"> *</span>
                        </label>
                        <CommonSelect
                          className="select"
                          options={categoryChoose}
                          defaultValue={categoryChoose[0]}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3 ">
                        <label className="form-label">
                          Tags <span className="text-danger"> *</span>
                        </label>
                        <TagInput
                          initialTags={tags}
                          onTagsChange={handleTagsChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3 ">
                        <label className="form-label">Status</label>
                        <CommonSelect
                          className="select"
                          options={status}
                          defaultValue={status[0]}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <div className="summernote">
                          <p className="text-gray fw-normal">
                            Write a new comment, send your team notification by
                            typing @ followed by their name
                          </p>
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
                    Add Blog
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Blog */}
      </>

      <>
        {/* Edit Blog */}
        <div className="modal fade" id="edit_blog">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Blog</h4>
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
                      <div className="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4">
                        <div className="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-dashed me-2 flex-shrink-0 text-dark frames">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-30.jpg"
                            alt="Featured image"
                            className="rounded-circle"
                          />
                        </div>
                        <div className="profile-upload">
                          <div className="mb-2">
                            <h6 className="mb-1">Featured Image</h6>
                            <p className="fs-12">Image should be below 4 mb</p>
                          </div>
                          <div className="profile-uploader d-flex align-items-center">
                            <div className="drag-upload-btn btn btn-sm btn-primary me-2">
                              Upload
                              <input
                                type="file"
                                className="form-control image-sign"
                                multiple
                              />
                            </div>
                            <Link to="#" className="btn btn-light btn-sm">
                              Cancel
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Blog Title <span className="text-danger"> *</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3 ">
                        <label className="form-label">
                          Category <span className="text-danger"> *</span>
                        </label>
                        <CommonSelect
                          className="select"
                          options={categoryChoose}
                          defaultValue={categoryChoose[1]}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3 ">
                        <label className="form-label">
                          Tags <span className="text-danger"> *</span>
                        </label>
                        <TagInput
                          initialTags={tags}
                          onTagsChange={handleTagsChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3 ">
                        <label className="form-label">Status</label>
                        <CommonSelect
                          className="select"
                          options={status}
                          defaultValue={status[1]}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <div className="summernote">
                          <p className="text-gray fw-normal">
                            Write a new comment, send your team notification by
                            typing @ followed by their name
                          </p>
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
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Edit Blog */}
      </>
    </>
  );
};

export default Blogs;
