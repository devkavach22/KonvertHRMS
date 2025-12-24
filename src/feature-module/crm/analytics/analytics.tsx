import { useState } from 'react'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import { all_routes } from '../../../router/all_routes'
import ReactApexChart from 'react-apexcharts'
import CollapseHeader from '../../../core/common/collapse-header/collapse-header'
import { ErrorBoundary } from 'react-error-boundary'

function ChartErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div className="alert alert-danger my-3" role="alert">
      <h5>Chart failed to load.</h5>
      <div className="mb-2">{error.message}</div>
      <button className="btn btn-sm btn-primary" onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

const Analytics = () => {
  const routes = all_routes
  const [dealsStage] = useState<any>({
    chart: {
      height: 310,
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
        horizontal: false,
        endingShape: 'rounded'
      },
    },
    series: [{
      name: 'Income',
      data: [80, 40, 100, 20]
    }, {
      name: 'Expenses',
      data: [100, 100, 100, 100]
    }],
    xaxis: {
      categories: ['Inpipeline', 'Follow Up', 'Schedule', 'Conversion'],
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '13px',
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -15,
        style: {
          colors: '#6B7280',
          fontSize: '13px',
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
  })
  const [leadSource] = useState<any>({
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
  })
  return (
    <div className="page-wrapper">
      <div className="content">

        <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="my-auto mb-2">
            <h2 className="mb-1">Analytics</h2>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}><i className="ti ti-smart-home"></i></Link>
                </li>
                <li className="breadcrumb-item">
                  CRM
                </li>
                <li className="breadcrumb-item active" aria-current="page">Analytics</li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
            <div className="me-2 mb-2">
              <div className="dropdown">
                <Link to="#" className="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  <i className="ti ti-file-export me-1"></i>Export
                </Link>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <Link to="#" className="dropdown-item rounded-1"><i className="ti ti-file-type-pdf me-1"></i>Export as PDF</Link>
                  </li>
                  <li>
                    <Link to="#" className="dropdown-item rounded-1"><i className="ti ti-file-type-xls me-1"></i>Export as Excel </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="input-icon w-120 position-relative mb-2">
              <span className="input-icon-addon">
                <i className="ti ti-calendar text-gray-9"></i>
              </span>
              <input type="text" className="form-control datetimepicker" value="15 Apr 2025" />
            </div>
            <div className="head-icons ms-2 ">
              <CollapseHeader />
            </div>
          </div>
        </div>

       

      </div>

      <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
        <p className="mb-0">2014 - 2025 &copy; SmartHR.</p>
        <p>Designed &amp; Developed By <Link to="#" className="text-primary">Dreams</Link></p>
      </div>

    </div>
  )
}

export default Analytics