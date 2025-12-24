import { useState } from 'react'
import { Link } from 'react-router-dom'
import PredefinedDateRanges from '../../../core/common/datePicker'
import Table from "../../../core/common/dataTable/index";
import { all_routes } from '../../../router/all_routes';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { employeereportDetails } from '../../../core/data/json/employeereportDetails';
import ReactApexChart from 'react-apexcharts';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';

// Define interfaces
interface EmployeeReportItem {
    EmpID: string;
    Name: string;
    Image: string;
    Role: string;
    Email: string;
    Department: string;
    Phone: string;
    JoiningDate: string;
    Status: string;
    [key: string]: any; // Remove if not needed
}

interface ColumnType<T> {
    title: string;
    dataIndex: keyof T | string;
    render?: (text: any, record?: T) => React.ReactNode;
    sorter?: (a: T, b: T) => number;
}

const EmployeeReports = () => {

    const data: EmployeeReportItem[] = employeereportDetails;
    const columns: ColumnType<EmployeeReportItem>[] = [
        {
            title: "Emp ID",
            dataIndex: "EmpID",
            render: (_text: string, record?: EmployeeReportItem) => (
                <Link to={all_routes.employeedetails} className="link-default">{record?.EmpID}</Link>
            ),
            sorter: (a, b) => a.EmpID.length - b.EmpID.length,
        },
        {
            title: "Name",
            dataIndex: "Name",
            render: (_text: string, record?: EmployeeReportItem) => (
                <div className="d-flex align-items-center">
                    <Link
                        to="#"
                        className="avatar avatar-md"
                        data-bs-toggle="modal" data-inert={true}
                        data-bs-target="#view_details"
                    >
                        <ImageWithBasePath
                            src={`assets/img/users/${record?.Image}`}
                            className="img-fluid rounded-circle"
                            alt="image"
                        />
                    </Link>
                    <div className="ms-2">
                        <p className="text-dark mb-0">
                            <Link to="#" data-bs-toggle="modal" data-inert={true} data-bs-target="#view_details">
                                {record?.Name}
                            </Link>
                        </p>
                        <span className="fs-12">{record?.Role}</span>
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
            title: "Department",
            dataIndex: "Department",
            sorter: (a, b) => a.Department.length - b.Department.length,
        },
        {
            title: "Phone",
            dataIndex: "Phone",
            sorter: (a, b) => a.Phone.length - b.Phone.length,
        },
        {
            title: "Joining Date",
            dataIndex: "JoiningDate",
            sorter: (a, b) => a.JoiningDate.length - b.JoiningDate.length,
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
    const [employeechart] = useState<any>({
        series: [{
            name: 'Active Employees',
            data: [50, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
            name: 'Inactive Employees',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }],
        chart: {
            type: 'bar',
            height: 180
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            }
        },
        colors: ['#03C95A', '#E8E9EA'], // Active Employees - Green, Inactive Employees - Gray
        dataLabels: {
            enabled: false, // Disable data labels
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
        }, yaxis: {
            labels: {
                offsetX: -15,
            }
        },
        fill: {
            opacity: 1
        },
        legend: {
            show: false
        },
        tooltip: {
            y: {
                formatter: function (val: string) {
                    return "$ " + val + " thousands";
                }
            }
        }
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

export default EmployeeReports
