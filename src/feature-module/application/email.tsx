import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../core/common/imageWithBasePath";

import { Chips, type ChipsChangeEvent } from "primereact/chips";
const Email = () => {
  const routes = all_routes;
  const [value, setValue] = useState<any>(["Angela Thomas"]);
  const [show, setShow] = useState<boolean>(false);
  const customChip = (item: string) => {
    return (
      <div>
        <span className="tag label label-info">{item}</span>
      </div>
    );
  };
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content p-0">
          <div className="d-md-flex">
            <div className="email-sidebar border-end border-bottom">
              <div className="active slimscroll h-100">
                <div className="slimscroll-active-sidebar">
                 
                </div>
              </div>
            </div>
            <div className="bg-white flex-fill border-end border-bottom mail-notifications">
           
            </div>
          </div>
          <div className="footer d-sm-flex align-items-center justify-content-between bg-white p-3">
            <p className="mb-0">2014 - 2025 © SmartHR.</p>
            <p>
              Designed &amp; Developed By{" "}
              <Link to="#" className="text-primary">
                Dreams
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <div id="compose-view" className={show ? "show" : ""}>
        <div className="bg-white border-0 rounded compose-view">
          <div className="compose-header d-flex align-items-center justify-content-between bg-dark p-3">
            <h5 className="text-white">Compose New Email</h5>
            <div className="d-flex align-items-center">
              <Link to="#" className="d-inline-flex me-2 text-white fs-16">
                <i className="ti ti-minus" />
              </Link>
              <Link to="#" className="d-inline-flex me-2 fs-16 text-white">
                <i className="ti ti-maximize" />
              </Link>
              <button
                type="button"
                className="btn-close custom-btn-close bg-transparent fs-16 text-white position-static"
                id="compose-close"
                onClick={() => setShow(false)}
              >
                <i className="ti ti-x" />
              </button>
            </div>
          </div>
          <form>
            <div className="p-3 position-relative pb-2 border-bottom chip-with-image">
              <div className="tag-with-img d-flex align-items-center">
                <label className="form-label me-2">To</label>
                {/* <input
            className="input-tags form-control border-0 h-100"
            id="inputBox"
            type="text"
            data-role="tagsinput"
            name="Label"
            defaultValue="Angela Thomas"
          /> */}
                <Chips
                  value={value}
                  className="input-tags form-control border-0 h-100 w-100"
                  onChange={(e: ChipsChangeEvent) => setValue(e.value)}
                  itemTemplate={customChip}
                />
              </div>
              <div className="d-flex align-items-center email-cc">
                <Link to="#" className="d-inline-flex me-2">
                  Cc
                </Link>
                <Link to="#" className="d-inline-flex">
                  Bcc
                </Link>
              </div>
            </div>
            <div className="p-3 border-bottom">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Subject"
                />
              </div>
              <div className="mb-0">
                <textarea
                  rows={7}
                  className="form-control"
                  placeholder="Compose Email"
                  defaultValue={""}
                />
              </div>
            </div>
            <div className="p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Link to="#" className="btn btn-icon btn-sm rounded-circle">
                  <i className="ti ti-paperclip" />
                </Link>
                <Link to="#" className="btn btn-icon btn-sm rounded-circle">
                  <i className="ti ti-photo" />
                </Link>
                <Link to="#" className="btn btn-icon btn-sm rounded-circle">
                  <i className="ti ti-link" />
                </Link>
                <Link to="#" className="btn btn-icon btn-sm rounded-circle">
                  <i className="ti ti-pencil" />
                </Link>
                <Link to="#" className="btn btn-icon btn-sm rounded-circle">
                  <i className="ti ti-mood-smile" />
                </Link>
              </div>
              <div className="d-flex align-items-center compose-footer">
                <Link to="#" className="btn btn-icon btn-sm rounded-circle">
                  <i className="ti ti-calendar-repeat" />
                </Link>
                <Link to="#" className="btn btn-icon btn-sm rounded-circle">
                  <i className="ti ti-trash" />
                </Link>
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center ms-2"
                >
                  Send <i className="ti ti-arrow-right ms-2" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default Email;
