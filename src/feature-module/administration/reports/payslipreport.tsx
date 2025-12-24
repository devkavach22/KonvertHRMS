import { useState } from 'react'
import { Link } from 'react-router-dom'
import PredefinedDateRanges from '../../../core/common/datePicker'
import Table from "../../../core/common/dataTable/index";
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { payslipreportDetails } from '../../../core/data/json/payslipreportDetails';
import ReactApexChart from 'react-apexcharts';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';
import { all_routes } from '../../../router/all_routes';

// Define interfaces
interface PayslipReportItem {
    Name: string;
    Image: string;
    Role: string;
    PaidAmount: string;
    PaidMonth: string;
    PaidYear: string;
    [key: string]: any; // Remove if not needed
}

interface ColumnType<T> {
    title: string;
    dataIndex: keyof T | string;
    render?: (text: any, record?: T) => React.ReactNode;
    sorter?: (a: T, b: T) => number;
}

const PayslipReport = () => {

    const data: PayslipReportItem[] = payslipreportDetails;
    const columns: ColumnType<PayslipReportItem>[] = [
        {
            title: "Name",
            dataIndex: "Name",
            render: (_text: string, record?: PayslipReportItem) => (
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
                            alt={record?.Name || "Employee"} // alt attribute added
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
            title: "Paid Amount",
            dataIndex: "PaidAmount",
            sorter: (a, b) => a.PaidAmount.length - b.PaidAmount.length,
        },
        {
            title: "Paid Month",
            dataIndex: "PaidMonth",
            sorter: (a, b) => a.PaidMonth.length - b.PaidMonth.length,
        },
        {
            title: "Paid Year",
            dataIndex: "PaidYear",
            sorter: (a, b) => a.PaidYear.length - b.PaidYear.length,
        },
    ]
    //New Chart
    const [payslipchart] = useState<any>({
        series: [{
            data: [22, 20, 30, 45, 55, 45, 20, 70, 25, 30, 10, 30]
        }],
        chart: {
            type: 'line',
            height: 200,
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: {
            }
        },
        stroke: {
            curve: 'stepline',
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            hover: {
                sizeOffset: 4
            }
        },
        colors: ['#FF5733'],
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

export default PayslipReport
