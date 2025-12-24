import  { useState } from 'react'
import { Link } from 'react-router-dom'
import PredefinedDateRanges from '../../../core/common/datePicker'
import Table from "../../../core/common/dataTable/index";
import { all_routes } from '../../../router/all_routes';
import { userreportDetails } from '../../../core/data/json/userreportDetails';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import ReactApexChart from 'react-apexcharts';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';

// Define interfaces
interface UserReportItem {
    Name: string;
    Email: string;
    CreatedDate: string;
    Role: string;
    Status: string;
    Image: string;
    [key: string]: any; // Remove if not needed
}

interface ColumnType<T> {
    title: string;
    dataIndex: keyof T | string;
    render?: (text: any, record?: T) => React.ReactNode;
    sorter?: (a: T, b: T) => number;
}

const UserReports = () => {

    const data: UserReportItem[] = userreportDetails;
    const columns: ColumnType<UserReportItem>[] = [
        {
            title: "Name",
            dataIndex: "Name",
            render: (text: string, record?: UserReportItem) => (
                <div className="d-flex align-items-center file-name-icon">
                    <Link to="#" className="avatar avatar-md border avatar-rounded">
                        <ImageWithBasePath src={record?.Image || ''} className="img-fluid" alt={record?.Name || "User"} />
                    </Link>
                    <div className="ms-2">
                        <h6 className="fw-medium">
                            <Link to="#">{text}</Link>
                        </h6>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.Name.length - b.Name.length,
        },
        {
            title: "Email",
            dataIndex: "Email",
            sorter: (a, b) => a.Email.length - b.Email.length,
        },
        {
            title: "Created Date",
            dataIndex: "CreatedDate",
            sorter: (a, b) => a.CreatedDate.length - b.CreatedDate.length,
        },
        {
            title: "Role",
            dataIndex: "Role",
            render: (text: string) => (
                <span className={`badge d-inline-flex align-items-center badge-xs ${text === 'Employee' ? 'badge-pink-transparent' : 'badge-soft-purple'}`}>
                    {text}
                </span>
            ),
            sorter: (a, b) => a.Role.length - b.Role.length,
        },
        {
            title: "Status",
            dataIndex: "Status",
            render: (text: string) => (
                <span className={`badge d-inline-flex align-items-center badge-xs ${text === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                    <i className="ti ti-point-filled me-1" />
                    {text}
                </span>
            ),
            sorter: (a, b) => a.Status.length - b.Status.length,
        },
    ]
    //New Chart
    const [userchart] = useState<any>({
        series: [{
            name: 'Data',
            data: [34, 44, 54, 21, 12, 43, 33, 23, 66, 66, 58, 29] // Sample data for each month
        }],
        chart: {
            type: 'bar',
            height: 185
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Months
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val: any) {
                    return val + " units";
                }
            }
        },
        colors: ['#00E396'] // Bar color (green in this case)
    });

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
        </>






    )
}

export default UserReports
