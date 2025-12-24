import  { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import ReactApexChart from "react-apexcharts";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import PredefinedDateRanges from "../../../core/common/datePicker";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";

const LeadsDasboard = () => {
  const routes = all_routes;

  const [revenue_income] = useState<any>({
    chart: {
      height: 230,
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      }
    },
    colors: ['#FF6F28', '#F8F9FA'],
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
    plotOptions: {
      bar: {
        borderRadius: 5,
        borderRadiusWhenStacked: 'all',
        horizontal: false,
        endingShape: 'rounded'
      },
    },
    series: [{
      name: 'Income',
      data: [40, 30, 45, 80, 85, 90, 80, 80, 80, 85, 20, 80]
    }, {
      name: 'Expenses',
      data: [60, 70, 55, 20, 15, 10, 20, 20, 20, 15, 80, 20]
    }],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '13px',
        }
      }
    },
    yaxis: {
      min: 0,    // Set the minimum value of the Y-axis to 0
      max: 100,
      labels: {
        offsetX: -15,
        style: {
          colors: '#6B7280',
          fontSize: '13px',
        },
        formatter: function (value: string) {
          return value + "K"; // Divide by 1000 and append 'K'
        }
      }
    },
    grid: {
      borderColor: 'transparent',
      strokeDashArray: 5,
      padding: {
        left: -8,
      },
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val / 10 + " k"
        }
      }
    },
    fill: {
      opacity: 1
    },
  });
  const [heat_chart] = useState<any>({
    chart: {
      type: 'heatmap',
      height: 300,
    },
    colors: [
      "#9CA3AF",
      "#F37438",
      "#9CA3AF",
      "#F37438",
      "#9CA3AF",
      "#F37438",
    ],
    series: [
      {
        name: "0",
        data: [{
          x: 'Mon',
          y: 22
        },
        {
          x: 'Tue',
          y: 29
        },
        {
          x: 'Wed',
          y: 13
        },
        {
          x: 'Thu',
          y: 32
        },
        {
          x: 'Fri',
          y: 32
        },
        {
          x: 'Sat',
          y: 32
        },
        {
          x: 'Sun',
          y: 32
        },
        ]
      },
      {
        name: "20",
        data: [{
          x: 'Mon',
          y: 22,
          color: '#ff5722'
        },
        {
          x: 'Tue',
          y: 29
        },
        {
          x: 'Wed',
          y: 13
        },
        {
          x: 'Thu',
          y: 32
        },
        {
          x: 'Fri',
          y: 32
        },
        {
          x: 'Sat',
          y: 32
        },
        {
          x: 'Sun',
          y: 32
        },
        ]
      },
      {
        name: "40",
        data: [{
          x: 'Mon',
          y: 22
        },
        {
          x: 'Tue',
          y: 29
        },
        {
          x: 'Wed',
          y: 13
        },
        {
          x: 'Thu',
          y: 32
        },
        {
          x: 'Fri',
          y: 32
        },
        {
          x: 'Sat',
          y: 32
        },
        {
          x: 'Sun',
          y: 32
        },
        ]
      },
      {
        name: "60",
        data: [{
          x: 'Mon',
          y: 0
        },
        {
          x: 'Tue',
          y: 29
        },
        {
          x: 'Wed',
          y: 13
        },
        {
          x: 'Thu',
          y: 32
        },
        {
          x: 'Fri',
          y: 0
        },
        {
          x: 'Sat',
          y: 0
        },
        {
          x: 'Sun',
          y: 32
        },
        ]
      },
      {
        name: "80",
        data: [{
          x: 'Mon',
          y: 0
        },
        {
          x: 'Tue',
          y: 20
        },
        {
          x: 'Wed',
          y: 13
        },
        {
          x: 'Thu',
          y: 32
        },
        {
          x: 'Fri',
          y: 0
        },
        {
          x: 'Sat',
          y: 0
        },
        {
          x: 'Sun',
          y: 32
        },
        ]
      },
      {
        name: "120",
        data: [{
          x: 'Mon',
          y: 0
        },
        {
          x: 'Tue',
          y: 0
        },
        {
          x: 'Wed',
          y: 75
        },
        {
          x: 'Thu',
          y: 0
        },
        {
          x: 'Fri',
          y: 0
        },
        {
          x: 'Sat',
          y: 0
        },
        {
          x: 'Sun',
          y: 0
        },
        ]
      },
    ]
  });
  const [leads_stage] = useState<any>({
    chart: {
      height: 355,
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      }
    },
    colors: ['#FF6F28', '#F8F9FA'],
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
    plotOptions: {
      bar: {
        borderRadius: 5,
        borderRadiusWhenStacked: 'all',
        horizontal: false,
        endingShape: 'rounded'
      },
    },
    series: [{
      name: 'Income',
      data: [80, 40, 60, 40]
    }, {
      name: 'Expenses',
      data: [100, 100, 100, 100]
    }],
    xaxis: {
      categories: ['Competitor', 'Budget', 'Unresponsie', 'Timing'],
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '9px',
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -15,
        style: {
          colors: '#6B7280',
          fontSize: '10px',
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false // Disable data labels
    },
    fill: {
      opacity: 1
    },
  });
  const [donutchart2] = useState<any>({
    series: [25, 30, 10, 35], // Percentages for each section
    chart: {
      type: 'donut',
      height: 185,
    },
    labels: ['Paid', 'Google', 'Referals', 'Campaigns'], // Labels for the data
    colors: ['#FFC107', '#0C4B5E', '#AB47BC', '#FD3995'], // Colors from the image
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Google',
              formatter: function () {
                return '40%';
              }
            }
          }
        }
      }
    },
    stroke: {

      lineCap: 'round',
      show: true,
      width: 0,    // Space between donut sections
      colors: '#fff'
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false
    },
    label: {
      show: false,
    }
  });
  const [donutchart3] = useState<any>({
    series: [15, 10, 5, 10, 60], // Percentages for each section
    chart: {
      type: 'donut',
      height: 167,
    },
    labels: ['Paid', 'Google', 'Referals', 'Campaigns', 'Campaigns'], // Labels for the data
    colors: ['#F26522', '#FFC107', '#E70D0D', '#1B84FF', '#0C4B5E'], // Colors from the image
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Leads',
              formatter: function () {
                return '589';
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false,
    },
    label: {
      show: false,
    }
  });

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Leads Dashboard</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Dashboard</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Leads Dashboard
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
              <div className="input-icon mb-2 position-relative">
                <PredefinedDateRanges />
              </div>
              <div className="ms-2 head-icons">
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

  );
};

export default LeadsDasboard;
