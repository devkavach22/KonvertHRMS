import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Chart } from "primereact/chart";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";

const DealsDashboard = () => {
  const routes = all_routes;
const chartOptions: ApexOptions = {
  series: [
    {
      name: '',
      data: [1380, 1100, 990, 880, 740, 540],
    },
  ],
  chart: {
    type: 'bar' as const,
    height: 280,
  },
  plotOptions: {
    bar: {
      borderRadius: 0,
      horizontal: true,
      distributed: true,
      barHeight: '80%',
      isFunnel: true,
    },
  },
  colors: ['#F26522', '#F37438', '#F5844E', '#F69364', '#F7A37A', '#F9B291'],
  dataLabels: {
    enabled: true,
    formatter: function (opt:any) {
      return opt?.w?.globals?.labels?.[opt.dataPointIndex] ?? '';
    },
    dropShadow: {
      enabled: true,
    },
  },
  xaxis: {
    categories: [
      'Marketing : 7,898',
      'Sales : 4658',
      'Email : 2898',
      'Chat : 789',
      'Operational : 655',
      'Calls : 454',
    ],
  },
  legend: {
    show: false,
  },
};

  interface DealStageSeries {
    name: string;
    data: number[];
  }

  interface DealsStageOptions {
    chart: object;
    colors: string[];
    responsive: object[];
    plotOptions: object;
    series: DealStageSeries[];
    xaxis: object;
    yaxis: object;
    grid: object;
    legend: object;
    dataLabels: object;
    fill: object;
  }

  const [deals_stage] = useState<DealsStageOptions>({
    chart: {
      height: 310,
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ["#FF6F28", "#F8F9FA"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: false,
        endingShape: "rounded",
      },
    },
    series: [
      {
        name: "Income",
        data: [80, 40, 100, 20],
      },
      {
        name: "Expenses",
        data: [100, 100, 100, 100],
      },
    ],
    xaxis: {
      categories: ["Inpipeline", "Follow Up", "Schedule", "Conversion"],
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "13px",
        },
      },
    },
    yaxis: {
      labels: {
        offsetX: -15,
        style: {
          colors: "#6B7280",
          fontSize: "13px",
        },
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 5,
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    fill: {
      opacity: 1,
    },
  });

  //Attendance ChartJs
  const [CanvaData, setCanvaData] = useState({});
  const [, setCanvaOptions] = useState({});
  useEffect(() => {
    const data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ayg"], // Common labels for both series
      datasets: [
        {
          label: "Email", // First series
          data: [40, 70, 20, 40, 40, 70, 40, 60],
          backgroundColor: "#2dcb73",
          borderColor: "#2dcb73",
          pointBackgroundColor: "#2dcb73",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(255, 99, 132, 1)",
          tension: 0.3,
        },
        {
          label: "Chat", // Second series
          data: [30, 30, 90, 30, 60, 30, 60, 90],
          backgroundColor: "#4b3088",
          borderColor: "#4b3088",
          pointBackgroundColor: "#4b3088",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(54, 162, 235, 1)",
          tension: 0.4,
        },
        {
          label: "Series 3", // Second series
          data: [70, 43, 70, 90, 30, 30, 30, 40],
          backgroundColor: "#F26522",
          borderColor: "#F26522",
          pointBackgroundColor: "#F26522",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(54, 162, 235, 1)",
          tension: 0.4,
        },
      ],
    };
    const options = {
      responsive: false,
      scales: {
        r: {
          angleLines: {
            display: true,
            color: "#e9e9e9", // Color of the radial lines
          },
          grid: {
            circular: true, // Make the grid lines circular
          },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            stepSize: 30,
          },
        },
      },
      plugins: {
        legend: {
          display: false, // This hides the legend
        },
      },
    };

    setCanvaData(data);
    setCanvaOptions(options);
  }, []);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Deals Dashboard</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Dashboard</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Deals Dashboard
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              <div className="me-2 mb-2">
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
                      <Link to="#" className="dropdown-item rounded-1">
                        <i className="ti ti-file-type-pdf me-1" />
                        Export as PDF
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        <i className="ti ti-file-type-xls me-1" />
                        Export as Excel{" "}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="input-icon mb-2 position-relative">
                <PredefinedDateRanges />
              </div>
              <div className="ms-2 head-icons">
                <CollapseHeader />
              </div>
            </div>
          </div>
          {/* /Breadcrumb */}
          <div className="row">
            <div className="col-xl-6 d-flex">
              <div className="row flex-fill">
                <div className="col-sm-6">
                 
                </div>
              
              </div>
            </div>
          
          </div>
          <div className="row">
            <div className="col-xl-4 d-flex">
             
            </div>
            
            
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
  );
};

export default DealsDashboard;
