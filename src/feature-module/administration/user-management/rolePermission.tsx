import { status } from '../../../core/common/selectoption/selectoption'
import CommonSelect from '../../../core/common/commonSelect'
import { all_routes } from '../../../router/all_routes'
import { Link } from 'react-router-dom'
import PredefinedDateRanges from '../../../core/common/datePicker'
import Table from "../../../core/common/dataTable/index";
import { rolesDetails } from '../../../core/data/json/rolesDetails'
import CollapseHeader from '../../../core/common/collapse-header/collapse-header'

// Define interfaces
interface RoleItem {
    role: string;
    created_date: string;
    status: string;
    [key: string]: any; // Remove if not needed
}

interface ColumnType<T> {
    title: string;
    dataIndex: keyof T | string;
    render?: (text: any, record?: T) => React.ReactNode;
    sorter?: (a: T, b: T) => number;
}

const RolesPermission = () => {

    const data: RoleItem[] = rolesDetails;
    const columns: ColumnType<RoleItem>[] = [
        {
            title: "Role",
            dataIndex: "role",
            sorter: (a, b) => a.role.length - b.role.length,
        },
        {
            title: "Created Date",
            dataIndex: "created_date",
            sorter: (a, b) => a.created_date.length - b.created_date.length,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text: string) => (
                <span
                    className={`badge d-inline-flex align-items-center badge-xs ${text === 'Active'
                        ? 'badge-success'
                        : 'badge-danger'
                        }`}
                >
                    <i className="ti ti-point-filled me-1"></i>
                    {text}
                </span>
            ),
            sorter: (a, b) => a.status.length - b.status.length,
        },
        {
            title: "",
            dataIndex: "actions",
            render: () => (
                <div className="action-icon d-inline-flex">
                    <Link to={all_routes.permissionpage} className="me-2">
                        <i className="ti ti-shield" />
                    </Link>
                    <Link
                        to="#"
                        className="me-2"
                        data-bs-toggle="modal" data-inert={true}
                        data-bs-target="#edit_role"
                    >
                        <i className="ti ti-edit" />
                    </Link>
                    <Link to="#" data-bs-toggle="modal" data-inert={true} data-bs-target="#delete_modal">
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
            {/* Add Assets */}
            <div className="modal fade" id="add_role">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Add Role</h4>
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
                                            <label className="form-label">Role Name</label>
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-3 ">
                                            <label className="form-label">Status</label>
                                            <CommonSelect
                                                className='select'
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
                                <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                                    Add Role
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* /Add Assets */}
            {/* Edit Role */}
            <div className="modal fade" id="edit_role">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Role</h4>
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
                                            <label className="form-label">Role Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                defaultValue="Office Furnitures"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-3 ">
                                            <label className="form-label">Status</label>
                                            <CommonSelect
                                                className='select'
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
                                <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* /Edit Role */}
        </>

    )
}

export default RolesPermission
