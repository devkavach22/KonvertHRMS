import { all_routes } from '../../../router/all_routes'
import { Link } from 'react-router-dom'
import Table from "../../../core/common/dataTable/index";
import PredefinedDateRanges from '../../../core/common/datePicker';
import { activityDetails } from '../../../core/data/json/activityDetails';
import CrmsModal from '../../../core/modals/crms_modal';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';

// Define interfaces
interface ActivityItem {
    title: string;
    activity_type: string;
    due_date: string;
    owner: string;
    created_date: string;
    [key: string]: any; // Remove if not needed
}

interface ColumnType<T> {
    title: string;
    dataIndex: keyof T | string;
    render?: (text: any, record?: T) => React.ReactNode;
    sorter?: (a: T, b: T) => number;
}

const Activity = () => {

    const data: ActivityItem[] = activityDetails;
    const columns: ColumnType<ActivityItem>[] = [
        {
            title: "Title",
            dataIndex: "title",
            render: (text: string) => (
                <p className="fs-14 text-dark fw-medium">{text}</p>
            ),
            sorter: (a, b) => a.title.length - b.title.length,
        },
        {
            title: "Activity Type",
            dataIndex: "activity_type",
            render: (text: string) => (
                <span className={`badge ${text === 'Meeting' ? 'badge-pink-transparent' : text === 'Calls' ? 'badge-purple-transparent' : text === 'Tasks' ? 'badge-info-transparent' : 'badge-warning-transparent'}`}>
                    <i className={`ti me-1 ${text === 'Meeting' ? 'ti-device-computer-camera' : text === 'Calls' ? 'ti-phone' : text === 'Tasks' ? 'ti-subtask' : 'ti-mail'}`} />
                    {text}
                </span>
            ),
            sorter: (a, b) => a.activity_type.length - b.activity_type.length,
        },
        {
            title: "Due Date",
            dataIndex: "due_date",
            sorter: (a, b) => a.due_date.length - b.due_date.length,
        },
        {
            title: "Owner",
            dataIndex: "owner",
            sorter: (a, b) => a.owner.length - b.owner.length,
        },
        {
            title: "Created Date",
            dataIndex: "created_date",
            sorter: (a, b) => a.created_date.length - b.created_date.length,
        },
        {
            title: "",
            dataIndex: "actions",
            render: () => (
                <div className="action-icon d-inline-flex">
                    <Link
                        to="#"
                        className="me-2"
                        data-bs-toggle="modal" data-inert={true}
                        data-bs-target="#edit_activity"
                    >
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
            <CrmsModal/>
        </>
       

    )
}

export default Activity
