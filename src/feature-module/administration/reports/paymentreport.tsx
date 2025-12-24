import { useState } from 'react'
import { Link } from 'react-router-dom'
import PredefinedDateRanges from '../../../core/common/datePicker'
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import Table from "../../../core/common/dataTable/index";
import { all_routes } from '../../../router/all_routes';
import { paymentReport } from '../../../core/data/json/paymentReport';
import ReactApexChart from 'react-apexcharts';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';

// Define interfaces
interface PaymentReportItem {
    invoice_id: string;
    client_name: string;
    image_url: string;
    position: string;
    company_name: string;
    payment_type: string;
    paid_date: string;
    amount: string;
    [key: string]: any; // Remove if not needed
}

interface ColumnType<T> {
    title: string;
    dataIndex: keyof T | string;
    render?: (text: any, record?: T) => React.ReactNode;
    sorter?: (a: T, b: T) => number;
}

const PaymentReport = () => {

    const data: PaymentReportItem[] = paymentReport;
    const columns: ColumnType<PaymentReportItem>[] = [
        {
            title: "Invoice ID",
            dataIndex: "invoice_id",
            render: (text: string) => (
                <Link to={all_routes.invoiceDetails} className="link-default">
                    {text}
                </Link>
            ),
            sorter: (a, b) => a.invoice_id.length - b.invoice_id.length,
        },
        {
            title: "Client Name",
            dataIndex: "client_name",
            render: (_text: string, record?: PaymentReportItem) => (
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
            title: "Payment Type",
            dataIndex: "payment_type",
            sorter: (a, b) => a.payment_type.length - b.payment_type.length,
        },
        {
            title: "Paid Date",
            dataIndex: "paid_date",
            sorter: (a, b) => a.paid_date.length - b.paid_date.length,
        },
        {
            title: "Paid Amount",
            dataIndex: "amount",
            sorter: (a, b) => a.amount.length - b.amount.length,
        },
    ]
    //New Chart
    const [paymentreport] = useState<any>({
        series: [44, 55, 41, 17],
        chart: {
            type: 'donut',
        },
        colors: ['#0DCAF0', '#FD3995', '#AB47BC', '#FFC107'],
        labels: ['Paypal', 'Debit Card', 'Bank Transfer', 'Credit Card'],
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 270,
                stroke: {
                    show: true,
                    width: 10, // Width of the gap
                    colors: ['#FFFFFF'] // Color of the gap
                },
                donut: {
                    size: '80%' // Adjusts the size of the donut hole
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false // Set this to false to hide the legend
        },
        annotations: {
            position: 'front', // Ensure it appears above other elements
            style: {
                fontSize: '24px', // Adjust font size
                fontWeight: 'bold',
                color: '#000000' // Change color if needed
            },
            text: {
                // Set the annotation text
                text: '+14%',
                // Optional styling for the text box
                background: {
                    enabled: true,
                    foreColor: '#FFFFFF', // Text color
                    border: '#000000', // Border color
                    borderWidth: 1,
                    borderRadius: 2,
                    opacity: 0.7
                }
            },
            x: '50%', // Center horizontally
            y: '50%', // Center vertically
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    show: false // Also hide legend on smaller screens
                }
            }
        }]
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

export default PaymentReport
