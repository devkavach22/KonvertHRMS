import { useState } from 'react'
import { Link } from 'react-router-dom'
import Table from "../../../core/common/dataTable/index";
import { all_routes } from '../../../router/all_routes';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { attendencereportDetails } from '../../../core/data/json/attendencereportDetails';
import PredefinedDateRanges from '../../../core/common/datePicker';
import ReactApexChart from 'react-apexcharts';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';

// Define interfaces
interface AttendanceReportItem {
    Name: string;
    Image: string;
    Role: string;
    Date: string;
    CheckIn: string;
    Status: string;
    CheckOut: string;
    Break: string;
    Late: string;
    Overtime: string;
    ProductionHours: string;
    [key: string]: any; // Remove if not needed
}

interface ColumnType<T> {
    title: string;
    dataIndex: keyof T | string;
    render?: (text: any, record?: T) => React.ReactNode;
    sorter?: (a: T, b: T) => number;
}

const AttendanceReport = () => {

    const data: AttendanceReportItem[] = attendencereportDetails;
    const columns: ColumnType<AttendanceReportItem>[] = [
        {
            title: "Name",
            dataIndex: "Name",
            render: (_text: string, record?: AttendanceReportItem) => (
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
                            alt="users-image"
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
            title: "Date",
            dataIndex: "Date",
            sorter: (a, b) => a.Date.length - b.Date.length,
        },
        {
            title: "Check in",
            dataIndex: "CheckIn",
            sorter: (a, b) => a.CheckIn.length - b.CheckIn.length,
        },
        {
            title: "Status",
            dataIndex: "Status",
            render: (text: string) => (
                <span className={`badge  d-inline-flex align-items-center badge-xs ${text === 'Present' ? 'badge-soft-success' : 'badge-soft-danger'}`}>
                    <i className="ti ti-point-filled me-1" />
                    {text}
                </span>
            ),
            sorter: (a, b) => a.Status.length - b.Status.length,
        },
        {
            title: "Check Out",
            dataIndex: "CheckOut",
            sorter: (a, b) => a.CheckOut.length - b.CheckOut.length,
        },
        {
            title: "Break",
            dataIndex: "Break",
            sorter: (a, b) => a.Break.length - b.Break.length,
        },
        {
            title: "Late",
            dataIndex: "Late",
            sorter: (a, b) => a.Late.length - b.Late.length,
        },
        {
            title: "Overtime",
            dataIndex: "Overtime",
            sorter: (a, b) => a.Overtime.length - b.Overtime.length,
        },
        {
            title: "Production Hours",
            dataIndex: "ProductionHours",
            render: (_text: string, record?: AttendanceReportItem) => (
                <span className={`badge d-inline-flex align-items-center badge-sm ${record && record.ProductionHours < '8.00'
                    ? 'badge-danger'
                    : record && record.ProductionHours >= '8.00' && record.ProductionHours <= '9.00'
                        ? 'badge-success'
                        : 'badge-info'
                    }`}
                >
                    <i className="ti ti-clock-hour-11 me-1"></i>{record?.ProductionHours}
                </span>
            ),
            sorter: (a, b) => a.ProductionHours.length - b.ProductionHours.length,
        },
    ];

    //New Chart
    const [attendancechart] = useState<any>({
        series: [{
            name: "Present",
            data: [30, 65, 70, 75, 80, 95, 100, 70, 65] // Example data for Present
        }, {
            name: "Absent",
            data: [30, 55, 60, 65, 50, 70, 80, 60, 70] // Example data for Absent
        }],
        chart: {
            height: 200, // Change height here
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth' // Change to 'smooth' for a nicer appearance
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // alternating row colors
                opacity: 0.5
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        }, yaxis: {
            labels: {
                offsetX: -15,
            }
        },
        colors: ['#28a745', '#ff69b4'] // Green for Present, Pink for Absent
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

export default AttendanceReport
