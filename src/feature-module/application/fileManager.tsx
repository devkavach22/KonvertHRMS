import  { useState } from "react";
import { Link } from "react-router-dom";
import FileModal from "./fileModal";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactApexChart from "react-apexcharts";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";
import { all_routes } from "../../router/all_routes";

const FileManager = () => {

  const routes = all_routes;
  const video = {
    dots: false,
    autoplay: false,
    slidesToShow: 3,
    margin: 24,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };
  const [Storage] = useState<any>({
    chart: {
      height: 200,
      type: 'donut',
      toolbar: {
        show: false,
      },
      offsetY: -10,
      events: {

      },
    },
    plotOptions: {
      pie: {
        startAngle: -100,
        endAngle: 100,
        donut: {
          size: '80%',
          labels: {
            show: true,
            name: {
              show: true,
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    stroke: {
      show: false
    },
    colors: ['#0C4B5E', '#FFC107', '#1B84FF', '#AB47BC', '#FD3995'],
    series: [20, 20, 20, 20, 20],
    labels: ['Documents', 'Video', 'Music', 'Photos', 'Other'],
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
    }],
    grid: {
      padding: {
        bottom: -60  // Reduce padding from the bottom
      }
    }
  })
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">File Manager</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Application</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    File Manager
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              <div className="me-2 mb-2">
                <div className="input-icon-start position-relative">
                  <span className="input-icon-addon">
                    <i className="ti ti-calendar" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Files / Folders"
                  />
                </div>
              </div>
              <div className="me-2 mb-2">
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    All Files
                  </Link>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        All Files
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        Music
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        Video
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        Documents
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        Photos
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mb-2">
                <Link
                  to="#"
                  data-bs-toggle="modal" data-inert={true}
                  data-bs-target="#add_folder"
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-circle-plus me-2" />
                  Create Folder
                </Link>
              </div>
              <div className="ms-2 head-icons">
                <CollapseHeader />
              </div>
            </div>
          </div>
          <div className="row">
            {/* Dropbox */}
            
            {/* /Dropbox */}
            {/* Google Drive */}
            
            {/* /Google Drive */}
            {/* Cloud Storage */}
            
            {/* /Cloud Storage */}
            {/* Internal Storage */}
           
            {/* /Internal Storage */}
          </div>
          <div className="row">
            {/* Sidebar */}
            <div className="col-xl-3  theiaStickySidebar">
              <div className="sticky-class">
                
               
              </div>

            </div>
            {/* /Sidebar */}
           
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


      <FileModal />



    </>

  );
};

export default FileManager;
