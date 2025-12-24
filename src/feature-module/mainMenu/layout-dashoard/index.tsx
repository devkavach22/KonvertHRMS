import  { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link, useLocation } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../../router/all_routes";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Chart } from "primereact/chart";
import { Calendar } from 'primereact/calendar';
import ProjectModals from "../../../core/modals/projectModal";
import RequestModals from "../../../core/modals/requestModal";
import TodoModal from "../../../core/modals/todoModal";
import { useDispatch } from "react-redux";
import { resetAllMode, setDataLayout, setDataTheme, setDataWidth, setRtl } from "../../../core/data/redux/themeSettingSlice";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";
import ErrorBoundary from "../../../components/ErrorBoundary/ErrorBoundary";
type ChartSeries = {
  name?: string;
  data: number[];
};

interface EmpDepartmentOptions {
  chart: object;
  fill: object;
  colors: string[];
  grid: object;
  plotOptions: object;
  dataLabels: object;
  series: ChartSeries[];
  xaxis: object;
}

interface SalesIncomeOptions {
  chart: object;
  colors: string[];
  responsive: object[];
  plotOptions: object;
  series: ChartSeries[];
  xaxis: object;
  yaxis: object;
  grid: object;
  legend: object;
  dataLabels: object;
  fill: object;
}

const LayoutDemo = () => {
  const routes = all_routes;
  const Location = useLocation();
  const dispatch = useDispatch();
  const [isTodo, setIsTodo] = useState([false, false, false, false, false, false]);
  const [date, setDate] = useState(new Date());

  //New Chart
  const [empDepartment] = useState<EmpDepartmentOptions>({
    chart: {
      height: 235,
      type: 'bar',
      padding: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      toolbar: {
        show: false,
      }
    },
    fill: {
      colors: ['#F26522'],
      opacity: 1,
    },
    colors: ['#F26522'],
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5,
      padding: {
        top: -20,
        left: 0,
        right: 0,
        bottom: 0
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: true,
        barHeight: '35%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    series: [{
      data: [80, 110, 80, 20, 60, 100],
      name: 'Employee'
    }],
    xaxis: {
      categories: ['UI/UX', 'Development', 'Management', 'HR', 'Testing', 'Marketing'],
      labels: {
        style: {
          colors: '#111827',
          fontSize: '13px',
        }
      }
    }
  });

  const [salesIncome] = useState<SalesIncomeOptions>({
    chart: {
      height: 290,
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
    fill: {
      opacity: 1,
      colors: []
    },
  });

  //Attendance ChartJs
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  useEffect(() => {
    const data = {
      labels: ['Late', 'Present', 'Permission', 'Absent'],
      datasets: [
        {
          label: 'Semi Donut',
          data: [40, 20, 30, 10],
          backgroundColor: ['#0C4B5E', '#03C95A', '#FFC107', '#E70D0D'],
          borderWidth: 5,
          borderRadius: 10,
          borderColor: '#fff',
          hoverBorderWidth: 0,
          cutout: '60%',
        }
      ]
    };
    const options = {
      rotation: -100,
      circumference: 200,
      layout: {
        padding: {
          top: -20,
          bottom: -20,
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  //Semi Donut ChartJs
  const [semidonutData, setSemidonutData] = useState({});
  const [semidonutOptions, setSemidonutOptions] = useState({});
  const toggleTodo = (index: number) => {
    setIsTodo((prevIsTodo) => {
      const newIsTodo = [...prevIsTodo];
      newIsTodo[index] = !newIsTodo[index];
      return newIsTodo;
    });
  };
  useEffect(() => {
    const data = {
      labels: ["Ongoing", "Onhold", "Completed", "Overdue"],
      datasets: [
        {
          label: 'Semi Donut',
          data: [20, 40, 20, 10],
          backgroundColor: ['#FFC107', '#1B84FF', '#03C95A', '#E70D0D'],
          borderWidth: -10,
          borderColor: 'transparent',
          hoverBorderWidth: 0,
          cutout: '75%',
          spacing: -30,
        },
      ],
    };

    const options = {
      rotation: -100,
      circumference: 185,
      layout: {
        padding: {
          top: -20,
          bottom: 20,
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }, elements: {
        arc: {
          borderWidth: -30,
          borderRadius: 30,
        }
      },
    };

    setSemidonutData(data);
    setSemidonutOptions(options);

  }, []);

  useEffect(() => {
    if (Location.pathname === '/layout-horizontal') {
      dispatch(setDataLayout("horizontal"));
      dispatch(setRtl(""));
    } else if (Location.pathname === '/layout-horizontal-single') {
      dispatch(setDataLayout("horizontal-single"));
      dispatch(setRtl(""));
    } else if (Location.pathname === '/layout-detached') {
      dispatch(setDataLayout("detached"));
      dispatch(setRtl(""));
    } else if (Location.pathname === '/layout-twocolumn') {
      dispatch(setDataLayout("twocolumn"));
      dispatch(setRtl(""));
    } else if (Location.pathname === '/layout-without-header') {
      dispatch(setDataLayout("without-header"));
      dispatch(setRtl(""));
    } else if (Location.pathname === '/layout-horizontal-overlay') {
      dispatch(setDataLayout("horizontal-overlay"));
      dispatch(setRtl(""));
    } else if (Location.pathname === '/layout-horizontal-sidemenu') {
      dispatch(setDataLayout("horizontal-sidemenu"));
      dispatch(setRtl(""));
    } else if (Location.pathname === '/layout-modern') {
      dispatch(setDataLayout("modern"));
      dispatch(setRtl(""));
    } else if (Location.pathname === '/layout-transparent') {
      dispatch(setDataLayout("transparent"));
      dispatch(setRtl(""));
    } else if (Location.pathname === '/layout-horizontal-box') {
      dispatch(setDataLayout("mini"));
      dispatch(setDataWidth("box"));
      dispatch(setRtl(""));
    } else if (Location.pathname === '/layout-hovered') {
      dispatch(setDataLayout("default"));
      dispatch(setRtl(""));
    } else if (Location.pathname === '/layout-mini') {
      dispatch(setDataLayout("mini"));
      dispatch(setRtl(""));
    } else if (Location.pathname === '/layout-dark') {
      dispatch(setDataLayout("default"));
      dispatch(setDataTheme("dark"));
      dispatch(setRtl(""));
    } else if (Location.pathname === '/layout-rtl') {
      dispatch(setDataLayout("rtl"));
      dispatch(setRtl("layout-mode-rtl"));
    } else if (Location.pathname === '/layout-box') {
      dispatch(setDataLayout("mini"));
      dispatch(setDataWidth("box"));
      dispatch(setRtl(""));
    } else {
      dispatch(setDataLayout("default"));
      dispatch(setRtl(""));
    }
    return () => {
      dispatch(resetAllMode())
    }
  }, [dispatch, Location.pathname])





  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Admin Dashboard</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Dashboard</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Admin Dashboard
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              <div className="me-2 mb-2">
                <div className="dropdown">
                  <Link to="#"
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
              <div className="mb-2">
                <div className="input-icon w-120 position-relative">
                  <span className="input-icon-addon">
                    <i className="ti ti-calendar text-gray-9" />
                  </span>
                  <Calendar value={date} onChange={(e: any) => setDate(e.value)} view="year" dateFormat="yy" className="Calendar-form" />
                </div>
              </div>
              <div className="ms-2 head-icons">
                <CollapseHeader />
              </div>
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
      <ProjectModals />
      <RequestModals />
      <TodoModal />
    </>

  );
};

const LayoutDemoWithErrorBoundary = () => (
  <ErrorBoundary fallback={<div>Something went wrong loading the dashboard.</div>}>
    <LayoutDemo />
  </ErrorBoundary>
);

export default LayoutDemoWithErrorBoundary;

