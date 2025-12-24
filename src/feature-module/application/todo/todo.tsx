import  { useState } from "react";
import { Link } from "react-router-dom";
import TodoModal from "../../../core/modals/todoModal";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";



const Todo = () => {

  const [, setIsTodo] = useState([false, false, false]);
  const toggleTodo = (index: number) => {
    setIsTodo((prevIsTodo) => {
      const newIsTodo = [...prevIsTodo];
      newIsTodo[index] = !newIsTodo[index];
      return newIsTodo;
    });
  };

  return (
    <>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Breadcrumb */}
            <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
              <div className="my-auto mb-2">
                <h2 className="mb-1">Todo</h2>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={all_routes.adminDashboard}>
                        <i className="ti ti-smart-home" />
                      </Link>
                    </li>
                    <li className="breadcrumb-item">Application</li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Todo
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
                <div className="d-flex align-items-center border rounded p-1 me-2">
                  <Link to={all_routes.TodoList} className="btn btn-icon btn-sm">
                    <i className="ti ti-list-tree" />
                  </Link>
                  <Link
                    to={all_routes.todo}
                    className="btn btn-icon btn-sm active bg-primary text-white"
                  >
                    <i className="ti ti-table" />
                  </Link>
                </div>
                <div className="">
                  <div className="input-icon-start position-relative">
                    <span className="input-icon-addon">
                      <i className="ti ti-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Todo List"
                    />
                  </div>
                </div>
                <div className="ms-2 mb-0 head-icons">
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
      </>

      <TodoModal />
    </>
  );
};

export default Todo;
