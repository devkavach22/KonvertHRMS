import { useState } from 'react'
import { Link } from 'react-router-dom'
import PredefinedDateRanges from '../../../core/common/datePicker'
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import Table from "../../../core/common/dataTable/index";
import { invoiceDetails } from '../../../core/data/json/invoiceDetails';
import { all_routes } from '../../../router/all_routes';
import ReactApexChart from 'react-apexcharts';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';

// Define interfaces
interface InvoiceItem {
    invoice_id: string;
    client_name: string;
    image_url: string;
    position: string;
    company_name: string;
    created_date: string;
    due_date: string;
    amount: string;
    status: string;
    [key: string]: any; // Remove if not needed
}

interface ColumnType<T> {
    title: string;
    dataIndex: keyof T | string;
    render?: (text: any, record?: T) => React.ReactNode;
    sorter?: (a: T, b: T) => number;
}

const InvoiceReport = () => {

    const data: InvoiceItem[] = invoiceDetails;
    const columns: ColumnType<InvoiceItem>[] = [
        {
            title: "Invoice ID",
            dataIndex: "invoice_id",
            sorter: (a, b) => a.invoice_id.length - b.invoice_id.length,
        },
        {
            title: "Client Name",
            dataIndex: "client_name",
            render: (_text: string, record?: InvoiceItem) => (
                <div className="d-flex align-items-center file-name-icon">
                    <Link to="#" className="avatar avatar-md border avatar-rounded">
                        <ImageWithBasePath src={record?.image_url ?? ""} className="img-fluid" alt="image" />
                    </Link>
                    <div className="ms-2">
                        <h6 className="fw-medium">
                            <Link to="#">{record?.client_name}</Link>
                        </h6>
                        <span className="fs-12 fw-normal">{record?.position}</span>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.client_name.length - b.client_name.length,
        },
        {
            title: "Company Name",
            dataIndex: "company_name",
            sorter: (a, b) => a.company_name.length - b.company_name.length,
        },
        {
            title: "Created Date",
            dataIndex: "created_date",
            sorter: (a, b) => a.created_date.length - b.created_date.length,
        },
        {
            title: "Due Date",
            dataIndex: "due_date",
            sorter: (a, b) => a.due_date.length - b.due_date.length,
        },
        {
            title: "Amount",
            dataIndex: "amount",
            sorter: (a, b) => a.amount.length - b.amount.length,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text: string) => (
                <span className={`badge ${text === 'Paid'
                    ? 'badge-success-transparent'
                    : text === 'Sent'
                        ? 'badge-purple-transparent'
                        : 'badge-warning-transparent'
                    }`}>{text}</span>
            ),
            sorter: (a, b) => a.status.length - b.status.length,
        },
    ]
    //New Chart
    const [invoicechart] = useState<any>({
        series: [
            {
                name: 'Total Invoices',
                data: [40, 30, 40, 30, 40, 30], // Ensure data length matches categories
            },
            {
                name: 'Paid Invoices',
                data: [20, 10, 20, 10, 20, 10], // Ensure data length matches categories
            },
        ],
        chart: {
            height: 250,
            type: 'area',
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'straight',
        },
        xaxis: {
            type: 'category',
            categories: ['January', 'February', 'March', 'April', 'May', 'June'], // Match data points
        },
        yaxis: {
            labels: {
                offsetX: -15,
                formatter: function (value: number) {
                    return value + 'k'; // Ensure formatter returns a string
                },
            },
        },
        tooltip: {
            x: {
                formatter: function (value: string) {
                    return value; // Tooltip shows month labels
                },
            },
            y: {
                formatter: function (value: number) {
                    return value + 'k'; // Tooltip shows amounts with 'k' suffix
                },
            },
        },
        colors: ['#FD3995', '#FF9F43'],
    });

    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    {/* Breadcrumb */}
                 
                    {/* /Breadcrumb */}
                    <div className="row">
                        {/* Total Exponses */}
                       
                        {/* /Total Exponses */}
                        {/* Total Exponses */}
                    
                        {/* /Total Exponses */}
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


    )
}

export default InvoiceReport
