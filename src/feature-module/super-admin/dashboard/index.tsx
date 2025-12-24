import { Link } from 'react-router-dom'
import { all_routes } from '../../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header/collapse-header'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import ReactApexChart from "react-apexcharts";
import React, { type ReactNode } from 'react';
import PredefinedDatePicker from '@/core/common/datePicker';

// Error Boundary
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo) {
    // Optionally log error
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-4">
          <h4>Something went wrong.</h4>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Chart interfaces
interface ApexChartSeries {
  name: string;
  data: number[];
}
interface ApexChartOptions {
  chart: any;
  colors?: string[];
  responsive?: any[];
  plotOptions?: any;
  series?: ApexChartSeries[] | number[];
  xaxis?: any;
  yaxis?: any;
  grid?: any;
  legend?: any;
  dataLabels?: any;
  fill?: any;
  tooltip?: any;
  stroke?: any;
  labels?: string[];
}

const SuperAdminDashboard: React.FC = () => {
  const routes = all_routes;

  // Replace all useState<any> with useState<ApexChartOptions>
  const [CompanyChart] = React.useState<ApexChartOptions>({
    chart: {
      height: 240,
      type: 'bar',
      toolbar: { show: false }
    },
    colors: ['#212529'],
    responsive: [{
      breakpoint: 480,
      options: {
        legend: { position: 'bottom', offsetX: -10, offsetY: 0 }
      }
    }],
    plotOptions: {
      bar: {
        borderRadius: 10,
        borderRadiusWhenStacked: 'all',
        horizontal: false,
        endingShape: 'rounded',
        colors: {
          backgroundBarColors: ['#f3f4f5'],
          backgroundBarOpacity: 0.5,
          hover: { enabled: true, borderColor: '#F26522' }
        }
      }
    },
    series: [{ name: 'Company', data: [40, 60, 20, 80, 60, 60, 60] }],
    xaxis: {
      categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      labels: { style: { colors: '#6B7280', fontSize: '13px' } }
    },
    yaxis: { labels: { offsetX: -15, show: false } },
    grid: { borderColor: '#E5E7EB', strokeDashArray: 5, padding: { left: -8 } },
    legend: { show: false },
    dataLabels: { enabled: false },
    fill: { opacity: 1 }
  });
  const [RevenueChart] = React.useState<ApexChartOptions>({
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
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov', 'Dec'],
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
          formatter: function (value:any) {
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
          formatter: function (val:any) {
            return  val / 10 + " k"
          }
        }
      },
      fill: {
        opacity: 1
      },
  })
  const [PlanChart] = React.useState<ApexChartOptions>({
    chart: {
        height: 240,
        type: 'donut',
        toolbar: {
          show: false,
        }
      },
      colors: ['#FFC107', '#1B84FF', '#F26522'],
      series: [20, 60, 20],
      labels: ['Enterprise', 'Premium', 'Basic'],
      plotOptions: {
        pie: {
          donut: {
            size: '50%',
            labels: {
              show: false
            },
            borderRadius: 30
          }
        }
      },
      stroke: {
        lineCap: 'round',
        show: true,
        width: 0,    // Space between donut sections
        colors: '#fff'
      },
      dataLabels: {
        enabled: false
      },
      legend: { show: false },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            height: 180,
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
  })
  const [ApexChart] = React.useState<ApexChartOptions>({
    series: [{
        name: "Messages",
        data: [5,10,7,5,10,7,5]
      }],
  
      chart: {
        type: 'bar',
        width: 70,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        dropShadow: {
          enabled: false,
          top: 3,
          left: 14,
          blur: 4,
          opacity: .12,
          color: "#fff"
        },
        sparkline: {
          enabled: !0
        }
      },
      plotOptions: {
        bar: {
          horizontal: !1,
          columnWidth: "35%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: !0,
        width: 2.5,
        curve: "smooth"
      },
      colors: ["#FF6F28"],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
        labels: {
          show: false,}
      },
      tooltip: {
        show:false,
        theme: "dark",
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
  
        marker: {
          show: false
        }
      }
  })
  const [ApexChart2] = React.useState<ApexChartOptions>({
    series: [{
        name: "Messages",
        data: [5,3,7,6,3,10,5]
      }],
  
      chart: {
        type: 'bar',
        width: 70,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        dropShadow: {
          enabled: false,
          top: 3,
          left: 14,
          blur: 4,
          opacity: .12,
          color: "#fff"
        },
        sparkline: {
          enabled: !0
        }
      },
      plotOptions: {
        bar: {
          horizontal: !1,
          columnWidth: "35%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: !0,
        width: 2.5,
        curve: "smooth"
      },
      colors: ["#4B3088"],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
        labels: {
          show: false,}
      },
      tooltip: {
        show:false,
        theme: "dark",
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
  
        marker: {
          show: false
        }
      }
  })
  const [ApexChart3] = React.useState<ApexChartOptions>({
    series: [{
        name: "Messages",
        data: [8,10,10,8,8,10,8]
      }],
  
      chart: {
        type: 'bar',
        width: 70,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        dropShadow: {
          enabled: false,
          top: 3,
          left: 14,
          blur: 4,
          opacity: .12,
          color: "#fff"
        },
        sparkline: {
          enabled: !0
        }
      },
      plotOptions: {
        bar: {
          horizontal: !1,
          columnWidth: "35%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: !0,
        width: 2.5,
        curve: "smooth"
      },
      colors: ["#177DBC"],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
        labels: {
          show: false,}
      },
      tooltip: {
        show:false,
        theme: "dark",
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
  
        marker: {
          show: false
        }
      }
  })
  const [ApexChart4] = React.useState<ApexChartOptions>({
    series: [{
        name: "Messages",
        data: [5,10,7,5,10,7,5]
      }],
  
      chart: {
        type: 'bar',
        width: 70,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        dropShadow: {
          enabled: false,
          top: 3,
          left: 14,
          blur: 4,
          opacity: .12,
          color: "#fff"
        },
        sparkline: {
          enabled: !0
        }
      },
      plotOptions: {
        bar: {
          horizontal: !1,
          columnWidth: "35%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: !0,
        width: 2.5,
        curve: "smooth"
      },
      colors: ["#2DCB73"],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
        labels: {
          show: false,}
      },
      tooltip: {
        show:false,
        theme: "dark",
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
  
        marker: {
          show: false
        }
      }
  })
  return (
    <ErrorBoundary>
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Dashboard</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>
                      <i className="ti ti-smart-home" aria-hidden="true" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Superadmin</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Dashboard
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              <div className="input-icon mb-2 position-relative">
                <span className="input-icon-addon">
                  <i className="ti ti-calendar text-gray-9" aria-hidden="true" />
                </span>
                <PredefinedDatePicker/>
              </div>
              <div className="ms-2 head-icons">
                <CollapseHeader />
              </div>
            </div>
          </div>
          {/* /Breadcrumb */}
          {/* Welcome Wrap */}
          
        
          
          
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
    </ErrorBoundary>
  )
}

export default SuperAdminDashboard