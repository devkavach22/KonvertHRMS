import { useState } from 'react'
import { Link } from 'react-router-dom'
import PredefinedDateRanges from '../../../core/common/datePicker'
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import Table from "../../../core/common/dataTable/index";
import { all_routes } from '../../../router/all_routes';
import { projectDetails } from '../../../core/data/json/projectDetails';
import ReactApexChart from 'react-apexcharts';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';

// Define interfaces
interface ProjectItem {
    project_id: string;
    project_name: string;
    leader: string;
    leader_image: string;
    team?: string; // Made optional to match projectDetails
    team_img_1: string;
    team_img_2: string;
    team_img_3: string;
    team_img_count: string;
    deadline: string;
    priority: string;
    status: string;
    [key: string]: any; // Remove if not needed
}

interface ColumnType<T> {
    title: string;
    dataIndex: keyof T | string;
    render?: (text: any, record?: T) => React.ReactNode;
    sorter?: (a: T, b: T) => number;
}

const ProjectReport = () => {

    const data: ProjectItem[] = projectDetails;
    const columns: ColumnType<ProjectItem>[] = [
        {
            title: "Project ID",
            dataIndex: "project_id",
            sorter: (a, b) => a.project_id.length - b.project_id.length,
        },
        {
            title: "Project Name",
            dataIndex: "project_name",
            render: (text: string) => (
                <div className="d-flex align-items-center file-name-icon">
                    <h6 className="fw-medium">
                        <Link to="#">{text}</Link>
                    </h6>
                </div>
            ),
            sorter: (a, b) => a.project_name.length - b.project_name.length,
        },
        {
            title: "Leader",
            dataIndex: "leader",
            render: (_text: string, record?: ProjectItem) => (
                <div className="d-flex align-items-center file-name-icon">
                    <Link to="#" className="avatar avatar-md border avatar-rounded">
                        <ImageWithBasePath src={record?.leader_image || ""} className="img-fluid" alt={record?.leader || "Leader"} />
                    </Link>
                    <div className="ms-2">
                        <h6 className="fw-normal fs-14 text-gray-5">{record?.leader}</h6>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.leader.length - b.leader.length,
        },
        {
            title: "Team",
            dataIndex: "team",
            render: (_text: string, record?: ProjectItem) => (
                <div className="avatar-list-stacked avatar-group-sm">
                    <span className="avatar border-0">
                        <ImageWithBasePath
                            src={record?.team_img_1 || ""}
                            className="rounded-circle"
                            alt="Team member 1"
                        />
                    </span>
                    <span className="avatar border-0">
                        <ImageWithBasePath
                            src={record?.team_img_2 || ""}
                            className="rounded-circle"
                            alt="Team member 2"
                        />
                    </span>
                    <span className="avatar border-0">
                        <ImageWithBasePath
                            src={record?.team_img_3|| ""}
                            className="rounded-circle"
                            alt="Team member 3"
                        />
                    </span>
                    <span className="avatar group-counts bg-primary rounded-circle border-0 fs-10">
                        {record?.team_img_count}
                    </span>
                </div>
            ),
            sorter: (a, b) => (a.team?.length ?? 0) - (b.team?.length ?? 0),
        },
        {
            title: "Deadline",
            dataIndex: "deadline",
            sorter: (a, b) => a.deadline.length - b.deadline.length,
        },
        {
            title: "Priority",
            dataIndex: "priority",
            render: (text: string) => (
                <span className={`badge  ${text === 'Low' ? 'badge-success-transparent' : text === 'Medium' ? 'badge-warning-transparent' : 'badge-danger-transparent'}`}>
                    <i className="ti ti-point-filled me-1"></i>{text}
                </span>
            ),
            sorter: (a, b) => a.priority.length - b.priority.length,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text: string) => (
                <span className={`badge  d-inline-flex align-items-center badge-xs ${text === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                    <i className="ti ti-point-filled me-1" />
                    {text}
                </span>
            ),
            sorter: (a, b) => a.status.length - b.status.length,
        },
    ];

    //New Chart
    const [projectchart] = useState<any>({
        series: [30, 10, 20, 40],
        chart: {
            width: 280,
            type: 'pie',
        },
        labels: ['Pending', 'On Hold', 'In Progress', 'Completed'], // Set your labels here
        colors: ['#0DCAF0', '#AB47BC', '#FFC107', '#03C95A'], // Custom colors for each segment
        dataLabels: {
            enabled: false // Disable data labels to remove numbers
        },
        legend: {
            show: false // Hide the legend
        },
        tooltip: {
            y: {
                formatter: function (value: string) {
                    return 'Value: ' + value; // Customize the tooltip text
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
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

export default ProjectReport
