import  { useState } from 'react'
import { Link } from 'react-router-dom'
import Table from "../../../core/common/dataTable/index";
import { all_routes } from '../../../router/all_routes';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import PredefinedDateRanges from '../../../core/common/datePicker';
import { leavereportDetails } from '../../../core/data/json/leavereportDetails';
import ReactApexChart from 'react-apexcharts';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';

// Define interfaces
interface LeaveReportItem {
    InvoiceID: string;
    ClientName: string;
    Image: string;
    Role: string;
    CompanyName: string;
    CreatedDate: string;
    DueDate: string;
    Amount: string;
    Status: string;
    [key: string]: any; // Remove if not needed
}

interface ColumnType<T> {
    title: string;
    dataIndex: keyof T | string;
    render?: (text: any, record?: T) => React.ReactNode;
    sorter?: (a: T, b: T) => number;
}

const LeaveReport = () => {

    const data: LeaveReportItem[] = leavereportDetails;
    const columns: ColumnType<LeaveReportItem>[] = [
        {
            title: "Invoice ID",
            dataIndex: "InvoiceID",
            render: (text: string) => (
                <Link to={all_routes.invoiceDetails} className="link-default">{text}</Link>
            ),
            sorter: (a, b) => a.InvoiceID.length - b.InvoiceID.length,
        },
        {
            title: "Client Name",
            dataIndex: "ClientName",
            render: (_text: string, record?: LeaveReportItem) => (
                <div className="d-flex align-items-center">
                    <Link
                        to="#"
                        className="avatar avatar-md"
                        data-bs-toggle="modal" data-inert={true}
                        data-bs-target="#view_details"
                    >
                        <ImageWithBasePath
                            src={`assets/img/reports/${record?.Image}`}
                            className="img-fluid rounded-circle"
                            alt="reports-image"
                        />
                    </Link>
                    <div className="ms-2">
                        <p className="text-dark mb-0">
                            <Link to="#" data-bs-toggle="modal" data-inert={true} data-bs-target="#view_details">
                                {record?.ClientName}
                            </Link>
                        </p>
                        <span className="fs-12">{record?.Role}</span>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.ClientName.length - b.ClientName.length,
        },
        {
            title: "Company Name",
            dataIndex: "CompanyName",
            sorter: (a, b) => a.CompanyName.length - b.CompanyName.length,
        },
        {
            title: "Created Date",
            dataIndex: "CreatedDate",
            sorter: (a, b) => a.CreatedDate.length - b.CreatedDate.length,
        },
        {
            title: "Due Date",
            dataIndex: "DueDate",
            sorter: (a, b) => a.DueDate.length - b.DueDate.length,
        },
        {
            title: "Amount",
            dataIndex: "Amount",
            sorter: (a, b) => a.Amount.length - b.Amount.length,
        },
        {
            title: "Status",
            dataIndex: "Status",
            render: (text: string) => (
                <span className={`badge d-inline-flex align-items-center badge-xs ${text === 'Paid'
                    ? 'badge-soft-success'
                    : text === 'Sent'
                        ? 'badge-soft-purple'
                        : 'badge-soft-warning'
                    }`}>
                    {text}
                </span>
            ),
            sorter: (a, b) => a.Status.length - b.Status.length,
        },
    ]
    //New Chart
    const [leavechart] = useState<any>({
        series: [{
            name: 'Annual Leave',
            data: [30, 40, 35, 50, 50, 60, 30, 40, 35, 50, 50, 60] // Replace with your data
        }, {
            name: 'Casual Leave',
            data: [20, 30, 25, 40, 50, 60, 20, 30, 25, 40, 50, 60] // Replace with your data
        }, {
            name: 'Medical Leave',
            data: [15, 10, 20, 15, 50, 60, 15, 10, 20, 15, 50, 60] // Replace with your data
        }, {
            name: 'Others',
            data: [25, 20, 30, 35, 50, 60, 25, 20, 30, 35, 50, 60] // Replace with your data
        },
        ],
        chart: {
            type: 'bar',
            height: 210, // Change this value to your desired height
            stacked: true,
            stackType: '100%'
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',] // Update to match your time frame
        },
        yaxis: {
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
        colors: ['#03C95A', '#FFC107', '#0C4B5E', '#F26522'], // Set your colors here
        dataLabels: {
            enabled: false // Disable data labels
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

export default LeaveReport
