import  { useState } from 'react'
import { Link } from 'react-router-dom'
import PredefinedDateRanges from '../../../core/common/datePicker'
import { expenseDetails } from '../../../core/data/json/expenseDetails';
import Table from "../../../core/common/dataTable/index";
import ReactApexChart from "react-apexcharts";
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';
import { all_routes } from '../../../router/all_routes';

// Define interfaces
interface ExpenseItem {
    expense_name: string;
    date: string;
    payment_method: string;
    amount: string;
    [key: string]: any; // Remove if not needed
}

interface ColumnType<T> {
    title: string;
    dataIndex: keyof T | string;
    render?: (text: any, record?: T) => React.ReactNode;
    sorter?: (a: T, b: T) => number;
}

const ExpensesReport = () => {

    const data: ExpenseItem[] = expenseDetails;
    const columns: ColumnType<ExpenseItem>[] = [
        {
            title: "Expense Name",
            dataIndex: "expense_name",
            render: (text: string) => (
                <h6 className="fs-14 fw-medium">{text}</h6>
            ),
            sorter: (a, b) => a.expense_name.length - b.expense_name.length,
        },
        {
            title: "Date",
            dataIndex: "date",
            sorter: (a, b) => a.date.length - b.date.length,
        },
        {
            title: "Payment Method",
            dataIndex: "payment_method",
            sorter: (a, b) => a.payment_method.length - b.payment_method.length,
        },
        {
            title: "Amount",
            dataIndex: "amount",
            sorter: (a, b) => a.amount.length - b.amount.length,
        },
    ];

    //New Chart
    const [expensechart] = useState<any>({
        series: [{
            name: "Sales Analysis",
            data: [10, 30, 18, 15, 22, 30, 40, 50, 40, 40, 60, 70]
        }],
        chart: {
            height: 190,
            type: 'area',
            zoom: {
                enabled: false
            }
        },
        colors: ['#FF9F43'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: '',
            align: 'left'
        },
        // grid: {
        //   row: {
        //     colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        //     opacity: 0.5
        //   },
        // },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        },
        yaxis: {
            min: 10,
            max: 60,
            tickAmount: 5,
            labels: {
                offsetX: -15,
                formatter: (val: number) => {
                    return val / 1 + 'K'
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left'
        }
    })

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

export default ExpensesReport
