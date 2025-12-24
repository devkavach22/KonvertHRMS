import { useState } from 'react'
import { Link } from 'react-router-dom'
import PredefinedDateRanges from '../../../core/common/datePicker'
import Table from "../../../core/common/dataTable/index";
import { all_routes } from '../../../router/all_routes';
import { taskDetails } from '../../../core/data/json/taskDetails';
import ReactApexChart from 'react-apexcharts';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';

// Define interfaces
interface TaskItem {
    TaskName: string;
    ProjectName: string;
    CreatedDate: string;
    DueDate: string;
    Priority: string;
    Status: string;
    [key: string]: any; // Remove if not needed
}

interface ColumnType<T> {
    title: string;
    dataIndex: keyof T | string;
    render?: (text: any, record?: T) => React.ReactNode;
    sorter?: (a: T, b: T) => number;
}

const TaskReport = () => {

    const data: TaskItem[] = taskDetails;
    const columns: ColumnType<TaskItem>[] = [
        {
            title: "Task Name",
            dataIndex: "TaskName",
            render: (text: string) => (
                <div className="d-flex align-items-center file-name-icon">
                    <h6 className="fw-medium">
                        <Link to="#">{text}</Link>
                    </h6>
                </div>
            ),
            sorter: (a, b) => a.TaskName.length - b.TaskName.length,
        },
        {
            title: "Project Name",
            dataIndex: "ProjectName",
            sorter: (a, b) => a.ProjectName.length - b.ProjectName.length,
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
            title: "Priority",
            dataIndex: "Priority",
            render: (text: string) => (
                <span className={`badge  ${text === 'Low' ? 'badge-success-transparent' : text === 'Medium' ? 'badge-warning-transparent' : 'badge-danger-transparent'}`}>
                    <i className="ti ti-point-filled me-1"></i>{text}
                </span>
            ),
            sorter: (a, b) => a.Priority.length - b.Priority.length,
        },
        {
            title: "Status",
            dataIndex: "Status",
            render: (text: string) => (
                <span className={`badge  d-inline-flex align-items-center badge-xs ${text === 'Completed' ? 'badge-success' : text === 'Inprogress' ? 'badge-purple' : text === 'On Hold' ? 'badge-warning' : 'badge-skyblue'}`}>
                    <i className="ti ti-point-filled me-1" />
                    {text}
                </span>
            ),
            sorter: (a, b) => a.Status.length - b.Status.length,
        },
    ];

    //New Chart
    const [taskchart] = useState<any>({
        series: [40, 30, 20, 10],
        chart: {
            type: 'donut',
            width: 220,
        },
        colors: ['#03C95A', '#0DCAF0', '#FFC107', '#AB47BC'],
        labels: ['Completed ', 'Pending', 'Inprogress ', 'On Hold '],
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
    const [smalltask1] = useState<any>({
        chart: {
            width: 100,
            type: 'donut',
            toolbar: {
                show: false,
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '30%' // Adjusts the size of the donut hole
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        labels: ['Label 1', 'Label 2', 'Label 3'],
        series: [90, 10],
        colors: ['#F26522', 'rgba(67, 87, 133, .09)'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    show: false
                }
            }
        }],
        legend: {
            show: false
        },

    });

    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    {/* Breadcrumb */}
                    <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
                        <div className="my-auto mb-2">
                            <h2 className="mb-1">Task Report</h2>
                            <nav>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to={all_routes.adminDashboard}>
                                            <i className="ti ti-smart-home" />
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">HR</li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Task Report
                                    </li>
                                </ol>
                            </nav>
                        </div>
                        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
                            <div className="mb-2">
                                <div className="dropdown">
                                    <Link
                                        to="#"
                                        className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                        data-bs-toggle="dropdown"
                                    >
                                        <i className="ti ti-file-export me-1" />
                                        Export
                                    </Link>
                                    <ul className="dropdown-menu  dropdown-menu-end p-3">
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                            >
                                                <i className="ti ti-file-type-pdf me-1" />
                                                Export as PDF
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                            >
                                                <i className="ti ti-file-type-xls me-1" />
                                                Export as Excel{" "}
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="head-icons ms-2">
                                <CollapseHeader />
                            </div>
                        </div>
                    </div>
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

export default TaskReport
