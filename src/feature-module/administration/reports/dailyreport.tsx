import { useState } from 'react'
import { Link } from 'react-router-dom'
import Table from "../../../core/common/dataTable/index";
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import PredefinedDateRanges from '../../../core/common/datePicker';
import { dailyreportDetails } from '../../../core/data/json/dailyreportDetails';
import ReactApexChart from 'react-apexcharts';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';
import { all_routes } from '../../../router/all_routes';

// Define interfaces
interface DailyReportItem {
    Name: string;
    Image: string;
    Role: string;
    Date: string;
    Department: string;
    Status: string;
    [key: string]: any; // Remove if not needed
}

interface ColumnType<T> {
    title: string;
    dataIndex: keyof T | string;
    render?: (text: any, record?: T) => React.ReactNode;
    sorter?: (a: T, b: T) => number;
}

const DailyReport = () => {

    const data: DailyReportItem[] = dailyreportDetails;
    const columns: ColumnType<DailyReportItem>[] = [
        {
            title: "Name",
            dataIndex: "Name",
            render: (_text: string, record?: DailyReportItem) => (
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
                            alt="users-imgage"
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
            title: "Department",
            dataIndex: "Department",
            sorter: (a, b) => a.Department.length - b.Department.length,
        },
        {
            title: "Status",
            dataIndex: "Status",
            render: (text: string) => (
                <span className={`badge  d-inline-flex align-items-center badge-xs ${text === 'Present' ? 'badge-soft-success' : 'badge-soft-danger'}`}>
                    <i className="ti ti-point-filled me-1"></i>{text}
                </span>
            ),
            sorter: (a, b) => a.Status.length - b.Status.length,
        },
    ];

    // Chart config can be typed for better safety, but left as any for brevity
    const [dailychart] = useState<any>({
        series: [{
            name: "Present",
            data: [60, 40, 30, 20, 70,]
        }, {
            name: "Absent",
            data: [20, 60, 45, 60, 80,]
        }],
        chart: {
            height: 130,
            type: 'line',
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        stroke: { curve: 'smooth' },
        grid: {
            row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 }
        },
        xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] },
        yaxis: { labels: { offsetX: -15 } },
        colors: ['#4CAF50', '#F44336']
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

export default DailyReport
